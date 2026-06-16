"use client";

import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createAuthHeaders } from "@/lib/auth";
import {
  fetchReservations,
  ReservationApiError,
  type ReservationResponse,
} from "@/lib/reservations";
import { ReservationList } from "./_components/ReservationList";

function getErrorMessage(error: unknown): string {
  if (error instanceof ReservationApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "예약 목록을 불러오지 못했습니다.";
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<readonly ReservationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [resData, meRes] = await Promise.all([
        fetchReservations(),
        fetch("/api/v1/members/me", {
          headers: createAuthHeaders(),
        }),
      ]);

      setReservations(resData);
      if (meRes.ok) {
        const meData = await meRes.json();
        setUserRole(meData.role);
      }
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <h1 className="font-[var(--font-display)] text-3xl font-semibold text-[#1b1c18] mb-2">
          {userRole === "FREELANCER" ? "예약 관리" : "내 예약 현황"}
        </h1>
        <p className="text-[#75786c] mb-10">
          {userRole === "FREELANCER"
            ? "고객님들이 요청하신 예약 현황을 관리하세요"
            : "요청하신 웨딩 전문가 예약 현황을 확인하세요"}
        </p>

        <ReservationList
          reservations={reservations}
          isLoading={isLoading}
          errorMessage={errorMessage}
          userRole={userRole}
          onRetry={() => void loadData()}
          onRefresh={() => void loadData()}
        />
      </div>

      <Footer />
    </div>
  );
}
