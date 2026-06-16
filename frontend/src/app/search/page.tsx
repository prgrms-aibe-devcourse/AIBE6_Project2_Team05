"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL } from "@/lib/auth";

const filterChips = [
  "전체", "헤어·메이크업", "스냅작가", "사회자", "축가", "드레스·정장", "하객알바"
];
const SORT_OPTIONS = [
  { value: "ALL", label: "전체" },
  { value: "NEW", label: "최신순" },
  { value: "POPULAR", label: "인기순" },
];
type FreelancerProfile = {
  id: number;
  memberId: number;
  memberName: string;
  categoryId: number;
  title: string;
  introduction: string;
  region: string;
  price: number | null;
  careerYears: number;
  createdAt: string;
  updatedAt: string;
};

function SkeletonCard() {
  return (
    <Card className="overflow-hidden border border-[#efeee7]">
      <Skeleton className="aspect-[4/5] w-full" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <div className="flex justify-between items-center pt-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function SearchPage() {
  const [activeChip, setActiveChip] = useState("전체");
  const [sortType, setSortType] = useState("ALL");
  const [keyword, setKeyword] = useState("");
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());

  const fetchFreelancers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append("keyword", keyword);
      if (sortType !== "ALL") params.append("sortType", sortType);

      const res = await fetch(
        `${API_BASE_URL}/api/freelancers?${params.toString()}`
      );
      const data = await res.json();
      setFreelancers(data.content);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("프리랜서 목록 조회 실패", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, [sortType]);

  const toggleBookmark = (id: number) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />

      {/* Header */}
      <div className="bg-[#f5f4ec] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-display)] text-3xl font-semibold text-[#1b1c18] mb-2">
            전문가 찾기
          </h1>
          <p className="text-sm text-[#75786c]">
            당신의 특별한 기념일을 위한 엄선된 전문가들을 만나보세요
          </p>
          {/* 키워드 검색 - shadcn Input + Button */}
          <div className="mt-4 flex gap-2">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchFreelancers()}
              placeholder="전문가 이름, 서비스 검색"
              className="w-72 rounded-xl border-[#c5c8ba]"
            />
            <Button
              onClick={fetchFreelancers}
              className="bg-[#4f6231] hover:bg-[#3d4c26] text-white rounded-xl"
            >
              검색
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-[#efeee7] bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
            {filterChips.map((chip) => (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeChip === chip
                    ? "bg-[#4f6231] text-white"
                    : "bg-[#f5f4ec] text-[#45483d] hover:bg-[#efeee7]"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sort bar - shadcn Select */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#75786c]">
            총 <span className="font-medium text-[#1b1c18]">{totalElements}</span>명
          </span>
          <Select value={sortType} onValueChange={(value) => setSortType(value ?? "ALL")}>
  <SelectTrigger className="w-32 rounded-xl border-[#c5c8ba]">
    <SelectValue>
      {SORT_OPTIONS.find((option) => option.value === sortType)?.label}
    </SelectValue>
  </SelectTrigger>
  <SelectContent alignItemWithTrigger={false} side="bottom" sideOffset={5}>
  {SORT_OPTIONS.map((option) => (
    <SelectItem key={option.value} value={option.value}>
      {option.label}
    </SelectItem>
  ))}
</SelectContent>
</Select>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        {/* 로딩 - 스켈레톤 */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : freelancers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-[#75786c]">등록된 전문가가 없습니다.</p>
            <Button
              variant="outline"
              onClick={() => { setKeyword(""); fetchFreelancers(); }}
              className="border-[#4f6231] text-[#4f6231]"
            >
              전체 보기
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {freelancers.map((pro) => (
              <Card
                key={pro.id}
                className="group overflow-hidden border border-[#efeee7] hover:shadow-[0px_4px_20px_rgba(108,129,76,0.1)] transition-all rounded-2xl"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f4ec] flex items-center justify-center">
                  <span className="text-[#75786c] text-sm">이미지 없음</span>
                  <button
                    onClick={() => toggleBookmark(pro.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <svg
                      className={`w-4 h-4 ${bookmarked.has(pro.id) ? "fill-[#6f5a55] text-[#6f5a55]" : "text-[#75786c]"}`}
                      fill={bookmarked.has(pro.id) ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <CardContent className="p-4">
  <h3 className="font-semibold text-[#1b1c18] text-sm mb-0.5">{pro.memberName}</h3>
  <p className="text-xs text-[#75786c] mb-2">{pro.title}</p>
  <div className="flex items-center gap-1 mb-3">
    <svg className="w-3 h-3 text-[#75786c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    <span className="text-xs text-[#75786c]">{pro.region}</span>
  </div>
  <div className="flex items-center justify-between">
    <span className="text-sm font-semibold text-[#4f6231]">
      {pro.price ? `₩${pro.price.toLocaleString()}~` : "협의"}
    </span>
    <Link
      href={`/profile/${pro.id}`}
      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs h-8 border-[#4f6231] text-[#4f6231] hover:bg-[#4f6231] hover:text-white rounded-xl")}
    >
      프로필 보기
    </Link>
  </div>
</CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}