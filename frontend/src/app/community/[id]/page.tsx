"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL, createAuthHeaders, getAccessToken } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [myMemberId, setMyMemberId] = useState<number | null>(null);

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

  const isAuthor = post && myMemberId !== null && post.memberId === myMemberId;

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />

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
                {post.memberImageUrl && (
                  <AvatarImage
                    src={post.memberImageUrl}
                    alt={post.memberName}
                  />
                )}
                <AvatarFallback className="bg-[#d3ebac] text-[#4f6231] text-xs font-semibold">
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

            {post.imageUrl && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#efeee7] mt-6">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="pt-6 text-sm text-[#45483d] leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}
