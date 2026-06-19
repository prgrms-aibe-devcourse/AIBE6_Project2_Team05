"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  createReservation,
  fetchFreelancerProfile,
  type FreelancerProfileResponse,
} from "@/lib/reservations";
import { FreelancerCard } from "./_components/FreelancerCard";

export default function ReservePage() {
  const params = useParams();
  const router = useRouter();
  const freelancerId = Number(params.id);

  const [profile, setProfile] = useState<FreelancerProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(freelancerId)) return;

    fetchFreelancerProfile(freelancerId)
      .then(setProfile)
      .catch((err) => {
        console.error(err);
        setErrorMessage("프리랜서 정보를 불러오는데 실패했습니다.");
      })
      .finally(() => setLoading(false));
  }, [freelancerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      alert("예식 날짜를 선택해주세요.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      // ISO 형식으로 날짜와 시간 결합 (예: 2026-06-20T14:00:00)
      const reservationDateTime = `${date}T${time}:00`;
      
      await createReservation({
        freelancerProfileId: freelancerId,
        reservationDate: reservationDateTime,
        requestMessage: notes,
      });

      alert("예약 신청이 완료되었습니다!");
      router.push("/reservations");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "예약 신청 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8">
          <Link
            href={`/profile/${freelancerId}`}
            className="flex items-center gap-1 text-sm text-[#75786c] hover:text-[#45483d] mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            프로필로 돌아가기
          </Link>
          <h1 className="font-[var(--font-display)] text-3xl font-semibold text-[#1b1c18]">
            예약 신청
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="space-y-6">
            <FreelancerCard profile={profile} loading={loading} />

            {/* Form Fields */}
            <div className="bg-white rounded-2xl border border-[#efeee7] p-6 space-y-5">
              <h2 className="font-[var(--font-display)] text-lg font-semibold text-[#1b1c18]">
                예약 정보
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-[#45483d]">
                    예식 날짜
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18] pl-10"
                    />
                    <svg className="w-4 h-4 text-[#75786c] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-[#45483d]">
                    희망 시간
                  </Label>
                  <div className="relative">
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18] pl-10"
                    />
                    <svg className="w-4 h-4 text-[#75786c] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#45483d]">
                  요청사항
                </Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="원하시는 촬영 스타일, 장소, 특별히 담고 싶은 순간 등을 자유롭게 작성해주세요"
                  className="bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18] placeholder:text-[#75786c] resize-none"
                  rows={4}
                />
              </div>

              {errorMessage && (
                <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
              )}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#efeee7] p-6 sticky top-24">
              <h2 className="font-[var(--font-display)] text-lg font-semibold text-[#1b1c18] mb-5">
                예약 요약
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#75786c]">프리랜서</span>
                  <span className="text-[#1b1c18] font-medium">{profile?.memberName || "..."}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#75786c]">카테고리</span>
                  <span className="text-[#1b1c18] font-medium">{profile?.categoryName || "..."}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#75786c]">지역</span>
                  <span className="text-[#1b1c18] font-medium">{profile?.region || "..."}</span>
                </div>
              </div>

              <Separator className="my-4 bg-[#efeee7]" />

              <div className="flex justify-between">
                <span className="font-semibold text-[#1b1c18]">기본 금액</span>
                <span className="font-bold text-[#4f6231] text-lg">
                  {profile?.price ? `₩${profile.price.toLocaleString()}` : "협의"}
                </span>
              </div>

              <Button 
                type="submit"
                disabled={submitting || loading}
                className="w-full h-12 bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl mt-5 font-medium"
              >
                {submitting ? "신청 중..." : "예약 신청하기"}
              </Button>

              <div className="mt-4 p-3 bg-[#f5f4ec] rounded-xl">
                <p className="text-xs text-[#75786c] text-center mb-1">
                  프리랜서가 수락하기 전까지는 결제가 진행되지 않습니다
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#4f6231]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-[#4f6231] font-medium">48시간 이내 무료 취소 가능</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
