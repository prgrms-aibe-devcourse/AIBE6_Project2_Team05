"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL, createAuthHeaders, getAccessToken } from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RecruitStatus = "OPEN" | "CLOSED";
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

type RecruitPost = {
  id: number;
  memberId: number;
  memberName: string;
  title: string;
  content: string;
  categoryName: string;
  budget: number | null;
  weddingDate: string;
  status: RecruitStatus;
  region: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<RecruitPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [myMemberId, setMyMemberId] = useState<number | null>(null);
  const [myRole, setMyRole] = useState<string | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalContent, setProposalContent] = useState("");
  const [proposalPrice, setProposalPrice] = useState("");
  const [proposalRegion, setProposalRegion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [proposalError, setProposalError] = useState("");
  const [proposalSuccess, setProposalSuccess] = useState("");

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace(`/login?redirect=/jobs/${id}`);
      return;
    }
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/jobs/${id}`);
        if (!res.ok) throw new Error();
        setPost(await res.json());
      } catch {
        router.push("/jobs");
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
          setMyRole(data.role);
        }
      } catch {}
    };
    fetchPost();
    fetchMe();
  }, [id, router]);

  useEffect(() => {
    if (!post || !myMemberId || post.memberId !== myMemberId) return;
    const fetchProposals = async () => {
      try {
        const res = await authFetch(
          `${API_BASE_URL}/api/v1/jobs/${id}/proposals`,
        );
        if (res.ok) setProposals(await res.json());
      } catch {}
    };
    fetchProposals();
  }, [post, myMemberId, id]);

  const handleDelete = async () => {
    if (!confirm("구인글을 삭제하시겠습니까?")) return;
    setDeleting(true);
    try {
      await fetch(`${API_BASE_URL}/api/v1/jobs/${id}`, {
        method: "DELETE",
        headers: createAuthHeaders(),
      });
      router.push("/mypage/posts");
    } catch {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (status: RecruitStatus) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/jobs/${id}/status?status=${status}`,
        { method: "PATCH", headers: createAuthHeaders() },
      );
      if (res.ok) setPost(await res.json());
    } catch {}
  };

  const handleSubmitProposal = async () => {
    setProposalError("");
    setProposalSuccess("");
    if (!proposalContent.trim()) {
      setProposalError("제안 내용을 입력해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const body: { content: string; price?: number; region?: string } = {
        content: proposalContent,
      };
      if (proposalPrice) body.price = Number(proposalPrice);
      if (proposalRegion) body.region = proposalRegion;
      const res = await authFetch(
        `${API_BASE_URL}/api/v1/jobs/${id}/proposals`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "제안서 제출에 실패했습니다.");
      }
      setProposalSuccess("제안서가 제출되었습니다!");
      setProposalContent("");
      setProposalPrice("");
      setProposalRegion("");
      alert("제안서가 제출되었습니다!");
      router.push("/jobs");
    } catch (e) {
      setProposalError(
        e instanceof Error ? e.message : "제안서 제출에 실패했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptProposal = async (proposalId: number) => {
    if (
      !confirm(
        "이 제안서를 수락하시겠습니까? 수락 시 구인글이 마감되고 제안서 상태가 수락으로 변경됩니다.",
      )
    )
      return;
    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/v1/proposals/${proposalId}/accept`,
        { method: "PATCH" },
      );
      if (res.ok) {
        const updated = await res.json();
        setProposals((prev) =>
          prev.map((p) => (p.id === proposalId ? updated : p)),
        );
        setPost((prev) => (prev ? { ...prev, status: "CLOSED" } : prev));
      }
    } catch {}
  };

  const handleRejectProposal = async (proposalId: number) => {
    if (!confirm("이 제안서를 거절하시겠습니까?")) return;
    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/v1/proposals/${proposalId}/reject`,
        { method: "PATCH" },
      );
      if (res.ok) {
        const updated = await res.json();
        setProposals((prev) =>
          prev.map((p) => (p.id === proposalId ? updated : p)),
        );
      }
    } catch {}
  };

  const isAuthor = post && myMemberId && post.memberId === myMemberId;

  return (
    <div className="flex flex-col min-h-full bg-[#fbf9f2]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link
          href="/jobs"
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
          구인글 목록으로
        </Link>

        {loading ? (
          <div className="bg-white rounded-2xl border border-[#efeee7] p-6 sm:p-8 space-y-4">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-40" />
            <div className="pt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ) : post ? (
          <div className="bg-white rounded-2xl border border-[#efeee7] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex gap-2 flex-wrap mb-3">
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
                <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18] leading-snug">
                  {post.title}
                </h1>
              </div>
              {isAuthor && (
                <div className="flex flex-col gap-2 shrink-0">
                  <Link href={`/jobs/${id}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-[#c5c8ba] text-[#45483d]"
                    >
                      수정
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleStatusChange(
                        post.status === "OPEN" ? "CLOSED" : "OPEN",
                      )
                    }
                    className="w-full border-[#c5c8ba] text-[#45483d]"
                  >
                    {post.status === "OPEN" ? "마감하기" : "재오픈"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={deleting}
                    onClick={handleDelete}
                    className="w-full border-red-200 text-red-500 hover:bg-red-50"
                  >
                    삭제
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pb-6 border-b border-[#efeee7]">
              <Avatar className="w-8 h-8">
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

            <div className="py-6 border-b border-[#efeee7] grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#75786c] mb-1">예산</p>
                <p className="text-sm font-semibold text-[#1b1c18]">
                  {post.budget != null
                    ? `${post.budget.toLocaleString()}원`
                    : "협의 가능"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#75786c] mb-1">웨딩 예정일</p>
                <p className="text-sm font-semibold text-[#1b1c18]">
                  {new Date(post.weddingDate).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>

            <div className="pt-6 text-sm text-[#45483d] leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
              {post.content}
            </div>
          </div>
        ) : null}

        {post && !loading && isAuthor && (
          <div className="bg-white rounded-2xl border border-[#efeee7] p-6 sm:p-8 mt-6">
            <h2 className="font-[var(--font-display)] text-lg font-semibold text-[#1b1c18] mb-4">
              받은 제안서{" "}
              <span className="text-[#4f6231]">({proposals.length}건)</span>
            </h2>
            {proposals.length === 0 ? (
              <p className="text-sm text-[#75786c] text-center py-6">
                아직 받은 제안서가 없습니다.
              </p>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="border border-[#efeee7] rounded-2xl p-5 hover:border-[#c5c8ba] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-[#d3ebac] text-[#4f6231] text-xs font-semibold">
                            {proposal.freelancerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <Link
                          href={`/profile/${proposal.freelancerProfileId}`}
                          className="text-sm font-medium text-[#1b1c18] hover:text-[#4f6231] hover:underline"
                        >
                          {proposal.freelancerName}
                        </Link>
                        <Badge
                          className={`border-0 text-xs ${STATUS_STYLE[proposal.status].className}`}
                        >
                          {STATUS_STYLE[proposal.status].label}
                        </Badge>
                      </div>
                      <span className="text-xs text-[#75786c]">
                        {new Date(proposal.createdAt).toLocaleDateString(
                          "ko-KR",
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-[#45483d] whitespace-pre-wrap break-words mb-4 leading-relaxed line-clamp-3">
                      {proposal.content}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-[#efeee7]">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-xs text-[#75786c]">
                            제안 가격{" "}
                          </span>
                          <span className="text-sm font-semibold text-[#1b1c18]">
                            {proposal.price != null
                              ? `${proposal.price.toLocaleString()}원`
                              : "협의"}
                          </span>
                        </div>
                        {proposal.region && (
                          <div>
                            <span className="text-xs text-[#75786c]">
                              지역{" "}
                            </span>
                            <span className="text-sm text-[#45483d]">
                              {proposal.region}
                            </span>
                          </div>
                        )}
                      </div>
                      {proposal.status === "SUBMITTED" &&
                        post.status === "OPEN" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAcceptProposal(proposal.id)}
                              className="bg-[#4f6231] hover:bg-[#3e4e27] text-white rounded-xl text-xs px-4"
                            >
                              수락
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectProposal(proposal.id)}
                              className="border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-xs px-4"
                            >
                              거절
                            </Button>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {post &&
          !loading &&
          myRole === "FREELANCER" &&
          post.memberId !== myMemberId &&
          post.status === "OPEN" && (
            <div className="bg-white rounded-2xl border border-[#efeee7] p-6 sm:p-8 mt-6">
              <h2 className="font-[var(--font-display)] text-lg font-semibold text-[#1b1c18] mb-1">
                제안서 작성
              </h2>
              <p className="text-xs text-[#75786c] mb-5">
                예비부부에게 나의 서비스를 제안해보세요.
              </p>
              {proposalError && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500 mb-4">
                  {proposalError}
                </p>
              )}
              {proposalSuccess && (
                <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 mb-4">
                  {proposalSuccess}
                </p>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#45483d] mb-1">
                    제안 내용 <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={proposalContent}
                    onChange={(e) => setProposalContent(e.target.value)}
                    placeholder="자기소개와 작업 계획을 작성해주세요"
                    rows={4}
                    className="w-full rounded-xl border border-[#c5c8ba] bg-white px-4 py-3 text-sm text-[#1b1c18] placeholder:text-[#75786c] focus:outline-none focus:ring-2 focus:ring-[#8a9a6e] resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#45483d] mb-1">
                      제안 가격 (원)
                    </label>
                    <input
                      type="number"
                      value={proposalPrice}
                      onChange={(e) => setProposalPrice(e.target.value)}
                      placeholder="협의 가능 시 비워두세요"
                      className="w-full rounded-xl border border-[#c5c8ba] bg-white px-4 py-3 text-sm text-[#1b1c18] placeholder:text-[#75786c] focus:outline-none focus:ring-2 focus:ring-[#8a9a6e]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#45483d] mb-1">
                      활동 지역
                    </label>
                    <input
                      type="text"
                      value={proposalRegion}
                      onChange={(e) => setProposalRegion(e.target.value)}
                      placeholder="예: 서울, 경기"
                      className="w-full rounded-xl border border-[#c5c8ba] bg-white px-4 py-3 text-sm text-[#1b1c18] placeholder:text-[#75786c] focus:outline-none focus:ring-2 focus:ring-[#8a9a6e]"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSubmitProposal}
                  disabled={submitting}
                  className="w-full bg-[#4f6231] hover:bg-[#3e4e27] text-white rounded-xl"
                >
                  {submitting ? "제출 중..." : "제안서 제출"}
                </Button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
