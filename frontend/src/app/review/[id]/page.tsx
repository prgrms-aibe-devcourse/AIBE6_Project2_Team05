"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { authFetch } from "@/lib/authFetch";
import {
  buildReservationSummary,
  ReviewBookingSummary,
  type ReservationSummary,
} from "@/components/review/ReviewBookingSummary";
import { ReviewForm } from "@/components/review/ReviewForm";
import {
  fetchFreelancerProfile,
  fetchReservationById,
} from "@/lib/reservations";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "리뷰 등록에 실패했습니다.";
}

type ReviewPayload = {
  readonly id: number;
  readonly rating: number;
  readonly content: string;
};

function parseReviewPayload(value: unknown): ReviewPayload | null {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    !("rating" in value) ||
    !("content" in value) ||
    typeof value.id !== "number" ||
    typeof value.rating !== "number" ||
    typeof value.content !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    rating: value.rating,
    content: value.content,
  };
}

async function readErrorMessage(response: Response): Promise<string> {
  const payload: unknown = await response.json().catch(() => null);

  if (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return "리뷰 등록에 실패했습니다.";
}

export default function ReviewPage() {
  const params = useParams<{ readonly id: string }>();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewId, setReviewId] = useState<number | null>(null);
  const [reservationSummary, setReservationSummary] =
    useState<ReservationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadReviewPage = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const reservationId = Number(params.id);
      if (!Number.isInteger(reservationId) || reservationId <= 0) {
        throw new Error("예약 정보를 불러오지 못했습니다.");
      }

      const reservation = await fetchReservationById(reservationId);
      const profile = await fetchFreelancerProfile(
        reservation.freelancerProfileId,
      );
      setReservationSummary(buildReservationSummary(reservation, profile));

      const response = await authFetch(`/api/v1/reservations/${params.id}/reviews`, {
        method: "GET",
      });

      if (response.status === 404 || response.status === 400) {
        return;
      }

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      const review = parseReviewPayload(await response.json());
      if (review === null) {
        throw new Error("리뷰 정보를 불러오지 못했습니다.");
      }

      setReviewId(review.id);
      setRating(review.rating);
      setReviewText(review.content);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadReviewPage();
  }, [loadReviewPage]);

  const handleSubmitReview = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await authFetch(`/api/v1/reservations/${params.id}/reviews`, {
        method: reviewId === null ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          content: reviewText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      router.push("/reservations");
      router.refresh();
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#fbf9f2]">
      <div className="relative h-40 overflow-hidden">
        <Image
          src="https://picsum.photos/seed/reviewhero/1400/300"
          alt="Review hero"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <p className="text-xs font-medium tracking-widest uppercase text-white/80 mb-2">
            Review
          </p>
          <h1 className="font-[var(--font-display)] text-2xl sm:text-3xl font-semibold text-white">
            MOMENTS TO REMEMBER
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link
          href="/reservations"
          className="flex items-center gap-1 text-sm text-[#75786c] hover:text-[#45483d] mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          예약 내역으로
        </Link>

        <ReviewBookingSummary summary={reservationSummary} />

        <ReviewForm
          rating={rating}
          reviewText={reviewText}
          hasReview={reviewId !== null}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onRatingChange={setRating}
          onReviewTextChange={setReviewText}
          onSubmit={() => void handleSubmitReview()}
        />
      </div>
    </div>
  );
}
