"use client";

import { Client, type IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, createAuthHeaders, getAccessToken } from "@/lib/auth";
import {
  createWebSocketUrl,
  fetchChatRoom,
  type ChatMessage,
} from "@/lib/chat";
import {
  fetchFreelancerProfile,
  fetchReservations,
  ReservationApiError,
  type ReservationResponse,
} from "@/lib/reservations";
import {
  shouldRedirectReservationAuth,
  shouldRenderReservationAuth,
  useReservationAuthState,
} from "./reservation-auth-view.js";
import {
  getNextChatNotificationIds,
  shouldNotifyReservationChat,
} from "./reservation-chat-notification.js";
import { ReservationList } from "./_components/ReservationList";

function getErrorMessage(error: unknown): string {
  if (error instanceof ReservationApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "예약 목록을 불러오지 못했습니다.";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseChatMessage(body: string): ChatMessage | null {
  try {
    const value: unknown = JSON.parse(body);
    if (
      !isRecord(value) ||
      typeof value.id !== "number" ||
      typeof value.roomId !== "number" ||
      typeof value.senderId !== "number" ||
      typeof value.receiverId !== "number" ||
      typeof value.content !== "string" ||
      typeof value.createdAt !== "string"
    ) {
      return null;
    }

    return {
      id: value.id,
      roomId: value.roomId,
      senderId: value.senderId,
      receiverId: value.receiverId,
      content: value.content,
      readAt: typeof value.readAt === "string" ? value.readAt : null,
      createdAt: value.createdAt,
    };
  } catch {
    return null;
  }
}

export default function ReservationsPage() {
  const router = useRouter();
  const { hasAccessToken, isMounted } = useReservationAuthState();
  const roomReservationIdsRef = useRef<Map<number, number>>(new Map());
  const [reservations, setReservations] = useState<readonly ReservationResponse[]>([]);
  const [profileImageUrls, setProfileImageUrls] = useState<
    Readonly<Record<number, string | null>>
  >({});
  const [chatNotificationIds, setChatNotificationIds] = useState<
    ReadonlySet<number>
  >(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);

  useEffect(() => {
    if (shouldRedirectReservationAuth({ hasAccessToken, isMounted })) {
      router.replace("/login?redirect=%2Freservations");
    }
  }, [hasAccessToken, isMounted, router]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [resData, meRes] = await Promise.all([
        fetchReservations(),
        fetch(`${API_BASE_URL}/api/v1/members/me`, {
          headers: createAuthHeaders(),
        }),
      ]);

      setReservations(resData);

      const freelancerProfileIds = [...new Set(resData.map((reservation) => reservation.freelancerProfileId))];
      const profileResults = await Promise.allSettled(
        freelancerProfileIds.map((profileId) => fetchFreelancerProfile(profileId)),
      );
      const nextProfileImageUrls: Record<number, string | null> = {};
      for (const [index, profileId] of freelancerProfileIds.entries()) {
        const result = profileResults[index];
        nextProfileImageUrls[profileId] =
          result?.status === "fulfilled" ? result.value.memberImageUrl : null;
      }

      setProfileImageUrls(nextProfileImageUrls);

      if (meRes.ok) {
        const meData = await meRes.json();
        setUserRole(meData.role);
        setCurrentMemberId(
          typeof meData.id === "number" ? meData.id : null,
        );
      }
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!shouldRenderReservationAuth({ hasAccessToken, isMounted })) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
  }, [hasAccessToken, isMounted, loadData]);

  const handleChatMessage = useCallback(
    async (message: ChatMessage) => {
      if (currentMemberId === null || message.senderId === currentMemberId) {
        return;
      }

      let reservationId = roomReservationIdsRef.current.get(message.roomId);
      if (reservationId === undefined) {
        const room = await fetchChatRoom(message.roomId);
        reservationId = room.reservationId;
        roomReservationIdsRef.current.set(message.roomId, reservationId);
      }

      if (
        shouldNotifyReservationChat({
          messageSenderId: message.senderId,
          currentMemberId,
          reservationId,
        })
      ) {
        setChatNotificationIds((current) =>
          getNextChatNotificationIds(current, reservationId),
        );
      }
    },
    [currentMemberId],
  );

  useEffect(() => {
    if (!hasAccessToken || currentMemberId === null) return;

    const client = new Client({
      brokerURL: createWebSocketUrl(),
      connectHeaders: {
        Authorization: `Bearer ${getAccessToken() ?? ""}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/user/queue/messages", (message: IMessage) => {
          const chatMessage = parseChatMessage(message.body);
          if (chatMessage) {
            void handleChatMessage(chatMessage);
          }
        });
      },
    });

    client.activate();

    return () => {
      void client.deactivate();
    };
  }, [currentMemberId, handleChatMessage, hasAccessToken]);

  const clearChatNotification = useCallback((reservationId: number) => {
    setChatNotificationIds((current) => {
      if (!current.has(reservationId)) return current;
      const next = new Set(current);
      next.delete(reservationId);
      return next;
    });
  }, []);

  if (!shouldRenderReservationAuth({ hasAccessToken, isMounted })) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-full bg-[#fbf9f2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <h1 className="font-[var(--font-display)] text-3xl font-semibold text-[#1b1c18] mb-2">
          {userRole === "FREELANCER" ? "예약 관리" : "내 예약 현황"}
        </h1>
        <p className="text-[#75786c] mb-10">
          {userRole === "FREELANCER"
            ? "고객님들이 요청하신 예약 현황을 관리하세요"
            : "요청하신 웨딩 전문가 예약 현황을 확인하세요"}
        </p>

        <ReservationList
          reservations={reservations}
          profileImageUrls={profileImageUrls}
          isLoading={isLoading}
          errorMessage={errorMessage}
          userRole={userRole}
          chatNotificationIds={chatNotificationIds}
          onRetry={() => void loadData()}
          onRefresh={() => void loadData()}
          onChatOpened={clearChatNotification}
        />
      </div>
    </div>
  );
}
