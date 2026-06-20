"use client";

import { CATEGORY } from "@/constants/category";
import { API_BASE_URL, createAuthHeaders } from "@/lib/auth";
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

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedFreelancer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const categories = Object.values(CATEGORY);

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

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name ?? "기타";
  };

  return (
    <div className="flex flex-1 flex-col bg-[#fbf9f2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18] mb-8 pb-3 border-b border-[#efeee7]">
          나의 찜목록
        </h1>

        <div className="flex gap-8">
          {/* 사이드바 */}
          <aside className="w-48 shrink-0">
            <p className="text-sm font-semibold text-[#1b1c18] mb-3">서비스</p>
            <ul className="space-y-1 border-b border-[#efeee7] pb-4 mb-4">
              <li>
                <button
                  onClick={() => setActiveCategoryId(null)}
                  className={`w-full text-left text-sm py-1 transition-colors ${
                    activeCategoryId === null
                      ? "font-semibold text-[#4f6231]"
                      : "text-[#75786c] hover:text-[#1b1c18]"
                  }`}
                >
                  전체 ({bookmarks.length})
                </button>
              </li>
              {categories.map((category) => {
                const count = bookmarks.filter(
                  (b) => b.categoryId === category.id,
                ).length;
                if (count === 0) return null;
                return (
                  <li key={category.id}>
                    <button
                      onClick={() => setActiveCategoryId(category.id)}
                      className={`w-full text-left text-sm py-1 transition-colors ${
                        activeCategoryId === category.id
                          ? "font-semibold text-[#4f6231]"
                          : "text-[#75786c] hover:text-[#1b1c18]"
                      }`}
                    >
                      {category.name} ({count})
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* 카드 목록 */}
          <div className="flex-1 min-h-[50vh]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
                <div className="w-8 h-8 border-2 border-[#4f6231] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[#75786c]">찜목록을 불러오는 중입니다</p>
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((b) => (
                  <div
                    key={b.id}
                    className="relative bg-white rounded-2xl overflow-hidden border border-[#efeee7] hover:shadow-[0px_4px_20px_rgba(108,129,76,0.08)] transition-all"
                  >
                    {/* 하트 버튼 */}
                    <button
                      onClick={() => handleRemove(b.freelancerProfileId)}
                      className="absolute top-3 right-3 z-10 text-[#e85454] hover:scale-110 transition-transform"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    {/* 이미지 영역 */}
                    <Link href={`/profile/${b.freelancerProfileId}`}>
                      <div className="aspect-[4/3] bg-[#f5f4ec] flex items-center justify-center">
                        <span className="text-[#75786c] text-sm">
                          이미지 없음
                        </span>
                      </div>
                    </Link>

                    {/* 카드 정보 */}
                    <div className="p-3">
                      <span className="text-xs text-[#75786c] mb-1 block">
                        {getCategoryName(b.categoryId)}
                      </span>
                      <Link href={`/profile/${b.freelancerProfileId}`}>
                        <p className="text-sm font-semibold text-[#1b1c18] mb-1 line-clamp-2 hover:text-[#4f6231] transition-colors">
                          {b.title}
                        </p>
                      </Link>
                      <p className="text-xs text-[#75786c] mb-2">
                        {b.memberName}
                      </p>
                      <p className="text-sm font-semibold text-[#1b1c18]">
                        {b.price ? `₩${b.price.toLocaleString()}~` : "협의"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="w-16 h-16 rounded-full bg-[#f5f4ec] flex items-center justify-center">
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
                <p className="font-semibold text-[#1b1c18]">
                  저장된 항목이 없습니다
                </p>
                <p className="text-sm text-[#75786c]">
                  마음에 드는 전문가를 저장해 보세요
                </p>
                <Link
                  href="/search"
                  className="mt-2 px-6 py-2 bg-[#4f6231] text-white text-sm rounded-xl hover:bg-[#677b47] transition-colors"
                >
                  전문가 둘러보기
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
