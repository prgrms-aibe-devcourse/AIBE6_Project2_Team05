"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ReviewFormProps = {
  readonly rating: number;
  readonly reviewText: string;
  readonly hasReview: boolean;
  readonly isLoading: boolean;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly onRatingChange: (rating: number) => void;
  readonly onReviewTextChange: (reviewText: string) => void;
  readonly onSubmit: () => void;
};

const ratingLabels = [
  "",
  "별로예요",
  "아쉬워요",
  "보통이에요",
  "좋아요",
  "최고예요",
] as const;

export function ReviewForm({
  rating,
  reviewText,
  hasReview,
  isLoading,
  isSubmitting,
  errorMessage,
  onRatingChange,
  onReviewTextChange,
  onSubmit,
}: ReviewFormProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const selectedRating = hoverRating || rating;

  return (
    <div className="bg-white rounded-2xl border border-[#efeee7] p-6 space-y-6">
      <h2 className="font-[var(--font-display)] text-xl font-semibold text-[#1b1c18]">
        {hasReview ? "작성한 후기를 수정해주세요" : "소중한 후기를 남겨주세요"}
      </h2>

      {errorMessage && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-medium text-[#45483d]">
          전체 만족도
        </Label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => onRatingChange(star)}
              className="transition-transform hover:scale-110"
            >
              <svg
                className={`w-8 h-8 transition-colors ${
                  star <= selectedRating
                    ? "text-[#f59e0b] fill-current"
                    : "text-[#c5c8ba] fill-current"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          {rating > 0 && (
            <span className="text-sm text-[#45483d] ml-1">
              {ratingLabels[rating]}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-[#45483d]">
          솔직한 후기를 남겨주세요
        </Label>
        <Textarea
          value={reviewText}
          onChange={(event) => onReviewTextChange(event.target.value)}
          placeholder="전문가와의 경험, 서비스 품질, 의사소통 등 다른 분들에게 도움이 될 내용을 자유롭게 작성해주세요"
          className="bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] placeholder:text-[#75786c] resize-none min-h-[120px]"
          rows={5}
        />
        <p className="text-xs text-[#75786c] text-right">
          {reviewText.length} / 1000
        </p>
      </div>

      <div className="pt-2">
        <Button
          className="w-full h-12 bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl font-medium"
          disabled={
            isLoading ||
            isSubmitting ||
            rating === 0 ||
            reviewText.trim().length < 10
          }
          onClick={onSubmit}
        >
          {isSubmitting ? "저장 중..." : hasReview ? "리뷰 수정하기" : "리뷰 등록하기"}
        </Button>
        <p className="text-xs text-[#75786c] text-center mt-3">
          작성하신 리뷰는 해당 전문가의 프로필에 게재됩니다
        </p>
      </div>
    </div>
  );
}
