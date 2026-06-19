"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { API_BASE_URL, getAccessToken } from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";

type RoleOption = "CLIENT" | "FREELANCER";

export default function SelectRolePage() {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [selected, setSelected] = useState<RoleOption | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!getAccessToken()) {
    router.replace("/login");
    return null;
  }

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/v1/members/me/role?role=${selected}`, {
        method: "PATCH",
      });
      if (res.ok) {
        await refreshUser();
        router.replace("/mypage");
        router.refresh();
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#fbf9f2]">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-[#efeee7] p-8 sm:p-12 max-w-md w-full text-center">
          <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18] mb-2">
            회원 유형 선택
          </h1>
          <p className="text-sm text-[#75786c] mb-8">어떤 목적으로 Wedge를 이용하시나요?</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setSelected("CLIENT")}
              className={`rounded-xl border-2 p-6 transition-all ${
                selected === "CLIENT"
                  ? "border-[#4f6231] bg-[#f0f5e8]"
                  : "border-[#efeee7] hover:border-[#c5c8ba]"
              }`}
            >
              <div className="text-3xl mb-3">💍</div>
              <p className="font-semibold text-[#1b1c18] text-sm">예비부부</p>
              <p className="text-xs text-[#75786c] mt-1">웨딩 프리랜서를 찾고 있어요</p>
            </button>

            <button
              onClick={() => setSelected("FREELANCER")}
              className={`rounded-xl border-2 p-6 transition-all ${
                selected === "FREELANCER"
                  ? "border-[#4f6231] bg-[#f0f5e8]"
                  : "border-[#efeee7] hover:border-[#c5c8ba]"
              }`}
            >
              <div className="text-3xl mb-3">🎨</div>
              <p className="font-semibold text-[#1b1c18] text-sm">프리랜서</p>
              <p className="text-xs text-[#75786c] mt-1">웨딩 서비스를 제공해요</p>
            </button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!selected || submitting}
            className="w-full bg-[#4f6231] hover:bg-[#3e4e27] text-white rounded-xl h-11"
          >
            {submitting ? "설정 중..." : "시작하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
