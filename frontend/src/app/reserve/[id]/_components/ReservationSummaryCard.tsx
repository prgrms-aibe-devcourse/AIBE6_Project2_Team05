import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type FreelancerProfile = {
  readonly memberName: string;
  readonly title: string;
  readonly price: number | null;
};

type ReservationSummaryCardProps = {
  readonly profile: FreelancerProfile | null;
  readonly loading: boolean;
  readonly isSubmitting: boolean;
  readonly isSubmitDisabled: boolean;
  readonly error: string | null;
  readonly notice: string | null;
};

export function ReservationSummaryCard({
  profile,
  loading,
  isSubmitting,
  isSubmitDisabled,
  error,
  notice,
}: ReservationSummaryCardProps) {
  const displayName = profile?.memberName ?? "프리랜서";
  const displayTitle = profile?.title ?? "프리랜서 정보를 불러오는 중";
  const displayPrice =
    profile?.price == null ? "협의" : `₩${profile.price.toLocaleString()}~`;

  return (
    <div className="sticky top-24 rounded-2xl border border-[#efeee7] bg-white p-6">
      <h2 className="mb-5 font-[var(--font-display)] text-lg font-semibold text-[#1b1c18]">
        예약 요약
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[#75786c]">프리랜서</span>
          <span className="font-medium text-[#1b1c18]">
            {loading ? "불러오는 중..." : displayName}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#75786c]">서비스</span>
          <span className="font-medium text-[#1b1c18]">
            {loading ? "불러오는 중..." : displayTitle}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#75786c]">응답 시간</span>
          <span className="font-medium text-[#1b1c18]">24시간 이내</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#75786c]">플랫폼 수수료</span>
          <span className="font-medium text-[#4f6231]">포함</span>
        </div>
      </div>

      <Separator className="my-4 bg-[#efeee7]" />

      <div className="flex justify-between">
        <span className="font-semibold text-[#1b1c18]">예상 금액</span>
        <span className="text-lg font-bold text-[#4f6231]">
          {loading ? "..." : displayPrice}
        </span>
      </div>

      <Button
        type="submit"
        disabled={isSubmitDisabled}
        className="mt-5 h-12 w-full rounded-xl bg-[#4f6231] font-medium text-white hover:bg-[#677b47] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "예약 신청 중..." : "예약 신청하기"}
      </Button>

      <div className="mt-4 rounded-xl bg-[#f5f4ec] p-3">
        <p className="mb-1 text-center text-xs text-[#75786c]">
          프리랜서가 수락하기 전까지는 결제가 진행되지 않습니다
        </p>
        <div className="flex items-center justify-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-[#4f6231]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium text-[#4f6231]">
            48시간 이내 무료 취소 가능
          </span>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-[#e7c4bf] bg-[#fbefec] px-4 py-3 text-sm text-[#8a4f46]">
          {error}
        </p>
      ) : null}

      {notice ? (
        <p className="mt-4 rounded-xl border border-[#cbd7bc] bg-[#f3f7ec] px-4 py-3 text-sm text-[#4f6231]">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
