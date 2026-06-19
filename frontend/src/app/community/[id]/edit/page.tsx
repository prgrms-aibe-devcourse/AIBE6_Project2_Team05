"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL, createAuthHeaders } from "@/lib/auth";

type PostType = "WEDDING_REVIEW" | "TIP" | "BOARD" | "TALENT";

const typeOptions: { value: PostType; label: string }[] = [
  { value: "WEDDING_REVIEW", label: "웨딩 후기" },
  { value: "TIP", label: "꿀팁" },
  { value: "BOARD", label: "게시판" },
  { value: "TALENT", label: "재능기부" },
];

export default function CommunityEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<PostType>("WEDDING_REVIEW");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/posts/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
        setType(data.type);
      } catch {
        router.push("/community");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...createAuthHeaders() },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "수정에 실패했습니다.");
      }

      router.push(`/community/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#fbf9f2]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link
          href={`/community/${id}`}
          className="flex items-center gap-1 text-sm text-[#75786c] hover:text-[#45483d] mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          게시글로
        </Link>

        <div className="bg-white rounded-2xl border border-[#efeee7] p-6 sm:p-8">
          <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18] mb-8">
            게시글 수정
          </h1>

          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 카테고리 (읽기 전용) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#45483d]">카테고리</Label>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map((opt) => (
                    <span
                      key={opt.value}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        type === opt.value
                          ? "bg-[#4f6231] text-white"
                          : "bg-[#f5f4ec] text-[#c5c8ba]"
                      }`}
                    >
                      {opt.label}
                    </span>
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
                  maxLength={200}
                  className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18]"
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
                  rows={10}
                  className="bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] resize-none"
                />
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
                  {isSubmitting ? "수정 중..." : "수정 완료"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
