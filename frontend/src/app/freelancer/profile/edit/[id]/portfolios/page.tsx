"use client";

import { getAccessToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FreelancerPortfolioEditPage() {
  const router = useRouter();

  useEffect(() => {
    const target = "/mypage?tab=portfolio";
    if (!getAccessToken()) {
      router.replace(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }
    router.replace(target);
  }, [router]);

  return null;
}
