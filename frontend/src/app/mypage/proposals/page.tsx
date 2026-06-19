"use client";

import MySidebar from "@/components/mypage/MySidebar";
import { Badge } from "@/components/ui/badge";
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

type ProposalStatus = "SUBMITTED" | "ACCEPTED" | "REJECTED";

type Proposal = {
  id: number;
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

const STATUS_DESC: Record<ProposalStatus, string> = {
  SUBMITTED: "구인글 작성자가 검토 중입니다.",
  ACCEPTED: "제안이 수락되어 예약이 연결되었습니다.",
  REJECTED: "아쉽게도 이번 제안은 수락되지 않았습니다.",
};

export default function MyProposalsPage() {
  const router = useRouter();
  const { clearUser } = useUser();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getAccessToken()) {
      router.push("/login");
      return;
    }

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
    fetchProposals();
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

  return (
    <div className="flex flex-col min-h-full bg-[#fbf9f2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <MySidebar onLogout={handleLogout} />
          <main className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18]">
                내 제안서
              </h1>
              <span className="text-xs text-[#75786c]">
                총 {proposals.length}건
              </span>
            </div>
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
                {proposals.map((proposal) => {
                  const style = STATUS_STYLE[proposal.status];
                  return (
                    <div
                      key={proposal.id}
                      className="bg-white rounded-2xl border border-[#efeee7] p-5 hover:shadow-md hover:border-[#c5c8ba] transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge
                          className={`border-0 text-xs ${style.className}`}
                        >
                          {style.label}
                        </Badge>
                        <span className="text-xs text-[#75786c]">
                          {new Date(proposal.createdAt).toLocaleDateString(
                            "ko-KR",
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-[#75786c] mb-3">
                        {STATUS_DESC[proposal.status]}
                      </p>
                      <p className="text-sm text-[#45483d] whitespace-pre-wrap mb-4 line-clamp-3 leading-relaxed">
                        {proposal.content}
                      </p>
                      <div className="flex items-center gap-4 pt-3 border-t border-[#efeee7]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-[#75786c]">
                            제안 가격
                          </span>
                          <span className="text-sm font-semibold text-[#1b1c18]">
                            {proposal.price != null
                              ? `${proposal.price.toLocaleString()}원`
                              : "협의"}
                          </span>
                        </div>
                        {proposal.region && (
                          <>
                            <span className="text-[#efeee7]">|</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-[#75786c]">
                                지역
                              </span>
                              <span className="text-sm text-[#45483d]">
                                {proposal.region}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
