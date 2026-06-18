"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MySidebar from "@/components/mypage/MySidebar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  API_BASE_URL,
  clearAccessToken,
  createAuthHeaders,
  getAccessToken,
} from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";

type ProposalStatus = "SUBMITTED" | "ACCEPTED" | "REJECTED";

type Proposal = {
  id: number;
  freelancerProfileId: number;
  freelancerName: string;
  content: string;
  price: number | null;
  region: string | null;
  status: ProposalStatus;
  createdAt: string;
};

const STATUS_STYLE: Record<
  ProposalStatus,
  { label: string; className: string }
> = {
  SUBMITTED: { label: "검토 중", className: "bg-[#fff4cc] text-[#8a6d00]" },
  ACCEPTED: { label: "수락됨", className: "bg-[#d3ebac] text-[#4f6231]" },
  REJECTED: { label: "거절됨", className: "bg-[#f6d9d3] text-[#6f5a55]" },
};

type MemberRole = "CLIENT" | "FREELANCER";

export default function MyProposalsPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
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

    const fetchProposals = async () => {
      try {
        const res = await authFetch(
          `${API_BASE_URL}/api/v1/members/me/proposals`,
        );
        if (res.ok) setProposals(await res.json());
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
    fetchProposals();
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
            <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18]">
              내 제안서
            </h1>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-[#efeee7] p-6"
                  >
                    <Skeleton className="h-5 w-32 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : proposals.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#efeee7] p-12 text-center">
                <p className="text-[#75786c] text-sm mb-4">
                  제출한 제안서가 없습니다.
                </p>
                <Link
                  href="/jobs"
                  className="text-sm text-[#4f6231] hover:underline font-medium"
                >
                  구인글 둘러보기
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="bg-white rounded-2xl border border-[#efeee7] p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        className={`border-0 text-xs ${STATUS_STYLE[proposal.status].className}`}
                      >
                        {STATUS_STYLE[proposal.status].label}
                      </Badge>
                      <span className="text-xs text-[#75786c]">
                        {new Date(proposal.createdAt).toLocaleDateString(
                          "ko-KR",
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-[#45483d] whitespace-pre-wrap mb-3 line-clamp-3">
                      {proposal.content}
                    </p>
                    <div className="flex gap-4 text-xs text-[#75786c]">
                      <span>
                        제안 가격:{" "}
                        {proposal.price != null
                          ? `${proposal.price.toLocaleString()}원`
                          : "협의"}
                      </span>
                      {proposal.region && <span>지역: {proposal.region}</span>}
                    </div>
                  </div>
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
