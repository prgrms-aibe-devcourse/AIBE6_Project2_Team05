"use client";

import { Button } from "@/components/ui/button";
import {
  fetchMyWrittenReviews,
  fetchReceivedReviews,
  ReviewApiError,
  type ReviewResponse,
} from "@/lib/reviews";
import { getRoleTheme } from "@/lib/roleTheme";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MessageSquareText,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const PAGE_SIZE = 5;

function getErrorMessage(error: unknown): string {
  if (error instanceof ReviewApiError || error instanceof Error)
    return error.message;
  return "리뷰 내역을 불러오지 못했습니다.";
}

function formatReviewDate(value: string): string {
  if (!value) return "";
  return value.slice(0, 10).replaceAll("-", ".");
}

function ReviewStars({ rating }: { readonly rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5 text-[#d39b2d]"
      aria-label={`${rating}점`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < rating ? "fill-current" : "text-[#d8d6ca]"}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  cardHref,
  detailHref,
}: {
  readonly review: ReviewResponse;
  readonly cardHref: string | null;
  readonly detailHref: string | null;
}) {
  const { avatarBgClass, avatarTextClass } = getRoleTheme("CLIENT");
  const content = (
    <article className="rounded-2xl border border-[#efeee7] bg-white p-5 transition-shadow hover:shadow-[0_8px_30px_rgba(79,98,49,0.08)] hover:border-[#c5c8ba]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`relative w-11 h-11 shrink-0 rounded-full overflow-hidden ${avatarBgClass}`}
          >
            {review.memberImageUrl ? (
              <Image
                src={review.memberImageUrl}
                alt={review.memberName}
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-sm font-semibold ${avatarTextClass}`}
              >
                {review.memberName.slice(0, 2)}
              </div>
            )}
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
      {detailHref && (
        <div className="mt-4 pt-3 border-t border-[#f5f4ec] text-right">
          <Link
            href={detailHref}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#4f6231] hover:underline"
          >
            예약 상세 보기
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </article>
  );

  if (!cardHref) {
    return content;
  }

  return (
    <Link href={cardHref} className="block">
      {content}
    </Link>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8d6ca] bg-white px-6 py-14 text-center">
      <MessageSquareText className="mx-auto h-9 w-9 text-[#98a17f]" />
      <h2 className="mt-4 text-base font-semibold text-[#1b1c18]">{message}</h2>
    </div>
  );
}

function ReviewList({
  reviews,
  mode,
}: {
  reviews: readonly ReviewResponse[];
  mode: "written" | "received";
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);
  const pagedReviews = reviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const cardHrefFor = (review: ReviewResponse): string | null => {
    if (mode !== "written" || review.reservationId === null) return null;
    return `/review/${review.reservationId}`;
  };

  const detailHrefFor = (review: ReviewResponse): string | null => {
    if (mode !== "received" || review.reservationId === null) return null;
    return `/reservations/${review.reservationId}`;
  };

  return (
    <>
      <div className="space-y-4">
        {pagedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            cardHref={cardHrefFor(review)}
            detailHref={detailHrefFor(review)}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-[#efeee7] text-[#75786c] hover:border-[#4f6231] hover:text-[#4f6231] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                currentPage === i + 1
                  ? "bg-[#4f6231] text-white"
                  : "border border-[#efeee7] text-[#45483d] hover:border-[#4f6231] hover:text-[#4f6231]"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-[#efeee7] text-[#75786c] hover:border-[#4f6231] hover:text-[#4f6231] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}

interface ReviewTabProps {
  freelancerProfileId: number | null;
  role: "CLIENT" | "FREELANCER" | null;
}

export default function ReviewTab({
  freelancerProfileId,
  role,
}: ReviewTabProps) {
  const isFreelancer = role === "FREELANCER";
  const [innerTab, setInnerTab] = useState<"written" | "received">("written");
  const [writtenReviews, setWrittenReviews] = useState<
    readonly ReviewResponse[]
  >([]);
  const [receivedReviews, setReceivedReviews] = useState<
    readonly ReviewResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const written = await fetchMyWrittenReviews();
      setWrittenReviews(written);

      if (isFreelancer && freelancerProfileId) {
        const received = await fetchReceivedReviews(freelancerProfileId);
        setReceivedReviews(received);
      }
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [freelancerProfileId, isFreelancer]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const currentReviews =
    isFreelancer && innerTab === "received" ? receivedReviews : writtenReviews;
  const countLabel =
    isFreelancer && innerTab === "received"
      ? `받은 리뷰 ${receivedReviews.length}개`
      : `작성한 리뷰 ${writtenReviews.length}개`;
  const emptyMessage =
    isFreelancer && innerTab === "received"
      ? "아직 받은 리뷰가 없습니다"
      : "아직 작성한 리뷰가 없습니다";

  return (
    <>
      <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18]">
        리뷰 내역
      </h1>

      {isFreelancer && (
        <div className="flex gap-1 p-1 bg-[#f5f4ec] rounded-xl w-fit">
          <button
            onClick={() => setInnerTab("written")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              innerTab === "written"
                ? "bg-white text-[#4f6231] shadow-sm"
                : "text-[#75786c] hover:text-[#45483d]"
            }`}
          >
            내가 쓴 리뷰
          </button>
          <button
            onClick={() => setInnerTab("received")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              innerTab === "received"
                ? "bg-white text-[#4f6231] shadow-sm"
                : "text-[#75786c] hover:text-[#45483d]"
            }`}
          >
            받은 리뷰
          </button>
        </div>
      )}

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
      ) : currentReviews.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <>
          <div className="rounded-2xl border border-[#efeee7] bg-white p-5">
            <p className="text-sm text-[#75786c]">
              총{" "}
              <span className="font-semibold text-[#1b1c18]">{countLabel}</span>
            </p>
          </div>
          <ReviewList
            reviews={currentReviews}
            mode={
              isFreelancer && innerTab === "received" ? "received" : "written"
            }
          />
        </>
      )}
    </>
  );
}
