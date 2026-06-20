"use client";

import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { ArrowLeft, RefreshCw, Send } from "lucide-react";
import { use, useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getChatPresenceIndicator } from "@/app/chat/chat-presence.mjs";
import {
  createWebSocketUrl,
  fetchChatMessages,
  fetchChatRoom,
  fetchCurrentMember,
  markChatRoomRead,
  type ChatMessage,
  type ChatRoom,
  type MemberMe,
} from "@/lib/chat";
import { getAccessToken } from "@/lib/auth";
import { refreshAccessToken } from "@/lib/authFetch";

interface PendingMessage {
  key: string;
  content: string;
  createdAt: number;
  failed: boolean;
}

interface TypingEvent {
  roomId: number;
  userId: number;
  isTyping: boolean;
}

export default function ChatRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const router = useRouter();
  const numericRoomId = Number(roomId);

  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [me, setMe] = useState<MemberMe | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState("연결 준비 중");
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [opponentTyping, setOpponentTyping] = useState(false);

  const clientRef = useRef<Client | null>(null);
  const connectStompRef = useRef<(() => Promise<void>) | null>(null);
  const messageSubRef = useRef<StompSubscription | null>(null);
  const typingSubRef = useRef<StompSubscription | null>(null);
  const reconnectAttemptRef = useRef(0);
  const shouldReconnectRef = useRef(false);
  const suppressReconnectRef = useRef(false);
  const refreshTimerRef = useRef<number | null>(null);
  const typingThrottleRef = useRef(0);
  const typingIdleTimerRef = useRef<number | null>(null);
  const pendingTimersRef = useRef<Map<string, number>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const canSend = Boolean(room?.isActive) && connectionState === "연결됨";
  const isReconnectBusy =
    connectionState === "연결 중" || connectionState.startsWith("재연결 중");
  const presenceIndicator = getChatPresenceIndicator(room?.opponent.isOnline ?? false);
  const sortedMessages = useMemo(
    () =>
      [...messages].sort((a, b) => {
        const timeDiff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return timeDiff || a.id - b.id;
      }),
    [messages],
  );

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setStatusMessage(null);

      const [roomData, messagePage, meData] = await Promise.all([
        fetchChatRoom(numericRoomId),
        fetchChatMessages(numericRoomId),
        fetchCurrentMember(),
      ]);

      setRoom(roomData);
      setMessages(messagePage.content);
      setMe(meData);
      void markChatRoomRead(numericRoomId);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "채팅방에 접근할 수 없습니다.");
      setTimeout(() => router.replace("/reservations"), 1200);
    } finally {
      setLoading(false);
    }
  }, [numericRoomId, router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadInitialData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadInitialData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages.length, pendingMessages.length, opponentTyping]);

  const clearPendingTimer = useCallback((key: string) => {
    const timer = pendingTimersRef.current.get(key);
    if (timer) {
      window.clearTimeout(timer);
      pendingTimersRef.current.delete(key);
    }
  }, []);

  const handleIncomingMessage = useCallback(
    (body: string) => {
      const message = JSON.parse(body) as ChatMessage;
      if (message.roomId !== numericRoomId) return;

      setMessages((current) => {
        if (current.some((item) => item.id === message.id)) return current;
        return [...current, message];
      });

      if (message.senderId === me?.id) {
        setPendingMessages((current) => {
          const match = current.find(
            (item) => !item.failed && item.content === message.content,
          );
          if (match) {
            clearPendingTimer(match.key);
            return current.filter((item) => item.key !== match.key);
          }
          return current;
        });
      }

      void markChatRoomRead(numericRoomId);
    },
    [clearPendingTimer, me?.id, numericRoomId],
  );

  const handleTypingMessage = useCallback(
    (body: string) => {
      const event = JSON.parse(body) as TypingEvent;
      if (event.roomId !== numericRoomId || event.userId === me?.id) return;
      setOpponentTyping(event.isTyping);
    },
    [me?.id, numericRoomId],
  );

  const disconnectStomp = useCallback(() => {
    shouldReconnectRef.current = false;
    messageSubRef.current?.unsubscribe();
    typingSubRef.current?.unsubscribe();
    messageSubRef.current = null;
    typingSubRef.current = null;
    clientRef.current?.deactivate();
    clientRef.current = null;
  }, []);

  const connectStomp = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        router.replace(`/login?redirect=${encodeURIComponent(`/chat/${numericRoomId}`)}`);
        return;
      }
    }

    suppressReconnectRef.current = true;
    disconnectStomp();
    shouldReconnectRef.current = true;
    setConnectionState("연결 중");

    const client = new Client({
      brokerURL: createWebSocketUrl(),
      connectHeaders: {
        Authorization: `Bearer ${getAccessToken() ?? ""}`,
      },
      reconnectDelay: 0,
      onConnect: () => {
        suppressReconnectRef.current = false;
        reconnectAttemptRef.current = 0;
        setConnectionState("연결됨");
        messageSubRef.current = client.subscribe("/user/queue/messages", (message: IMessage) => {
          handleIncomingMessage(message.body);
        });
        client.subscribe("/user/queue/errors", (message: IMessage) => {
          setStatusMessage(JSON.parse(message.body)?.message ?? "메시지 처리에 실패했습니다.");
        });
        typingSubRef.current = client.subscribe(`/sub/chat/typing/${numericRoomId}`, (message: IMessage) => {
          handleTypingMessage(message.body);
        });
      },
      onStompError: (frame) => {
        suppressReconnectRef.current = false;
        setConnectionState("연결 실패");
        setStatusMessage(frame.headers.message ?? "채팅 연결에 실패했습니다.");
      },
      onWebSocketClose: () => {
        if (suppressReconnectRef.current) {
          suppressReconnectRef.current = false;
          return;
        }

        if (!shouldReconnectRef.current) return;

        const attempt = reconnectAttemptRef.current + 1;
        reconnectAttemptRef.current = attempt;
        if (attempt > 3) {
          setConnectionState("연결 실패");
          setStatusMessage("연결에 실패했습니다. 새로고침 해주세요.");
          return;
        }

        setConnectionState(`재연결 중 (${attempt}/3)`);
        window.setTimeout(() => {
          void connectStompRef.current?.();
        }, 1000 * 2 ** (attempt - 1));
      },
    });

    clientRef.current = client;
    client.activate();
  }, [
    disconnectStomp,
    handleIncomingMessage,
    handleTypingMessage,
    numericRoomId,
    router,
  ]);

  useEffect(() => {
    connectStompRef.current = connectStomp;
  }, [connectStomp]);

  useEffect(() => {
    if (!me || !room) return;
    const pendingTimers = pendingTimersRef.current;
    const connectTimer = window.setTimeout(() => {
      void connectStomp();
    }, 0);

    refreshTimerRef.current = window.setInterval(async () => {
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        disconnectStomp();
        router.replace(`/login?redirect=${encodeURIComponent(`/chat/${numericRoomId}`)}`);
        return;
      }
      void connectStomp();
    }, 570000);

    return () => {
      window.clearTimeout(connectTimer);
      if (refreshTimerRef.current) window.clearInterval(refreshTimerRef.current);
      disconnectStomp();
      pendingTimers.forEach((timer) => window.clearTimeout(timer));
      pendingTimers.clear();
    };
  }, [connectStomp, disconnectStomp, me, numericRoomId, room, router]);

  const publishTyping = useCallback(
    (isTyping: boolean) => {
      if (!clientRef.current?.connected) return;
      clientRef.current.publish({
        destination: "/pub/chat.typing",
        body: JSON.stringify({ roomId: numericRoomId, isTyping }),
      });
    },
    [numericRoomId],
  );

  const handleInputChange = (value: string) => {
    setInput(value);

    const now = Date.now();
    if (now - typingThrottleRef.current > 500) {
      typingThrottleRef.current = now;
      publishTyping(true);
    }

    if (typingIdleTimerRef.current) window.clearTimeout(typingIdleTimerRef.current);
    typingIdleTimerRef.current = window.setTimeout(() => publishTyping(false), 1500);
  };

  const sendMessage = useCallback(
    (content: string) => {
      if (!clientRef.current?.connected) {
        setStatusMessage("채팅 서버에 연결되지 않았습니다.");
        return;
      }

      const key = `${Date.now()}-${content}`;
      setPendingMessages((current) => [
        ...current,
        { key, content, createdAt: Date.now(), failed: false },
      ]);

      clientRef.current.publish({
        destination: "/pub/chat.send",
        body: JSON.stringify({ roomId: numericRoomId, content }),
      });

      const timer = window.setTimeout(() => {
        setPendingMessages((current) =>
          current.map((item) => (item.key === key ? { ...item, failed: true } : item)),
        );
        setStatusMessage("전송 실패. 재전송을 시도해주세요.");
      }, 3000);
      pendingTimersRef.current.set(key, timer);
    },
    [numericRoomId],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = input.trim();
    if (!content || content.length > 1000 || !canSend) return;

    setInput("");
    publishTyping(false);
    sendMessage(content);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();

    const content = input.trim();
    if (!content || content.length > 1000 || !canSend) {
      return;
    }

    setInput("");
    publishTyping(false);
    sendMessage(content);
  };

  const retryPendingMessage = (pending: PendingMessage) => {
    clearPendingTimer(pending.key);
    setPendingMessages((current) => current.filter((item) => item.key !== pending.key));
    sendMessage(pending.content);
  };

  if (loading) {
    return (
      <div className="flex min-h-full flex-col bg-[#fbf9f2]">
        <main className="flex flex-1 items-center justify-center">
          <p className="text-sm text-[#75786c]">채팅방을 불러오는 중입니다...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-[#fbf9f2]">
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c5c8ba] bg-white text-[#45483d] hover:bg-[#f5f4ec]"
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <h1 className="truncate text-xl font-semibold text-[#1b1c18]">
              {room?.opponent.name ?? "채팅방"}
            </h1>
            <p
              className={`inline-flex items-center justify-center gap-2 text-xs ${presenceIndicator.textClassName}`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${presenceIndicator.dotClassName}`}
                aria-hidden="true"
              />
              <span>{presenceIndicator.label}</span>
            </p>
          </div>

          <button
              type="button"
              onClick={() => void connectStomp()}
              disabled={isReconnectBusy}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c5c8ba] bg-white text-[#45483d] hover:bg-[#f5f4ec] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="재연결"
          >
            <RefreshCw className={`h-4 w-4 ${isReconnectBusy ? "animate-spin" : ""}`} />
          </button>
        </div>

        {statusMessage && (
          <div className="mb-4 rounded-lg border border-[#f6d9d3] bg-white px-4 py-3 text-sm text-[#6f5a55]">
            {statusMessage}
          </div>
        )}

        {!room?.isActive && (
          <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            이 예약은 취소되어 더 이상 채팅할 수 없습니다.
          </div>
        )}

        <section className="flex min-h-[560px] flex-1 flex-col overflow-hidden rounded-lg border border-[#efeee7] bg-white shadow-sm">
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
            {sortedMessages.length === 0 && pendingMessages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-[#75786c]">
                아직 주고받은 메시지가 없습니다.
              </div>
            ) : (
              sortedMessages.map((message) => {
                const mine = message.senderId === me?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                        mine
                          ? "bg-[#4f6231] text-white"
                          : "bg-[#f5f4ec] text-[#1b1c18]"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      <p
                        className={`mt-1 text-[11px] ${
                          mine ? "text-white/70" : "text-[#75786c]"
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

            {pendingMessages.map((pending) => (
              <div key={pending.key} className="flex justify-end">
                <div className="max-w-[78%] rounded-lg bg-[#677b47] px-4 py-3 text-sm leading-relaxed text-white opacity-75">
                  <p className="whitespace-pre-wrap break-words">{pending.content}</p>
                  <div className="mt-2 flex items-center justify-end gap-2 text-[11px] text-white/80">
                    <span>{pending.failed ? "전송 실패" : "전송 중"}</span>
                    {pending.failed && (
                      <button
                        type="button"
                        className="font-semibold underline"
                        onClick={() => retryPendingMessage(pending)}
                      >
                        재전송
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {opponentTyping && (
              <div className="text-sm text-[#75786c]">상대방이 입력 중...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-[#efeee7] bg-[#fbf9f2] p-4"
          >
            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(event) => handleInputChange(event.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={!room?.isActive}
                maxLength={1000}
                rows={1}
                className="max-h-32 min-h-11 flex-1 resize-none rounded-lg border border-[#c5c8ba] bg-white px-4 py-3 text-sm text-[#1b1c18] outline-none focus:border-[#4f6231] disabled:bg-[#efeee7]"
                placeholder={
                  room?.isActive ? "메시지를 입력하세요" : "취소된 예약입니다"
                }
              />
              <Button
                type="submit"
                disabled={!canSend || input.trim().length === 0 || input.length > 1000}
                className="h-11 rounded-lg bg-[#4f6231] px-4 text-white hover:bg-[#677b47]"
                aria-label="메시지 보내기"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-right text-xs text-[#75786c]">
              {input.length}/1000
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
