"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAccessToken } from "@/lib/auth";

function OAuth2CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const isNew = searchParams.get("isNew") === "true";
  const hasToken = Boolean(accessToken);

  useEffect(() => {
    if (!accessToken) {
      const timer = window.setTimeout(() => {
        router.replace("/login");
      }, 1500);

      return () => window.clearTimeout(timer);
    }

    setAccessToken(accessToken);

    if (isNew) {
      router.replace("/select-role");
    } else {
      router.replace("/mypage");
    }
    router.refresh();
  }, [accessToken, isNew, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbf9f2] px-4 text-center">
      <p className="text-sm text-[#45483d]">
        {hasToken
          ? "소셜 로그인 처리 중입니다..."
          : "토큰 정보를 찾을 수 없습니다. 다시 로그인해주세요."}
      </p>
    </div>
  );
}

export default function OAuth2CallbackPage() {
  return (
    <Suspense fallback={null}>
      <OAuth2CallbackContent />
    </Suspense>
  );
}
