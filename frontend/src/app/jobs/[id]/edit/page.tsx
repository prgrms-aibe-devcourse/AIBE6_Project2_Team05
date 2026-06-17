"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { API_BASE_URL, createAuthHeaders } from "@/lib/auth";

type Category = { id: number; name: string };

export default function JobEditPage() {
  const { id } = useParams<{ id: string }>();
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

    fetch(`${API_BASE_URL}/api/v1/jobs/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setTitle(data.title ?? "");
        setContent(data.content ?? "");
        setCategoryId(data.categoryId ?? "");
        setBudget(data.budget != null ? String(data.budget) : "");
        setWeddingDate(data.weddingDate ?? "");
        setRegion(data.region ?? "");
      })
      .catch(() => router.push("/jobs"));
  }, [id, router]);

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

      const res = await fetch(`${API_BASE_URL}/api/v1/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...createAuthHeaders() },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "수정에 실패했습니다.");
      }

      router.push(`/jobs/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link href={`/jobs/${id}`} className="flex items-center gap-1 text-sm text-[#75786c] hover:text-[#45483d] mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          구인글로 돌아가기
        </Link>

        <div className="bg-white rounded-2xl border border-[#efeee7] p-6 sm:p-8">
          <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18] mb-8">구인글 수정</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#45483d]">카테고리</Label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full h-11 text-sm border border-[#efeee7] rounded-md px-3 bg-[#f5f4ec] text-[#1b1c18] focus:outline-none focus:ring-2 focus:ring-[#4f6231]"
              >
                <option value="">카테고리 선택</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-sm font-medium text-[#45483d]">제목</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
                className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content" className="text-sm font-medium text-[#45483d]">내용</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={14}
                required
                className="bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="budget" className="text-sm font-medium text-[#45483d]">예산 (원, 선택)</Label>
                <Input
                  id="budget"
                  type="number"
                  min={0}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="협의 가능하면 비워두세요"
                  className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18] placeholder:text-[#75786c]"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weddingDate" className="text-sm font-medium text-[#45483d]">웨딩 예정일</Label>
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

            <div className="space-y-1.5">
              <Label htmlFor="region" className="text-sm font-medium text-[#45483d]">지역 (선택)</Label>
              <Input
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="예: 서울, 부산"
                className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18] placeholder:text-[#75786c]"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 h-11 border-[#c5c8ba] text-[#45483d] rounded-xl">취소</Button>
              <Button type="submit" disabled={isSubmitting || !title.trim() || !content.trim() || !categoryId || !weddingDate} className="flex-1 h-11 bg-[#4f6231] hover:bg-[#677b47] text-white rounded-xl">
                {isSubmitting ? "수정 중..." : "수정하기"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
