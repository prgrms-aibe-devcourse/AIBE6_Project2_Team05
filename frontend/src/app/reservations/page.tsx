"use client";

import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

  const loadReservations = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setReservations(await fetchReservations());
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    void fetchReservations()
      .then((response) => {
        if (isActive) {
          setReservations(response);
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setErrorMessage(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-[var(--font-display)] text-3xl font-semibold text-[#1b1c18] mb-2">
          예약 내역
        </h1>
        <p className="text-sm text-[#75786c] mb-8">
          요청하신 웨딩 전문가 예약 현황을 확인하세요
        </p>

        <ReservationList
          reservations={reservations}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onRetry={() => void loadReservations()}
        />
      </div>

      <Footer />
    </div>
  );
}
