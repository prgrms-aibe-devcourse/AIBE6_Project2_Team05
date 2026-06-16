"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
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
      if (image) formData.append("image", image);

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
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />

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
              <Label className="text-sm font-medium text-[#45483d]">이미지 첨부 (선택)</Label>
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-[#c5c8ba] rounded-xl p-6 text-center hover:border-[#4f6231] hover:bg-[#f5f4ec] transition-colors">
                  <svg className="w-8 h-8 text-[#75786c] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium text-[#45483d] mb-1">
                    {image ? image.name : "클릭해서 이미지 업로드"}
                  </p>
                  <p className="text-xs text-[#75786c]">PNG, JPG, WEBP · 최대 10MB</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              {imagePreview && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#efeee7]">
                  <Image src={imagePreview} alt="미리보기" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImage(null); setImagePreview(null); }}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/70"
                  >
                    ✕
                  </button>
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

      <Footer />
    </div>
  );
}
