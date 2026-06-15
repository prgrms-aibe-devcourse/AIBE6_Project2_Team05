"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthTokens } from "@/lib/auth";

export default function OAuth2CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const hasTokens = Boolean(accessToken && refreshToken);

  useEffect(() => {
    if (!hasTokens || !accessToken || !refreshToken) {
      const timer = window.setTimeout(() => {
        router.replace("/login");
      }, 1500);

      return () => window.clearTimeout(timer);
    }

    setAuthTokens(accessToken, refreshToken);
    router.replace("/mypage");
    router.refresh();
  }, [accessToken, hasTokens, refreshToken, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbf9f2] px-4 text-center">
      <p className="text-sm text-[#45483d]">
        {hasTokens
          ? "소셜 로그인 처리 중입니다..."
          : "토큰 정보를 찾을 수 없습니다. 다시 로그인해주세요."}
      </p>
    </div>
  );
}
