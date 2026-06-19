"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/contexts/UserContext";
import { API_BASE_URL, getAccessToken } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type PostType = "WEDDING_REVIEW" | "TIP" | "BOARD";

type Post = {
  id: number;
  memberId: number;
  memberName: string;
  memberImageUrl?: string | null;
  title: string;
  content: string;
  type: PostType;
  imageUrl: string | null;
  createdAt: string;
};

const tabs: { label: string; type: PostType | null }[] = [
  { label: "전체", type: null },
  { label: "웨딩 후기", type: "WEDDING_REVIEW" },
  { label: "꿀팁", type: "TIP" },
  { label: "게시판", type: "BOARD" },
];

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

function PostSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#efeee7] mb-6">
      <Skeleton className="h-4 w-20 mb-3 rounded-full" />
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

function MemberAvatar({
  post,
  currentUser,
}: {
  post: Post;
  currentUser: { id: number; profileImageUrl: string | null } | null;
}) {
  // 백엔드에서 memberImageUrl 오면 사용, 아니면 본인 글일 때 Context 이미지 사용
  const imageUrl =
    post.memberImageUrl ||
    (currentUser?.id === post.memberId ? currentUser?.profileImageUrl : null);

  return (
    <Avatar className="w-7 h-7">
      {imageUrl && <AvatarImage src={imageUrl} alt={post.memberName} />}
      <AvatarFallback className="bg-[#d3ebac] text-[#4f6231] text-xs font-semibold">
        {post.memberName.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
}

export default function CommunityPage() {
  const { user } = useUser();
  const [activeType, setActiveType] = useState<PostType | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeType) params.append("type", activeType);
        params.append("page", String(page));
        params.append("size", "10");
        const res = await fetch(
          `${API_BASE_URL}/api/v1/posts?${params.toString()}`,
        );
        const data = await res.json();
        setPosts(data.content ?? []);
        setTotalPages(data.totalPages ?? 0);
      } catch (e) {
        console.error("게시글 목록 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [activeType, page]);

  const handleTabChange = (type: PostType | null) => {
    setActiveType(type);
    setPage(0);
  };

  const isLoggedIn = mounted && Boolean(getAccessToken());

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />

      <section className="bg-[#f5f4ec] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-[#6f5a55] mb-3">
            Community
          </p>
          <h1 className="font-[var(--font-display)] text-4xl font-semibold text-[#1b1c18] mb-3">
            커뮤니티
          </h1>
          <p className="text-sm text-[#75786c] max-w-md mx-auto">
            현대적인 커플과 전문가들이 지혜를 나누는 공간
          </p>
        </div>
      </section>

      <div className="border-b border-[#efeee7] bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => handleTabChange(tab.type)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeType === tab.type
                    ? "bg-[#4f6231] text-white"
                    : "text-[#45483d] hover:bg-[#f5f4ec]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#75786c]">게시글 목록</p>
          {isLoggedIn && (
            <Link
              href="/community/write"
              className="text-sm font-medium text-white bg-[#4f6231] hover:bg-[#677b47] px-4 py-2 rounded-full transition-colors"
            >
              글쓰기
            </Link>
          )}
        </div>

        {loading ? (
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-[#75786c]">게시글이 없습니다.</p>
          </div>
        ) : (
          <div>
            {posts.map((post, index) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="block mb-6"
              >
                <article className="bg-white rounded-2xl border border-[#efeee7] hover:shadow-[0px_4px_20px_rgba(108,129,76,0.08)] hover:border-[#c5c8ba] transition-all cursor-pointer flex overflow-hidden min-h-[160px]">
                  {post.imageUrl && (
                    <div className="relative w-36 sm:w-48 h-40 shrink-0">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 144px, 192px"
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <Badge
                        className={`${typeColor[post.type]} border-0 text-xs mb-2.5`}
                      >
                        {typeLabel[post.type]}
                      </Badge>
                      <h3 className="font-[var(--font-display)] font-semibold text-[#1b1c18] text-lg mb-1.5 leading-snug line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[#9a9c8f] leading-relaxed line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f5f4ec]">
                      <div className="flex items-center gap-2">
                        <MemberAvatar post={post} currentUser={user} />
                        <span className="text-xs font-medium text-[#45483d]">
                          {post.memberName}
                        </span>
                      </div>
                      <span className="text-xs text-[#9a9c8f]">
                        {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                      </span>
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
