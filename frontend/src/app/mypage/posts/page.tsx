"use client";

import Footer from "@/components/Footer";
import MySidebar from "@/components/mypage/MySidebar";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/contexts/UserContext";
import {
  API_BASE_URL,
  clearAccessToken,
  createAuthHeaders,
  getAccessToken,
} from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RecruitStatus = "OPEN" | "CLOSED";

type RecruitPost = {
  id: number;
  title: string;
  categoryName: string;
  budget: number | null;
  weddingDate: string;
  status: RecruitStatus;
  region: string | null;
  createdAt: string;
};

const PAGE_SIZE = 5;

export default function MyPostsPage() {
  const router = useRouter();
  const { clearUser } = useUser();
  const [posts, setPosts] = useState<RecruitPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<RecruitStatus | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!getAccessToken()) {
      router.push("/login");
      return;
    }
    const fetchPosts = async () => {
      try {
        const res = await authFetch(`${API_BASE_URL}/api/v1/members/me/jobs`);
        if (res.ok) setPosts(await res.json());
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [router]);

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { ...createAuthHeaders() },
    }).catch(() => {});
    clearAccessToken();
    clearUser();
    router.push("/login");
    router.refresh();
  };

  const handleDelete = async (e: React.MouseEvent, postId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("구인글을 삭제하시겠습니까?")) return;
    setDeletingId(postId);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/v1/jobs/${postId}`, {
        method: "DELETE",
      });
      if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (e: React.MouseEvent, post: RecruitPost) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = post.status === "OPEN" ? "CLOSED" : "OPEN";
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/jobs/${post.id}/status?status=${newStatus}`,
        { method: "PATCH", headers: createAuthHeaders() },
      );
      if (res.ok)
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p)),
        );
    } catch {}
  };

  const filtered = filter ? posts.filter((p) => p.status === filter) : posts;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <MySidebar onLogout={handleLogout} />
          <main className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18]">
                내 구인글
                {!loading && (
                  <span className="ml-2 text-base font-normal text-[#75786c]">
                    {filtered.length}건
                  </span>
                )}
              </h1>
              <Link
                href="/jobs/write"
                className="text-sm font-medium px-4 py-2 bg-[#4f6231] text-white rounded-xl hover:bg-[#677b47] transition-colors"
              >
                + 새 구인글 작성
              </Link>
            </div>

            {!loading && posts.length > 0 && (
              <div className="flex gap-2">
                {([null, "OPEN", "CLOSED"] as (RecruitStatus | null)[]).map(
                  (s) => (
                    <button
                      key={String(s)}
                      onClick={() => {
                        setFilter(s);
                        setPage(0);
                      }}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                        filter === s
                          ? "bg-[#4f6231] text-white border-[#4f6231]"
                          : "bg-white text-[#45483d] border-[#c5c8ba] hover:border-[#4f6231]"
                      }`}
                    >
                      {s === null ? "전체" : s === "OPEN" ? "모집 중" : "마감"}
                    </button>
                  ),
                )}
              </div>
            )}

            {loading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-[#efeee7] p-6"
                  >
                    <Skeleton className="h-5 w-48 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#efeee7] p-12 text-center">
                <p className="text-[#75786c] text-sm mb-4">
                  {filter
                    ? "해당 조건의 구인글이 없습니다."
                    : "등록한 구인글이 없습니다."}
                </p>
                <Link
                  href="/jobs/write"
                  className="text-sm text-[#4f6231] hover:underline font-medium"
                >
                  구인글 작성하기
                </Link>
              </div>
            ) : (
              <>
                <div>
                  {paginated.map((post) => (
                    <Link
                      key={post.id}
                      href={`/jobs/${post.id}`}
                      className="block mb-4"
                    >
                      <div
                        className={`bg-white rounded-2xl border border-[#efeee7] p-6 hover:shadow-md hover:border-[#c5c8ba] transition-all cursor-pointer ${post.status === "CLOSED" ? "opacity-70" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
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
                            <h2 className="text-sm font-semibold text-[#1b1c18] mb-3 truncate">
                              {post.title}
                            </h2>
                            <div className="flex gap-4 text-xs text-[#75786c]">
                              <span>
                                예산:{" "}
                                {post.budget != null
                                  ? `${post.budget.toLocaleString()}원`
                                  : "협의"}
                              </span>
                              <span>
                                웨딩일:{" "}
                                {new Date(post.weddingDate).toLocaleDateString(
                                  "ko-KR",
                                )}
                              </span>
                              <span>
                                등록일:{" "}
                                {new Date(post.createdAt).toLocaleDateString(
                                  "ko-KR",
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/jobs/${post.id}/edit`);
                              }}
                              className="text-xs px-3 py-1.5 border border-[#c5c8ba] text-[#45483d] rounded-lg hover:bg-[#f5f4ec] transition-colors"
                            >
                              수정
                            </button>
                            <button
                              onClick={(e) => handleStatusChange(e, post)}
                              className={`text-xs px-3 py-1.5 border rounded-lg transition-colors ${post.status === "OPEN" ? "border-[#c5c8ba] text-[#45483d] hover:bg-[#f5f4ec]" : "border-[#4f6231] text-[#4f6231] hover:bg-[#f0f4eb]"}`}
                            >
                              {post.status === "OPEN" ? "마감" : "재오픈"}
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, post.id)}
                              disabled={deletingId === post.id}
                              className="text-xs px-3 py-1.5 border border-red-200 text-red-400 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              {deletingId === post.id ? "..." : "삭제"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
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
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
