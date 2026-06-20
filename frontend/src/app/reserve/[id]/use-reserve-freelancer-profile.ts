"use client";

import { useEffect, useState } from "react";

import {
  fetchFreelancerProfile,
  type FreelancerProfileResponse,
} from "@/lib/reservations";

type UseReserveFreelancerProfileResult = {
  readonly profile: FreelancerProfileResponse | null;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
};

export function useReserveFreelancerProfile(
  freelancerId: number,
): UseReserveFreelancerProfileResult {
  const [profile, setProfile] = useState<FreelancerProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(freelancerId)) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    fetchFreelancerProfile(freelancerId)
      .then(setProfile)
      .catch((error: unknown) => {
        console.error(error);
        setErrorMessage("프리랜서 정보를 불러오는데 실패했습니다.");
      })
      .finally(() => setIsLoading(false));
  }, [freelancerId]);

  return {
    profile,
    isLoading,
    errorMessage,
  };
}
