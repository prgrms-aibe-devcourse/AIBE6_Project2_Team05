"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/contexts/UserContext";
import { API_BASE_URL, createAuthHeaders, getAccessToken } from "@/lib/auth";
import { getRoleTheme } from "@/lib/roleTheme";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useCallback, useState } from "react";

type PostType = "WEDDING_REVIEW" | "TIP" | "BOARD";

type Post = {
  id: number;
  memberId: number;
  memberName: string;
  memberImageUrl?: string | null;
  memberRole?: "CLIENT" | "FREELANCER" | null;
  title: string;
  content: string;
  type: PostType;
  imageUrl: string | null;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
};

const typeLabel: Record<PostType, string> = {
  WEDDING_REVIEW: "웨딩 후기",
  TIP: "꿀팁",
  BOARD: "게시판",
};

const typeColor: Record<PostType, string> = {
  WEDDING_REVIEW: "bg-[#d3ebac] text-[#4f6231]",
  TIP: "bg-[#f6d9d3] text-[#6f5a55]",
  BOARD: "bg-[#efeee7] text-[#45483d]",
};

export default function CommunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [myMemberId, setMyMemberId] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(() =>
    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const showNext = useCallback((total: number) =>
    setLightboxIndex((i) => (i !== null && i < total - 1 ? i + 1 : i)), []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext(post?.imageUrls?.length ?? 0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, showPrev, showNext, post?.imageUrls?.length]);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace(`/login?redirect=/community/${id}`);
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/posts/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPost(data);
      } catch {
        router.push("/community");
      } finally {
        setLoading(false);
      }
    };

    const fetchMe = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/members/me`, {
          headers: createAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setMyMemberId(data.id);
        }
      } catch {}
    };

    fetchPost();
    fetchMe();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm("게시글을 삭제하시겠습니까?")) return;
    setDeleting(true);
    try {
      await fetch(`${API_BASE_URL}/api/v1/posts/${id}`, {
        method: "DELETE",
        headers: createAuthHeaders(),
      });
      router.push("/community");
    } catch {
      setDeleting(false);
    }
  };

  const isAuthor =
    !!post &&
    myMemberId !== null &&
    Number(post.memberId) === Number(myMemberId);
  const isMyPost =
    !!post && !!user && Number(post.memberId) === Number(user.id);
  const roleForTheme = post?.memberRole ?? (isMyPost ? user.role : null);
  const { avatarBgClass, avatarTextClass } = getRoleTheme(
    roleForTheme,
  );
  const memberImageUrl =
    post?.memberImageUrl || (isMyPost ? user?.profileImageUrl : null);

  return (
    <div className="flex flex-col min-h-full bg-[#fbf9f2]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link
          href="/community"
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
          커뮤니티로
        </Link>

        {loading ? (
          <div className="bg-white rounded-2xl border border-[#efeee7] p-6 sm:p-8 space-y-4">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-40" />
            <div className="pt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ) : post ? (
          <div className="bg-white rounded-2xl border border-[#efeee7] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <Badge
                  className={`${typeColor[post.type]} border-0 text-xs mb-3`}
                >
                  {typeLabel[post.type]}
                </Badge>
                <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18] leading-snug">
                  {post.title}
                </h1>
              </div>
              {isAuthor && (
                <div className="flex gap-2 shrink-0">
                  <Link href={`/community/${id}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#c5c8ba] text-[#45483d]"
                    >
                      수정
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={deleting}
                    onClick={handleDelete}
                    className="border-red-200 text-red-500 hover:bg-red-50"
                  >
                    삭제
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pb-6 border-b border-[#efeee7]">
              <Avatar className="w-8 h-8">
                {memberImageUrl && (
                  <AvatarImage src={memberImageUrl} alt={post.memberName} />
                )}
                <AvatarFallback
                  className={`${avatarBgClass} ${avatarTextClass} text-xs font-semibold`}
                >
                  {post.memberName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-[#45483d] font-medium">
                {post.memberName}
              </span>
              <span className="text-xs text-[#75786c] ml-auto">
                {new Date(post.createdAt).toLocaleDateString("ko-KR")}
              </span>
            </div>

            {post.imageUrls?.length > 0 && (
              <div className={`mt-6 ${post.imageUrls.length === 1 ? "" : "grid grid-cols-2 gap-2"}`}>
                {post.imageUrls.map((url, index) => (
                  <div
                    key={index}
                    onClick={() => setLightboxIndex(index)}
                    className={`relative rounded-xl overflow-hidden border border-[#efeee7] cursor-zoom-in ${
                      post.imageUrls.length === 1 ? "w-full aspect-video" : "aspect-square"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${post.title} 이미지 ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 라이트박스 */}
            {lightboxIndex !== null && post.imageUrls?.length > 0 && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
                onClick={closeLightbox}
              >
                {/* 닫기 버튼 */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* 이미지 카운터 */}
                {post.imageUrls.length > 1 && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/40 px-3 py-1 rounded-full z-10">
                    {lightboxIndex + 1} / {post.imageUrls.length}
                  </div>
                )}

                {/* 이전 버튼 */}
                {post.imageUrls.length > 1 && lightboxIndex > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); showPrev(); }}
                    className="absolute left-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* 다음 버튼 */}
                {post.imageUrls.length > 1 && lightboxIndex < post.imageUrls.length - 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); showNext(post.imageUrls.length); }}
                    className="absolute right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                {/* 메인 이미지 */}
                <div
                  className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={post.imageUrls[lightboxIndex]}
                    alt={`${post.title} 이미지 ${lightboxIndex + 1}`}
                    width={1200}
                    height={900}
                    className="object-contain max-w-[90vw] max-h-[85vh] rounded-lg select-none"
                    priority
                  />
                </div>
              </div>
            )}

            <div className="pt-6 text-sm text-[#45483d] leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
