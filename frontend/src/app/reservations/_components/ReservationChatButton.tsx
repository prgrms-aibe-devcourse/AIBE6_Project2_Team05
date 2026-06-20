"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createChatRoom } from "@/lib/chat";
import type { ReservationStatus } from "@/lib/reservations";
import { canStartReservationChat } from "../reservation-chat.js";

type ReservationChatButtonProps = {
  readonly reservationId: number;
  readonly status: ReservationStatus;
  readonly className?: string;
};

export function ReservationChatButton({
  reservationId,
  status,
  className,
}: ReservationChatButtonProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  if (!canStartReservationChat(status)) {
    return null;
  }

  const handleOpenChat = async () => {
    setIsStarting(true);
    try {
      const chatRoom = await createChatRoom({ reservationId });
      router.push(`/chat/${chatRoom.id}`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "채팅방을 열지 못했습니다.";
      alert(message);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <Button
      type="button"
      disabled={isStarting}
      className={className}
      onClick={() => {
        void handleOpenChat();
      }}
    >
      {isStarting ? "채팅방 여는 중..." : "실시간 채팅하기"}
    </Button>
  );
}
