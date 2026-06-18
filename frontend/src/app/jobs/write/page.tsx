"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL, createAuthHeaders } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Category = { id: number; name: string };

const CATEGORY_ICONS: Record<string, string> = {
  헤어메이크업: "💄",
  "스냅 사진": "📸",
  "MC/사회자": "🎤",
  "드레스/수트": "👗",
  보컬리스트: "🎵",
  "하객 알바": "🤝",
};

export default function JobsWritePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [budget, setBudget] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [region, setRegion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");
    if (raw === "" || /^\d+$/.test(raw)) setBudget(raw);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const body = {
        title,
        content,
        categoryId: Number(categoryId),
        budget: budget ? Number(budget) : null,
        weddingDate,
        region: region || null,
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...createAuthHeaders() },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "구인글 등록에 실패했습니다.");
      }

      router.push("/mypage/posts");
    } catch (e) {
      setError(e instanceof Error ? e.message : "구인글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link
          href="/mypage/posts"
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
          구인글 목록으로
        </Link>

        <div className="bg-white rounded-2xl border border-[#efeee7] p-6 sm:p-8">
          <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18] mb-2">
            구인글 작성
          </h1>
          <p className="text-sm text-[#75786c] mb-8">
            원하는 조건을 등록하면 프리랜서가 직접 제안서를 보내드려요.
          </p>

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* 카테고리 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#45483d]">
                카테고리 <span className="text-red-400">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryId(c.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-sm transition-all ${
                      categoryId === c.id
                        ? "border-[#4f6231] bg-[#f0f4eb] text-[#4f6231] font-medium"
                        : "border-[#efeee7] bg-[#f5f4ec] text-[#45483d] hover:border-[#c5c8ba]"
                    }`}
                  >
                    <span className="text-xl">
                      {CATEGORY_ICONS[c.name] ?? "📋"}
                    </span>
                    <span className="text-xs text-center leading-tight">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#efeee7]" />

            {/* 제목 */}
            <div className="space-y-1.5">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-[#45483d]"
              >
                제목 <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 야외 웨딩 스냅 작가 구합니다"
                maxLength={200}
                required
                className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18] placeholder:text-[#75786c]"
              />
            </div>

            {/* 내용 */}
            <div className="space-y-1.5">
              <Label
                htmlFor="content"
                className="text-sm font-medium text-[#45483d]"
              >
                상세 내용 <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`원하는 스타일, 촬영 장소, 시간 등 구체적으로 적어주세요.\n\n예시)\n- 촬영 장소: 서울 야외\n- 촬영 시간: 2시간\n- 원하는 스타일: 자연스러운 스냅`}
                rows={8}
                required
                className="bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] placeholder:text-[#75786c] resize-none"
              />
              <p className="text-xs text-[#75786c] text-right">
                {content.length}자
              </p>
            </div>

            <div className="border-t border-[#efeee7]" />

            {/* 예산 + 웨딩 예정일 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="budget"
                  className="text-sm font-medium text-[#45483d]"
                >
                  예산{" "}
                  <span className="text-xs text-[#75786c] font-normal">
                    (선택)
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="budget"
                    type="text"
                    inputMode="numeric"
                    value={budget ? Number(budget).toLocaleString() : ""}
                    onChange={handleBudgetChange}
                    placeholder="협의 가능"
                    className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18] placeholder:text-[#75786c] pr-8"
                  />
                  {budget && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#75786c]">
                      원
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="weddingDate"
                  className="text-sm font-medium text-[#45483d]"
                >
                  웨딩 예정일 <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="weddingDate"
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  required
                  className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18]"
                />
              </div>
            </div>

            {/* 지역 */}
            <div className="space-y-1.5">
              <Label
                htmlFor="region"
                className="text-sm font-medium text-[#45483d]"
              >
                지역{" "}
                <span className="text-xs text-[#75786c] font-normal">
                  (선택)
                </span>
              </Label>
              <Input
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="예: 서울, 부산"
                className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18] placeholder:text-[#75786c]"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 h-11 border-[#c5c8ba] text-[#45483d] rounded-xl"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !title.trim() ||
                  !content.trim() ||
                  !categoryId ||
                  !weddingDate
                }
                className="flex-1 h-11 bg-[#4f6231] hover:bg-[#677b47] text-white rounded-xl"
              >
                {isSubmitting ? "등록 중..." : "등록하기"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
