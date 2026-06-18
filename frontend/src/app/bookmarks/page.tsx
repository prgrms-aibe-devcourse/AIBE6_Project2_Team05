"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { buttonVariants } from "@/components/ui/button";
import { API_BASE_URL, createAuthHeaders } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BookmarkedFreelancer {
  id: number;
  freelancerProfileId: number;
  memberName: string;
  title: string;
  region: string;
  price: number | null;
  createdAt: string;
  categoryId: number;
}

type Category = {
  id: number;
  name: string;
};

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedFreelancer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("카테고리 목록 조회 실패", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/bookmarks`, {
          headers: createAuthHeaders(),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setBookmarks(data);
      } catch (error) {
        console.error("북마크 목록 조회 실패", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleRemove = async (freelancerProfileId: number) => {
    const prev = bookmarks;

    setBookmarks((b) =>
      b.filter((item) => item.freelancerProfileId !== freelancerProfileId),
    );

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/bookmarks/${freelancerProfileId}`,
        {
          method: "POST",
          headers: createAuthHeaders(),
        },
      );
      if (!res.ok) throw new Error();
    } catch (error) {
      console.error("북마크 해제 실패", error);
      setBookmarks(prev);
    }
  };

  const filtered = bookmarks.filter((b) => {
    if (activeCategoryId === null) return true;
    return b.categoryId === activeCategoryId;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-[var(--font-display)] text-3xl font-semibold text-[#1b1c18] mb-2">
          관심 프리랜서
        </h1>
        <p className="text-sm text-[#75786c] mb-8">
          저장해두신 웨딩 전문가들을 한 눈에 확인하세요
        </p>

        {/* 카테고리 탭 */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategoryId(null)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategoryId === null
                ? "bg-[#4f6231] text-white"
                : "bg-[#f5f4ec] text-[#45483d] hover:bg-[#efeee7]"
            }`}
          >
            전체
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategoryId(category.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategoryId === category.id
                  ? "bg-[#4f6231] text-white"
                  : "bg-[#f5f4ec] text-[#45483d] hover:bg-[#efeee7]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-[#efeee7] h-44 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-5">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#efeee7] hover:shadow-[0px_4px_20px_rgba(108,129,76,0.08)] transition-all"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative sm:w-64 h-44 sm:h-auto shrink-0 overflow-hidden bg-[#f5f4ec] flex items-center justify-center">
                    <span className="text-[#75786c] text-sm">이미지 없음</span>
                    <button
                      onClick={() => handleRemove(b.freelancerProfileId)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors text-[#75786c] hover:text-red-500"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-[var(--font-display)] text-xl font-semibold text-[#1b1c18] mb-2">
                        {b.title}
                      </h3>
                      <p className="text-sm text-[#75786c] mb-2">
                        {b.memberName}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-[#75786c] mb-3">
                        <svg
                          className="w-3.5 h-3.5"
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
                        {b.region}
                      </div>
                      <span className="text-sm font-semibold text-[#4f6231]">
                        {b.price ? `₩${b.price.toLocaleString()}~` : "협의"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <Link
                        href={`/profile/${b.freelancerProfileId}`}
                        className={cn(
                          buttonVariants({ size: "sm" }),
                          "bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl text-xs",
                        )}
                      >
                        포트폴리오 보기
                      </Link>
                      <Link
                        href={`/reserve/${b.freelancerProfileId}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "border-[#c5c8ba] text-[#45483d] hover:border-[#4f6231] hover:text-[#4f6231] rounded-xl text-xs",
                        )}
                      >
                        예약하기
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-[#f5f4ec] flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#75786c]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <p className="font-semibold text-[#1b1c18] mb-2">
              저장된 항목이 없습니다
            </p>
            <p className="text-sm text-[#75786c] mb-6">
              마음에 드는 전문가를 저장해 보세요
            </p>
            <Link
              href="/search"
              className={cn(
                buttonVariants(),
                "bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl",
              )}
            >
              전문가 둘러보기
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
