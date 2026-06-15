import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  acceptReservation,
  completeReservation,
  rejectReservation,
  type ReservationResponse,
} from "@/lib/reservations";
import { formatReservationDate, reservationStatusView } from "../reservationView";
import { useState } from "react";

type ReservationCardProps = {
  readonly reservation: ReservationResponse;
  readonly userRole: string | null;
  readonly onRefresh: () => void;
};

export function ReservationCard({
  reservation,
  userRole,
  onRefresh,
}: ReservationCardProps) {
  const status = reservationStatusView[reservation.status];
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (
    action: (id: number) => Promise<any>,
    label: string,
  ) => {
    if (!confirm(`예약을 ${label}하시겠습니까?`)) return;
    setIsUpdating(true);
    try {
      await action(reservation.id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || "처리에 실패했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const isFreelancer = userRole === "FREELANCER";

  return (
    <div className="bg-white rounded-2xl border border-[#efeee7] overflow-hidden hover:shadow-[0px_4px_20px_rgba(108,129,76,0.08)] transition-all">
      <div className="flex gap-4 p-5">
        <div className="w-16 h-16 rounded-xl bg-[#f5f4ec] shrink-0 flex items-center justify-center text-sm font-semibold text-[#4f6231]">
          {reservation.freelancerName?.[0] ?? "W"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-[#1b1c18] text-sm">
              {reservation.freelancerName ?? "프리랜서"}
            </h3>
            <Badge className={`${status.color} border-0 text-xs shrink-0`}>
              {status.label}
            </Badge>
          </div>
          <p className="text-xs text-[#75786c] mb-2">
            {reservation.freelancerTitle ?? "웨딩 전문가"}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-[#45483d]">
            <span className="flex items-center gap-1">
              <svg
                className="w-3 h-3 text-[#75786c]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatReservationDate(reservation.reservationDate)}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-[#efeee7] px-5 py-3 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          {isFreelancer && reservation.status === "REQUESTED" && (
            <>
              <Button
                variant="outline"
                size="sm"
                disabled={isUpdating}
                className="text-xs h-8 border-[#d3ebac] text-[#4f6231] hover:bg-[#d3ebac]/20 rounded-xl"
                onClick={() => handleStatusChange(acceptReservation, "수락")}
              >
                수락하기
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isUpdating}
                className="text-xs h-8 border-[#f6d9d3] text-[#6f5a55] hover:bg-[#f6d9d3]/20 rounded-xl"
                onClick={() => handleStatusChange(rejectReservation, "거절")}
              >
                거절하기
              </Button>
            </>
          )}
          {isFreelancer && reservation.status === "ACCEPTED" && (
            <Button
              variant="outline"
              size="sm"
              disabled={isUpdating}
              className="text-xs h-8 border-[#4f6231] text-[#4f6231] hover:bg-[#4f6231]/10 rounded-xl"
              onClick={() => handleStatusChange(completeReservation, "완료")}
            >
              완료 처리
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {reservation.status === "COMPLETED" && (
            <Link
              href={`/review/${reservation.id}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "text-xs h-8 border-[#c5c8ba] text-[#45483d] rounded-xl hover:border-[#4f6231] hover:text-[#4f6231]",
              )}
            >
              리뷰 작성
            </Link>
          )}
          <Link
            href={`/reservations/${reservation.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "text-xs h-8 border-[#c5c8ba] text-[#45483d] rounded-xl hover:border-[#4f6231] hover:text-[#4f6231]",
            )}
          >
            상세 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
