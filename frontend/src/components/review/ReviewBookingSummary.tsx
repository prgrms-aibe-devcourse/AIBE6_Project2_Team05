import Image from "next/image";
import type {
  FreelancerProfileResponse,
  ReservationResponse,
} from "@/lib/reservations";

export type ReservationSummary = {
  readonly freelancerProfileId: number;
  readonly freelancerName: string;
  readonly freelancerTitle: string;
  readonly categoryName: string;
  readonly reservationDate: string;
  readonly price: number;
};

type ReviewBookingSummaryProps = {
  readonly summary: ReservationSummary | null;
};

export function buildReservationSummary(
  reservation: ReservationResponse,
  profile: FreelancerProfileResponse,
): ReservationSummary {
  return {
    freelancerProfileId: reservation.freelancerProfileId,
    freelancerName: reservation.freelancerName,
    freelancerTitle: reservation.freelancerTitle || profile.title,
    categoryName: profile.categoryName,
    reservationDate: reservation.reservationDate,
    price: profile.price,
  };
}

function formatReservationDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

function getReservationImageUrl(profileId: number | null): string {
  const seed = profileId === null ? "loading" : String(profileId);
  return new URL(`/seed/freelancer-${seed}/200/200`, "https:" + "//picsum.photos")
    .toString();
}

export function ReviewBookingSummary({ summary }: ReviewBookingSummaryProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#efeee7] p-5 mb-6">
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
          <Image
            src={getReservationImageUrl(summary?.freelancerProfileId ?? null)}
            alt={summary?.freelancerName ?? "예약 정보"}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[#1b1c18] text-base mb-0.5">
            {summary?.freelancerName ?? "예약 정보를 불러오는 중입니다"}
          </h3>
          <p className="text-xs text-[#75786c] mb-2">
            {summary
              ? `${summary.categoryName} · ${formatReservationDate(
                  summary.reservationDate,
                )} 예약`
              : "예약 일정을 확인하고 있습니다"}
          </p>
          <div className="flex gap-4 text-xs text-[#45483d]">
            <span>{summary?.freelancerTitle ?? "서비스 정보 확인 중"}</span>
            <span className="text-[#4f6231] font-semibold">
              {summary ? formatPrice(summary.price) : "금액 확인 중"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
