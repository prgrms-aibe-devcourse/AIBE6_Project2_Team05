"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      setPhotos((prev) => [...prev, url]);
    });
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
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
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
              <p className="text-xs text-[#75786c] mb-2">
                이벤트 베뉴 · 2024. 06. 14 방문
              </p>
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
            소중한 후기를 남겨주세요
          </h2>

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
                  {
                    [
                      "",
                      "별로예요",
                      "아쉬워요",
                      "보통이에요",
                      "좋아요",
                      "최고예요",
                    ][rating]
                  }
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
            <p className="text-xs text-[#75786c] text-right">
              {reviewText.length} / 1000
            </p>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#45483d]">
              웨딩 사진 첨부
            </Label>
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-[#c5c8ba] rounded-xl p-6 text-center hover:border-[#4f6231] hover:bg-[#f5f4ec] transition-colors">
                <svg
                  className="w-8 h-8 text-[#75786c] mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm font-medium text-[#45483d] mb-1">
                  사진을 드래그하거나 클릭해서 업로드
                </p>
                <p className="text-xs text-[#75786c]">
                  PNG, JPG, WEBP · 파일당 최대 10MB
                </p>
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
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              className="w-full h-12 bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl font-medium"
              disabled={rating === 0 || reviewText.length < 10}
            >
              리뷰 등록하기
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
