"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { createChatRoom } from "@/lib/chat";
import {
  acceptReservation,
  cancelReservation,
  completeReservation,
  fetchReservationById,
  rejectReservation,
  type ReservationResponse,
} from "@/lib/reservations";
import { formatReservationDate, reservationStatusView } from "../reservationView";
import { createAuthHeaders } from "@/lib/auth";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const reservationId = Number(id);

  const [reservation, setReservation] = useState<ReservationResponse | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [chatStarting, setChatStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [resData, meRes] = await Promise.all([
        fetchReservationById(reservationId),
        fetch("/api/v1/members/me", {
          headers: createAuthHeaders(),
        }),
      ]);

      setReservation(resData);
      if (meRes.ok) {
        const meData = await meRes.json();
        setUserRole(meData.role);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, "정보를 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  }, [reservationId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const handleStatusChange = async (
    action: (id: number) => Promise<unknown>,
    label: string
  ) => {
    if (!confirm(`예약을 ${label}하시겠습니까?`)) return;
    setUpdating(true);
    try {
      await action(reservationId);
      await loadData();
    } catch (err: unknown) {
      alert(getErrorMessage(err, "처리에 실패했습니다."));
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenChat = async () => {
    setChatStarting(true);
    try {
      const chatRoom = await createChatRoom({ reservationId });
      router.push(`/chat/${chatRoom.id}`);
    } catch (err: unknown) {
      alert(getErrorMessage(err, "채팅방을 열지 못했습니다."));
    } finally {
      setChatStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#75786c]">정보를 불러오는 중입니다...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-red-500 mb-4">{error || "예약을 찾을 수 없습니다."}</p>
          <Button onClick={() => router.back()}>뒤로 가기</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const status = reservationStatusView[reservation.status];
  const isFreelancer = userRole === "FREELANCER";

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-[#75786c] hover:text-[#45483d] mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            목록으로 돌아가기
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="font-[var(--font-display)] text-3xl font-semibold text-[#1b1c18]">
              예약 상세 정보
            </h1>
            <Badge className={`${status.color} border-0 text-sm px-3 py-1`}>
              {status.label}
            </Badge>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#efeee7] shadow-sm overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Participant Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-xs text-[#75786c] uppercase tracking-wider">신청인 (고객)</p>
                <p className="text-lg font-semibold text-[#1b1c18]">{reservation.clientName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#75786c] uppercase tracking-wider">웨딩 전문가</p>
                <Link href={`/profile/${reservation.freelancerProfileId}`} className="text-lg font-semibold text-[#4f6231] hover:underline">
                  {reservation.freelancerName}
                </Link>
                <p className="text-sm text-[#75786c]">{reservation.freelancerTitle}</p>
              </div>
            </div>

            <Separator className="bg-[#efeee7]" />

            {/* Schedule Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#f5f4ec] rounded-lg">
                  <svg className="w-5 h-5 text-[#4f6231]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#45483d]">예약 일시</p>
                  <p className="text-[#1b1c18]">{formatReservationDate(reservation.reservationDate)}</p>
                </div>
              </div>
            </div>

            {/* Request Message */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#45483d]">요청사항 및 메시지</p>
              <div className="bg-[#fbf9f2] rounded-2xl p-5 border border-[#efeee7]">
                <p className="text-sm text-[#45483d] whitespace-pre-wrap leading-relaxed">
                  {reservation.requestMessage || "요청사항이 없습니다."}
                </p>
              </div>
            </div>

            {reservation.cancelReason && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-600">취소 사유</p>
                <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                  <p className="text-sm text-red-700 whitespace-pre-wrap leading-relaxed">
                    {reservation.cancelReason}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-[#f5f4ec] px-8 py-6 flex flex-wrap gap-3 justify-end">
            <Button
              disabled={updating || chatStarting}
              className="bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl px-8"
              onClick={handleOpenChat}
            >
              {chatStarting ? "채팅방 여는 중..." : "실시간 채팅하기"}
            </Button>

            {!isFreelancer && (reservation.status === "REQUESTED" || reservation.status === "ACCEPTED") && (
              <Button
                variant="outline"
                disabled={updating}
                className="bg-white border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                onClick={() => handleStatusChange(cancelReservation, "취소")}
              >
                예약 취소하기
              </Button>
            )}

            {isFreelancer && reservation.status === "REQUESTED" && (
              <>
                <Button
                  disabled={updating}
                  className="bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl px-8"
                  onClick={() => handleStatusChange(acceptReservation, "수락")}
                >
                  수락하기
                </Button>
                <Button
                  variant="outline"
                  disabled={updating}
                  className="bg-white border-red-200 text-red-600 hover:bg-red-50 rounded-xl px-8"
                  onClick={() => handleStatusChange(rejectReservation, "거절")}
                >
                  거절하기
                </Button>
              </>
            )}

            {isFreelancer && reservation.status === "ACCEPTED" && (
              <Button
                disabled={updating}
                className="bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl px-8"
                onClick={() => handleStatusChange(completeReservation, "완료")}
              >
                완료 처리
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-[#75786c]">
            예약 생성일: {new Date(reservation.createdAt).toLocaleString("ko-KR")}
            {reservation.updatedAt !== reservation.createdAt && 
              ` | 최종 수정일: ${new Date(reservation.updatedAt).toLocaleString("ko-KR")}`}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
