"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MySidebar from "@/components/mypage/MySidebar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL, clearAccessToken, createAuthHeaders, getAccessToken } from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";

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

type MemberRole = "CLIENT" | "FREELANCER";

export default function MyPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<RecruitPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [role, setRole] = useState<MemberRole | null>(null);
  const [freelancerProfileId, setFreelancerProfileId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (!getAccessToken()) {
      router.push("/login");
      return;
    }

    const fetchMe = async () => {
      try {
        const res = await authFetch(`${API_BASE_URL}/api/v1/members/me`);
        if (res.ok) {
          const data = await res.json();
          setName(data.name ?? "");
          setEmail(data.email ?? "");
          setProfileImg(data.profileImageUrl ?? null);
          setRole(data.role ?? null);
          if (data.role === "FREELANCER") {
            try {
              const profileRes = await authFetch(
                `${API_BASE_URL}/api/freelancers/me`,
              );
              if (profileRes.ok) {
                const profileData = await profileRes.json();
                setFreelancerProfileId(profileData.id);
              }
            } catch {}
          }
        }
      } catch {}
    };

    const fetchPosts = async () => {
      try {
        const res = await authFetch(`${API_BASE_URL}/api/v1/members/me/jobs`);
        if (res.ok) setPosts(await res.json());
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
    fetchPosts();
  }, [router]);

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { ...createAuthHeaders() },
    }).catch(() => {});
    clearAccessToken();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <MySidebar
            name={name}
            email={email}
            profileImg={profileImg}
            role={role}
            freelancerProfileId={freelancerProfileId}
            onLogout={handleLogout}
          />

          <main className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18]">
                내 구인글
              </h1>
              <Link href="/jobs/write">
                <button className="text-sm font-medium text-[#4f6231] hover:underline">
                  새 구인글 작성
                </button>
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
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
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#efeee7] p-12 text-center">
                <p className="text-[#75786c] text-sm mb-4">
                  등록한 구인글이 없습니다.
                </p>
                <Link
                  href="/jobs/write"
                  className="text-sm text-[#4f6231] hover:underline font-medium"
                >
                  구인글 작성하기
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Link key={post.id} href={`/jobs/${post.id}`}>
                    <div className="bg-white rounded-2xl border border-[#efeee7] p-6 hover:border-[#c5c8ba] transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
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
                      <h2 className="text-sm font-semibold text-[#1b1c18] mb-2">
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
                          {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
