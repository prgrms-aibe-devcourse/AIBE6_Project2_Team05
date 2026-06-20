"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ReservationResponse } from "@/lib/reservations";
import { ReservationCard } from "./ReservationCard";
import { reservationStatusView } from "../reservationView";

const reservationTabs = [
  { value: "all", label: "전체" },
  { value: "pending", label: "대기 중" },
  { value: "confirmed", label: "확정됨" },
  { value: "completed", label: "완료됨" },
  { value: "cancelled", label: "취소됨" },
] as const;

type ReservationListProps = {
  readonly reservations: readonly ReservationResponse[];
  readonly profileImageUrls: Readonly<Record<number, string | null>>;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly userRole: string | null;
  readonly onRetry: () => void;
  readonly onRefresh: () => void;
};

export function ReservationList({
  reservations,
  profileImageUrls,
  isLoading,
  errorMessage,
  userRole,
  onRetry,
  onRefresh,
}: ReservationListProps) {
  const [activeTab, setActiveTab] = useState("all");
  const filteredReservations = reservations.filter((reservation) => {
    if (activeTab === "all") return true;
    return reservationStatusView[reservation.status].tab === activeTab;
  });

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="bg-[#f5f4ec] rounded-xl p-1 h-auto gap-1 mb-8">
        {reservationTabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="px-4 py-2 text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#4f6231] data-[state=active]:shadow-sm text-[#75786c]"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={activeTab} className="mt-0 min-h-[50vh]">
        {isLoading ? (
          <div className="text-center py-20 text-sm text-[#75786c]">
            예약 목록을 불러오는 중입니다.
          </div>
        ) : errorMessage ? (
          <div className="text-center py-20">
            <p className="text-sm text-[#6f5a55] mb-4">{errorMessage}</p>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={onRetry}
            >
              다시 시도
            </Button>
          </div>
        ) : filteredReservations.length > 0 ? (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                profileImageUrl={
                  profileImageUrls[reservation.freelancerProfileId] ?? null
                }
                userRole={userRole}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#f5f4ec] flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#75786c]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-[#75786c] text-sm">해당하는 예약이 없습니다</p>
            <Link
              href="/search"
              className={cn(
                buttonVariants(),
                "mt-4 bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl",
              )}
            >
              전문가 찾기
            </Link>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
