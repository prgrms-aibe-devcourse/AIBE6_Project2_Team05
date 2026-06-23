"use client";

import { useChatbot } from "@/hooks/useChatbot";
import { useEffect, useRef, useState } from "react";
import { ChatbotHeader } from "./ChatbotHeader";
import { ChatbotMessageList } from "./ChatbotMessageList";
import { ChatbotQuickReply } from "./ChatbotQuickReply";
import { ChatbotToggleButton } from "./ChatbotToggleButton";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    currentQuickReplies,
    isCompleted,
    estimate,
    isLoading,
    sendMessage,
    resetChat,
  } = useChatbot();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  useEffect(() => {
    if (isCompleted && estimate) {
      const times = [100, 300, 500, 800, 1200];
      const timers = times.map((delay) =>
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = 999999;
          }
        }, delay),
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [isCompleted, estimate]);


  return (
    <>
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-40 w-[380px] bg-white border border-[#efeee7] rounded-2xl shadow-xl flex flex-col overflow-hidden
  max-h-[calc(100vh-180px)]
  max-sm:w-full max-sm:right-0 max-sm:bottom-0 max-sm:rounded-b-none max-sm:max-h-[85vh]"
        >
          <ChatbotHeader onClose={() => setIsOpen(false)} />
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto flex flex-col min-h-0"
          >
            <ChatbotMessageList
              messages={messages}
              isLoading={isLoading}
              onReset={resetChat}
            />
          </div>
          <ChatbotQuickReply
            quickReplies={currentQuickReplies}
            onSelect={sendMessage}
            disabled={isLoading}
          />
        </div>
      )}

      <ChatbotToggleButton
        isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      />
    </>
  );
}
