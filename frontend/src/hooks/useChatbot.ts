// src/hooks/useChatbot.ts
import { INITIAL_BOT_MESSAGE, TURN_CONFIGS } from "@/constants/chatbot";
import type {
  ChatMessage,
  ChatResponse,
  EstimateResult,
  TurnStep,
} from "@/types/chatbot";
import { useState } from "react";

export function useChatbot() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", content: INITIAL_BOT_MESSAGE },
  ]);
  const [currentTurn, setCurrentTurn] = useState<TurnStep>(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentQuickReplies = isCompleted
    ? []
    : (TURN_CONFIGS[currentTurn]?.quickReplies ?? []);

  const resetChat = () => {
    setSessionId(null);
    setCurrentTurn(1);
    setIsCompleted(false);

    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        content:
          "다른 서비스도 견적을 내드릴게요!\n어떤 서비스가 필요하신가요? 💍",
      },
    ]);

    setEstimate(null);
    setIsLoading(false);
  };

  const sendMessage = async (userInput: string) => {
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chatbot/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sessionId,
          turn: currentTurn,
          userMessage: userInput,
        }),
      });

      if (!res.ok) {
        let errorMsg = "오류가 발생했습니다. 다시 시도해주세요.";
        if (res.status === 401) {
          errorMsg = "로그인이 필요한 서비스입니다.";
        } else if (res.status === 429) {
          errorMsg =
            "현재 견적 서비스가 일시적으로 혼잡합니다. 잠시 후 다시 시도해주세요. 🙏";
        } else if (res.status >= 500) {
          errorMsg = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        }
        setMessages((prev) => [...prev, { role: "bot", content: errorMsg }]);
        return;
      }

      const data: ChatResponse = await res.json();

      if (!sessionId) setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: "bot", content: data.message }]);

      if (data.isDone && data.estimate) {
        setIsCompleted(true);
        setEstimate(data.estimate);
        setMessages((prev) => [
          ...prev,
          { role: "estimate", content: "", estimate: data.estimate },
        ]);
      } else {
        setCurrentTurn((prev) => (prev + 1) as TurnStep);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    currentQuickReplies,
    currentTurn,
    isCompleted,
    estimate,
    isLoading,
    sendMessage,
    resetChat,
  };
}
