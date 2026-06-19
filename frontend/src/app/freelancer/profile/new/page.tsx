"use client";

import FreelancerProfileForm, {
  NewPortfolioItem,
  ProfileFormValues,
} from "@/components/freelancer/FreelancerProfileForm";
import { useUser } from "@/contexts/UserContext";
import { API_BASE_URL, getAccessToken } from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EMPTY_VALUES: ProfileFormValues = {
  categoryId: "",
  title: "",
  introduction: "",
  selfIntroduction: "",
  region: "",
  price: "",
  careerYears: "",
};

export default function FreelancerProfileNewPage() {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!getAccessToken()) {
      router.push("/login?redirect=/freelancer/profile/manage");
      return;
    }

    const checkExistingProfile = async () => {
      try {
        const res = await authFetch(`${API_BASE_URL}/api/freelancers/me`);
        if (res.ok) {
          const data = await res.json();
          router.replace(`/freelancer/profile/edit/${data.id}`);
        }
      } catch {}
    };

    void checkExistingProfile();
  }, [router]);

  const handleSubmit = async (
    values: ProfileFormValues,
    newPortfolios: NewPortfolioItem[] = [],
  ) => {
    setErrorMessage("");

    setIsSubmitting(true);

    try {
      const profileRes = await authFetch(
        `${API_BASE_URL}/api/freelancers/profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryId: Number(values.categoryId),
            title: values.title.trim(),
            introduction: values.introduction.trim(),
            selfIntroduction: values.selfIntroduction.trim(),
            region: values.region,
            price: Number(values.price),
            careerYears: Number(values.careerYears),
          }),
        },
      );

      if (!profileRes.ok) {
        const data = await profileRes.json().catch(() => null);
        throw new Error(data?.message ?? "프로필 등록에 실패했습니다.");
      }

      const profileData = await profileRes.json();
      const profileId: number = profileData.id;

      for (let i = 0; i < newPortfolios.length; i++) {
        const item = newPortfolios[i];
        const formData = new FormData();
        formData.append("image", item.file);
        if (item.description) formData.append("description", item.description);
        formData.append("sortOrder", String(i));
        if (item.startDate) formData.append("startDate", item.startDate);
        if (item.endDate) formData.append("endDate", item.endDate);
        if (item.client) formData.append("client", item.client);
        if (item.industry) formData.append("industry", item.industry);
        if (item.purpose) formData.append("purpose", item.purpose);

        await authFetch(
          `${API_BASE_URL}/api/freelancers/${profileId}/portfolios`,
          {
            method: "POST",
            body: formData,
          },
        ).catch(() => {
          console.warn(`포트폴리오 ${i + 1} 업로드 실패`);
          setErrorMessage(
            `포트폴리오 ${i + 1}번 이미지 업로드에 실패했습니다. 수정 페이지에서 다시 시도해주세요.`,
          );
        });
      }

      await refreshUser();
      router.push(`/profile/${profileId}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "프로필 등록에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#fbf9f2]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-2xl font-semibold text-[#1b1c18] mb-8">
          프리랜서 프로필 등록
        </h1>
        <FreelancerProfileForm
          mode="create"
          initialValues={EMPTY_VALUES}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
