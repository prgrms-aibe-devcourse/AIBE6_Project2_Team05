import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  acceptReservation,
  completeReservation,
  rejectReservation,
  ReservationApiError,
  type ReservationResponse,
} from "@/lib/reservations";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  formatReservationDate,
  reservationStatusView,
} from "../reservationView";
import { getReservationReviewHref } from "../reservation-review-link.js";
import { getReservationCardView } from "../reservation-card-view.js";
import { ReservationChatButton } from "./ReservationChatButton";

type ReservationCardProps = {
  readonly reservation: ReservationResponse;
  readonly profileImageUrl: string | null;
  readonly userRole: string | null;
  readonly hasUnreadChat: boolean;
  readonly onRefresh: () => void;
  readonly onChatOpened: (reservationId: number) => void;
};

export function ReservationCard({
  reservation,
  profileImageUrl,
  userRole,
  hasUnreadChat,
  onRefresh,
  onChatOpened,
}: ReservationCardProps) {
  const status = reservationStatusView[reservation.status];
  const [isUpdating, setIsUpdating] = useState(false);
  const isFreelancer = userRole === "FREELANCER";
  const cardView = getReservationCardView({
    reservation,
    userRole,
    profileImageUrl,
  });

  const handleStatusChange = async (
    action: (id: number) => Promise<ReservationResponse>,
    label: string,
  ) => {
    if (!confirm(`예약을 ${label}하시겠습니까?`)) return;
    setIsUpdating(true);
    try {
      await action(reservation.id);
      onRefresh();
    } catch (error: unknown) {
      const message =
        error instanceof ReservationApiError || error instanceof Error
          ? error.message
          : "처리에 실패했습니다.";
      alert(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#efeee7] overflow-hidden hover:shadow-[0px_4px_20px_rgba(108,129,76,0.08)] transition-all">
      <div className="flex gap-4 p-5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f5f4ec]">
          {cardView.imageUrl ? (
            <Image
              src={cardView.imageUrl}
              alt={cardView.imageAlt}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#4f6231]">
              {cardView.imageFallback}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-[#1b1c18] text-sm">
              {cardView.displayName}
            </h3>
            <div className="flex shrink-0 items-center gap-1.5">
              {hasUnreadChat && (
                <Badge className="border-0 bg-[#ff5a5f] text-xs text-white">
                  새 채팅
                </Badge>
              )}
              <Badge className={`${status.color} border-0 text-xs`}>
                {status.label}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-[#75786c] mb-2">
            {cardView.displaySubtitle}
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
          <ReservationChatButton
            reservationId={reservation.id}
            status={reservation.status}
            hasUnreadChat={hasUnreadChat}
            onChatOpened={onChatOpened}
            className="h-8 rounded-xl bg-[#4f6231] px-3 text-xs text-white hover:bg-[#677b47]"
          />
          {reservation.status === "COMPLETED" && (
            <Link
              href={getReservationReviewHref({
                isFreelancer,
                reservationId: reservation.id,
              })}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "text-xs h-8 border-[#c5c8ba] text-[#45483d] rounded-xl hover:border-[#4f6231] hover:text-[#4f6231]",
              )}
            >
              {isFreelancer
                ? "리뷰 확인하기"
                : reservation.reviewId === null
                  ? "리뷰 작성"
                  : "리뷰 수정"}
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
