"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { authFetch } from "@/lib/authFetch";

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
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [reviewId, setReviewId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      setPhotos((prev) => [...prev, url]);
    });
  };

  const loadReview = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
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
    void loadReview();
  }, [loadReview]);

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
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />

      {/* Hero */}
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
        {/* Back */}
        <Link
          href="/reservations"
          className="flex items-center gap-1 text-sm text-[#75786c] hover:text-[#45483d] mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          예약 내역으로
        </Link>

        {/* Booking Summary */}
        <div className="bg-white rounded-2xl border border-[#efeee7] p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
              <Image
                src="https://picsum.photos/seed/aurelia/200/200"
                alt="Aurelia Estate Garden"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1b1c18] text-base mb-0.5">
                Aurelia Estate Garden
              </h3>
              <p className="text-xs text-[#75786c] mb-2">이벤트 베뉴 · 2024. 06. 14 방문</p>
              <div className="flex gap-4 text-xs text-[#45483d]">
                <span>프리미엄 패키지</span>
                <span className="text-[#4f6231] font-semibold">₩5,840,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <div className="bg-white rounded-2xl border border-[#efeee7] p-6 space-y-6">
          <h2 className="font-[var(--font-display)] text-xl font-semibold text-[#1b1c18]">
            {reviewId === null ? "소중한 후기를 남겨주세요" : "작성한 후기를 수정해주세요"}
          </h2>

          {errorMessage && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          {/* Star Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#45483d]">
              전체 만족도
            </Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <svg
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
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
                  {["", "별로예요", "아쉬워요", "보통이에요", "좋아요", "최고예요"][rating]}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[#45483d]">
              솔직한 후기를 남겨주세요
            </Label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="전문가와의 경험, 서비스 품질, 의사소통 등 다른 분들에게 도움이 될 내용을 자유롭게 작성해주세요"
              className="bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] placeholder:text-[#75786c] resize-none min-h-[120px]"
              rows={5}
            />
            <p className="text-xs text-[#75786c] text-right">{reviewText.length} / 1000</p>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#45483d]">
              웨딩 사진 첨부
            </Label>
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-[#c5c8ba] rounded-xl p-6 text-center hover:border-[#4f6231] hover:bg-[#f5f4ec] transition-colors">
                <svg className="w-8 h-8 text-[#75786c] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium text-[#45483d] mb-1">
                  사진을 드래그하거나 클릭해서 업로드
                </p>
                <p className="text-xs text-[#75786c]">PNG, JPG, WEBP · 파일당 최대 10MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {photos.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
                    <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              className="w-full h-12 bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl font-medium"
              disabled={isLoading || isSubmitting || rating === 0 || reviewText.trim().length < 10}
              onClick={() => void handleSubmitReview()}
            >
              {isSubmitting
                ? "저장 중..."
                : reviewId === null
                  ? "리뷰 등록하기"
                  : "리뷰 수정하기"}
            </Button>
            <p className="text-xs text-[#75786c] text-center mt-3">
              작성하신 리뷰는 해당 전문가의 프로필에 게재됩니다
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
