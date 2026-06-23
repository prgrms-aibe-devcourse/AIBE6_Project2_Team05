"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { API_BASE_URL, createAuthHeaders } from "@/lib/auth";

type PostType = "WEDDING_REVIEW" | "TIP" | "BOARD";

const typeOptions: { value: PostType; label: string }[] = [
  { value: "WEDDING_REVIEW", label: "웨딩 후기" },
  { value: "TIP", label: "꿀팁" },
  { value: "BOARD", label: "게시판" },
];

export default function CommunityWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<PostType>("WEDDING_REVIEW");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const MAX_IMAGES = 4;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const remaining = MAX_IMAGES - images.length;
    const toAdd = files.slice(0, remaining);
    setImages((prev) => [...prev, ...toAdd]);
    setImagePreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("type", type);
      images.forEach((img) => formData.append("images", img));

      const res = await fetch(`${API_BASE_URL}/api/v1/posts`, {
        method: "POST",
        headers: createAuthHeaders(),
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "게시글 등록에 실패했습니다.");
      }

      router.push("/community");
    } catch (e) {
      setError(e instanceof Error ? e.message : "게시글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#fbf9f2]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link
          href="/community"
          className="flex items-center gap-1 text-sm text-[#75786c] hover:text-[#45483d] mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          커뮤니티로
        </Link>

        <div className="bg-white rounded-2xl border border-[#efeee7] p-6 sm:p-8">
          <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18] mb-8">
            게시글 작성
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 카테고리 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#45483d]">카테고리</Label>
              <div className="flex flex-wrap gap-2">
                {typeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setType(opt.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      type === opt.value
                        ? "bg-[#4f6231] text-white"
                        : "bg-[#f5f4ec] text-[#45483d] hover:bg-[#efeee7]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 제목 */}
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-sm font-medium text-[#45483d]">
                제목
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해주세요"
                maxLength={200}
                className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18] placeholder:text-[#75786c]"
              />
              <p className="text-xs text-[#75786c] text-right">{title.length} / 200</p>
            </div>

            {/* 내용 */}
            <div className="space-y-1.5">
              <Label htmlFor="content" className="text-sm font-medium text-[#45483d]">
                내용
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력해주세요"
                rows={10}
                className="bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] placeholder:text-[#75786c] resize-none"
              />
            </div>

            {/* 이미지 업로드 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-[#45483d]">
                  이미지 첨부 (선택 · 최대 {MAX_IMAGES}장)
                </Label>
                <span className={`text-xs font-medium ${images.length >= MAX_IMAGES ? "text-[#4f6231]" : "text-[#75786c]"}`}>
                  {images.length} / {MAX_IMAGES}
                </span>
              </div>

              {images.length < MAX_IMAGES ? (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-[#c5c8ba] rounded-xl p-6 text-center hover:border-[#4f6231] hover:bg-[#f5f4ec] transition-colors">
                    <svg className="w-8 h-8 text-[#75786c] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium text-[#45483d] mb-1">
                      클릭해서 이미지 추가
                    </p>
                    <p className="text-xs text-[#75786c]">PNG, JPG, WEBP · 최대 10MB · 첫 번째 사진이 썸네일</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="border-2 border-dashed border-[#4f6231]/30 rounded-xl p-4 text-center bg-[#f5f4ec]">
                  <p className="text-sm font-medium text-[#4f6231]">최대 {MAX_IMAGES}장이 첨부되었습니다</p>
                  <p className="text-xs text-[#75786c] mt-0.5">이미지를 삭제하면 추가할 수 있어요</p>
                </div>
              )}

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-[#efeee7]">
                      <Image src={preview} alt={`미리보기 ${index + 1}`} fill className="object-cover" />
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-[#4f6231] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          썸네일
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/70"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

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
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="flex-1 h-11 bg-[#4f6231] hover:bg-[#677b47] text-white rounded-xl"
              >
                {isSubmitting ? "등록 중..." : "등록하기"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
