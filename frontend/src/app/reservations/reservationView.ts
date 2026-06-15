import type { ReservationStatus } from "@/lib/reservations";

export const reservationStatusView = {
  REQUESTED: {
    label: "대기 중",
    color: "bg-[#f6d9d3] text-[#6f5a55]",
    tab: "pending",
  },
  ACCEPTED: {
    label: "확정됨",
    color: "bg-[#d3ebac] text-[#4f6231]",
    tab: "confirmed",
  },
  REJECTED: {
    label: "거절됨",
    color: "bg-[#efeee7] text-[#75786c]",
    tab: "cancelled",
  },
  COMPLETED: {
    label: "완료됨",
    color: "bg-[#efeee7] text-[#45483d]",
    tab: "completed",
  },
  CANCELED: {
    label: "취소됨",
    color: "bg-[#efeee7] text-[#75786c]",
    tab: "cancelled",
  },
} as const satisfies Record<
  ReservationStatus,
  { readonly label: string; readonly color: string; readonly tab: string }
>;

export function formatReservationDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}
