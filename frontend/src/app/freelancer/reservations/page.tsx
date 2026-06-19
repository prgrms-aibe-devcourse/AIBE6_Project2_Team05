"use client";

import { useCallback, useEffect, useState } from "react";
import { createAuthHeaders } from "@/lib/auth";
import {
  fetchReservations,
  ReservationApiError,
  type ReservationResponse,
} from "@/lib/reservations";
import { ReservationList } from "../../reservations/_components/ReservationList";

function getErrorMessage(error: unknown): string {
  if (error instanceof ReservationApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "예약 목록을 불러오지 못했습니다.";
}

export default function FreelancerReservationsPage() {
  const [reservations, setReservations] = useState<readonly ReservationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [reservationData, meRes] = await Promise.all([
        fetchReservations(),
        fetch("/api/v1/members/me", {
          headers: createAuthHeaders(),
        }),
      ]);

      setReservations(reservationData);

      if (meRes.ok) {
        const meData: unknown = await meRes.json();
        if (
          typeof meData === "object" &&
          meData !== null &&
          "role" in meData &&
          typeof meData.role === "string"
        ) {
          setUserRole(meData.role);
        }
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
    <div className="flex min-h-full flex-col bg-[#fbf9f2]">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-2 font-[var(--font-display)] text-3xl font-semibold text-[#1b1c18]">
          예약 관리
        </h1>
        <p className="mb-10 text-[#75786c]">
          로그인한 회원에 연결된 예약만 표시됩니다.
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
    </div>
  );
}
