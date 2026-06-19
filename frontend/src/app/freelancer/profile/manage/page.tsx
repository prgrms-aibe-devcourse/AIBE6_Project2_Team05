"use client";

import { API_BASE_URL, getAccessToken } from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FreelancerProfileManagePage() {
  const router = useRouter();

  useEffect(() => {
    if (!getAccessToken()) {
      router.push("/login?redirect=/freelancer/profile/manage");
      return;
    }

    const checkProfile = async () => {
      try {
        const res = await authFetch(`${API_BASE_URL}/api/freelancers/me`);
        if (res.ok) {
          const data = await res.json();
          router.replace(`/freelancer/profile/edit/${data.id}`);
        } else {
          router.replace("/freelancer/profile/new");
        }
      } catch {
        router.replace("/freelancer/profile/new");
      }
    };

    void checkProfile();
  }, [router]);

  return (
    <div className="flex min-h-full items-center justify-center bg-[#fbf9f2] text-[#45483d]">
      프로필 확인 중...
    </div>
  );
}
