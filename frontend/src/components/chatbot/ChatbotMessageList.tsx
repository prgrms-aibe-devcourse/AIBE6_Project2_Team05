"use client";

import type { ChatMessage } from "@/types/chatbot";
import { EstimateResultCard } from "./EstimateResultCard";
interface Props {
  messages: ChatMessage[];
  isLoading: boolean;
  onReset: () => void;
}

export function ChatbotMessageList({ messages, isLoading, onReset }: Props) {
  return (
    <div className="px-4 py-3 space-y-3 min-h-[320px] pt-6">
      {messages.map((msg, idx) =>
        msg.role === "estimate" && msg.estimate ? (
          <div key={idx} className="pt-2 pb-1">
            <EstimateResultCard
              key={idx}
              estimate={msg.estimate}
              onReset={onReset}
              showResetButton={idx === messages.length - 1}
            />
          </div>
        ) : (
          <div
            key={idx}
            className={`flex px-4 ${msg.role === "bot" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line
              ${
                msg.role === "bot"
                  ? "bg-gray-100 text-gray-800 rounded-tl-none"
                  : "bg-[#4f6231] text-white rounded-tr-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ),
      )}

      {isLoading && (
        <div className="flex justify-start px-4">
          <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ animation: "bounceColor 1s ease-in-out infinite 0ms" }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ animation: "bounceColor 1s ease-in-out infinite 150ms" }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ animation: "bounceColor 1s ease-in-out infinite 300ms" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
