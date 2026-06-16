"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, MessageSquareText, RefreshCcw, ShieldAlert, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchCurrentMember,
  fetchMyFreelancerProfileId,
  fetchReceivedReviews,
  ReviewApiError,
  type CurrentMember,
  type ReviewResponse,
} from "@/lib/reviews";

function getErrorMessage(error: unknown): string {
  if (error instanceof ReviewApiError || error instanceof Error) {
    return error.message;
  }
  return "리뷰 내역을 불러오지 못했습니다.";
}

function formatReviewDate(value: string): string {
  if (!value) {
    return "";
  }
  return value.slice(0, 10).replaceAll("-", ".");
}

function ReviewStars({ rating }: { readonly rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-[#d39b2d]" aria-label={`${rating}점`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < rating ? "fill-current" : "text-[#d8d6ca]"}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { readonly review: ReviewResponse }) {
  return (
    <article className="rounded-2xl border border-[#efeee7] bg-white p-5 transition-shadow hover:shadow-[0_8px_30px_rgba(79,98,49,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d3ebac] text-sm font-semibold text-[#4f6231]">
            {review.memberName.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-[#1b1c18]">
              {review.memberName}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <ReviewStars rating={review.rating} />
              <span className="text-xs text-[#75786c]">{review.rating}.0</span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-xs text-[#75786c]">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatReviewDate(review.createdAt)}
        </div>
      </div>
      <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#45483d]">
        {review.content}
      </p>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8d6ca] bg-white px-6 py-14 text-center">
      <MessageSquareText className="mx-auto h-9 w-9 text-[#98a17f]" />
      <h2 className="mt-4 text-base font-semibold text-[#1b1c18]">
        아직 받은 리뷰가 없습니다
      </h2>
      <p className="mt-2 text-sm text-[#75786c]">
        완료된 예약 후 고객이 작성한 리뷰가 이곳에 표시됩니다.
      </p>
    </div>
  );
}

function ClientOnlyState() {
  return (
    <div className="rounded-2xl border border-[#efeee7] bg-white px-6 py-14 text-center">
      <ShieldAlert className="mx-auto h-9 w-9 text-[#9a6b4f]" />
      <h2 className="mt-4 text-base font-semibold text-[#1b1c18]">
        프리랜서 회원만 리뷰 내역을 확인할 수 있습니다
      </h2>
      <p className="mt-2 text-sm text-[#75786c]">
        일반 회원은 예약 내역에서 작성한 리뷰를 확인해주세요.
      </p>
      <Link
        href="/reservations"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-[#4f6231] px-4 text-sm font-medium text-white transition-colors hover:bg-[#677b47]"
      >
        예약 내역으로 이동
      </Link>
    </div>
  );
}

export function FreelancerReviewHistory() {
  const router = useRouter();
  const [member, setMember] = useState<CurrentMember | null>(null);
  const [reviews, setReviews] = useState<readonly ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const currentMember = await fetchCurrentMember();
      setMember(currentMember);

      if (currentMember.role !== "FREELANCER") {
        setReviews([]);
        return;
      }

      const profileId = await fetchMyFreelancerProfileId(currentMember.id);
      if (profileId === null) {
        setReviews([]);
        return;
      }

      setReviews(await fetchReceivedReviews(profileId));
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadReviews();
  }, [loadReviews]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-[#4f6231]">My Reviews</p>
          <h1 className="font-[var(--font-display)] text-3xl font-semibold text-[#1b1c18]">
            리뷰 내역
          </h1>
          <p className="mt-2 text-sm text-[#75786c]">
            프리랜서 프로필에 남겨진 고객 리뷰를 확인하세요.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => void loadReviews()}
          className="h-10 rounded-xl border-[#c5c8ba] text-[#45483d] hover:border-[#4f6231] hover:text-[#4f6231]"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          새로고침
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-[#efeee7] bg-white px-6 py-14 text-center text-sm text-[#75786c]">
          리뷰 내역을 불러오는 중입니다...
        </div>
      ) : errorMessage ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-8">
          <p className="text-sm text-red-600">{errorMessage}</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => void loadReviews()}
            className="mt-4 rounded-xl border-red-200 text-red-600 hover:bg-red-100"
          >
            다시 시도
          </Button>
        </div>
      ) : member?.role !== "FREELANCER" ? (
        <ClientOnlyState />
      ) : reviews.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#efeee7] bg-white p-5">
            <p className="text-sm text-[#75786c]">
              총 <span className="font-semibold text-[#1b1c18]">{reviews.length}</span>개의
              리뷰를 받았습니다.
            </p>
          </div>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="ghost"
        onClick={() => router.push("/mypage")}
        className="mt-8 rounded-xl text-[#75786c] hover:text-[#45483d]"
      >
        마이페이지로 돌아가기
      </Button>
    </main>
  );
}
