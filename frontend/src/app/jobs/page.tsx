"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL, getAccessToken } from "@/lib/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

type RecruitStatus = "OPEN" | "CLOSED";
type Category = { id: number; name: string };
type RecruitPost = {
  id: number;
  memberId: number;
  memberName: string;
  title: string;
  content: string;
  categoryId: number;
  categoryName: string;
  budget: number | null;
  weddingDate: string;
  status: RecruitStatus;
  region: string | null;
  createdAt: string;
};

function JobSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#efeee7]">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <Skeleton className="h-5 w-2/3 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-4/5 mb-4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<RecruitPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [regionInput, setRegionInput] = useState("");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState<RecruitStatus | null>("OPEN");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetch(`${API_BASE_URL}/api/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (categoryId) params.append("categoryId", String(categoryId));
        if (region.trim()) params.append("region", region.trim());
        if (status) params.append("status", status);
        params.append("page", String(page));
        params.append("size", "6");
        params.append("sort", "createdAt,desc");
        const res = await fetch(
          `${API_BASE_URL}/api/v1/jobs?${params.toString()}`,
        );
        const data = await res.json();
        setPosts(data.content ?? []);
        setTotalPages(data.totalPages ?? 0);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [categoryId, region, status, page]);

  const isLoggedIn = mounted && Boolean(getAccessToken());

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />

      <section className="bg-[#f5f4ec] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-[#6f5a55] mb-3">
            Recruit
          </p>
          <h1 className="font-[var(--font-display)] text-4xl font-semibold text-[#1b1c18] mb-3">
            구인글
          </h1>
          <p className="text-sm text-[#75786c] max-w-md mx-auto">
            웨딩 전문가를 찾는 예비부부의 구인 공고
          </p>
        </div>
      </section>

      <div className="border-b border-[#efeee7] bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            <button
              onClick={() => {
                setCategoryId(null);
                setPage(0);
              }}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                categoryId === null
                  ? "bg-[#4f6231] text-white border-[#4f6231]"
                  : "bg-white text-[#45483d] border-[#c5c8ba] hover:border-[#4f6231]"
              }`}
            >
              전체
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCategoryId(c.id);
                  setPage(0);
                }}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  categoryId === c.id
                    ? "bg-[#4f6231] text-white border-[#4f6231]"
                    : "bg-white text-[#45483d] border-[#c5c8ba] hover:border-[#4f6231]"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 border border-[#c5c8ba] rounded-full px-3 py-1.5 bg-white">
              <svg
                className="w-3.5 h-3.5 text-[#75786c]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="지역 검색"
                value={regionInput}
                onChange={(e) => setRegionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setRegion(regionInput);
                    setPage(0);
                  }
                }}
                className="text-sm bg-transparent text-[#45483d] focus:outline-none w-24 placeholder:text-[#75786c]"
              />
              {regionInput && (
                <button
                  onClick={() => {
                    setRegionInput("");
                    setRegion("");
                    setPage(0);
                  }}
                >
                  <svg
                    className="w-3.5 h-3.5 text-[#75786c]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex gap-1">
              {([null, "OPEN", "CLOSED"] as (RecruitStatus | null)[]).map(
                (s) => (
                  <button
                    key={String(s)}
                    onClick={() => {
                      setStatus(s);
                      setPage(0);
                    }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      status === s
                        ? "bg-[#4f6231] text-white"
                        : "text-[#45483d] hover:bg-[#f5f4ec]"
                    }`}
                  >
                    {s === null ? "전체" : s === "OPEN" ? "모집 중" : "마감"}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#75786c]">
            구인글 목록
            {!loading && (
              <span className="ml-1 font-medium text-[#1b1c18]">
                {posts.length}건
              </span>
            )}
          </p>
          {isLoggedIn && (
            <Link
              href="/jobs/write"
              className="text-sm font-medium text-white bg-[#4f6231] hover:bg-[#677b47] px-4 py-2 rounded-full transition-colors"
            >
              + 글쓰기
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-full bg-[#f5f4ec] flex items-center justify-center text-2xl">
              📋
            </div>
            <p className="text-[#75786c] text-sm">
              조건에 맞는 구인글이 없습니다.
            </p>
            {isLoggedIn && (
              <Link
                href="/jobs/write"
                className="text-sm text-[#4f6231] hover:underline font-medium"
              >
                첫 번째 구인글을 작성해보세요
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {posts.map((post) => (
              <Link key={post.id} href={`/jobs/${post.id}`}>
                <article
                  className={`bg-white rounded-2xl border border-[#efeee7] hover:shadow-[0px_4px_20px_rgba(108,129,76,0.08)] hover:border-[#c5c8ba] transition-all cursor-pointer p-5 h-full flex flex-col ${post.status === "CLOSED" ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex gap-1.5 flex-wrap">
                      <Badge className="bg-[#d3ebac] text-[#4f6231] border-0 text-xs">
                        {post.categoryName}
                      </Badge>
                      <Badge
                        className={`border-0 text-xs ${post.status === "OPEN" ? "bg-[#f6d9d3] text-[#6f5a55]" : "bg-[#efeee7] text-[#75786c]"}`}
                      >
                        {post.status === "OPEN" ? "모집 중" : "마감"}
                      </Badge>
                      {post.region && (
                        <Badge className="bg-[#efeee7] text-[#45483d] border-0 text-xs">
                          {post.region}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-[#75786c] shrink-0">
                      {new Date(post.weddingDate).toLocaleDateString("ko-KR")}{" "}
                      예정
                    </span>
                  </div>
                  <h3 className="font-[var(--font-display)] font-semibold text-[#1b1c18] text-base mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#75786c] leading-relaxed line-clamp-2 mb-4 flex-1">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#efeee7]">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="bg-[#d3ebac] text-[#4f6231] text-xs font-semibold">
                          {post.memberName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-[#75786c]">
                        {post.memberName}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#75786c]">예산</p>
                      <p className="text-sm font-semibold text-[#4f6231]">
                        {post.budget != null
                          ? `${post.budget.toLocaleString()}원`
                          : "협의"}
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="border-[#c5c8ba]"
            >
              이전
            </Button>
            <span className="text-sm text-[#75786c] flex items-center px-3">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="border-[#c5c8ba]"
            >
              다음
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
