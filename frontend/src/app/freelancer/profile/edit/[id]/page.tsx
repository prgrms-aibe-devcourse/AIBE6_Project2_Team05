"use client";

import Footer from "@/components/Footer";
import FreelancerProfileForm, {
  ExistingPortfolio,
  NewPortfolioItem,
  ProfileFormValues,
} from "@/components/freelancer/FreelancerProfileForm";
import Navbar from "@/components/Navbar";
import { API_BASE_URL, getAccessToken } from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FreelancerProfileEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [initialValues, setInitialValues] = useState<ProfileFormValues | null>(
    null,
  );
  const [existingPortfolios, setExistingPortfolios] = useState<
    ExistingPortfolio[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!getAccessToken()) {
      router.push(`/login?redirect=/freelancer/profile/edit/${id}`);
      return;
    }

    const fetchProfile = async () => {
      try {
        const [profileRes, portfolioRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/freelancers/${id}`),
          authFetch(`${API_BASE_URL}/api/freelancers/${id}/portfolios`),
        ]);

        if (!profileRes.ok) throw new Error("프로필을 불러올 수 없습니다.");

        const profileData = await profileRes.json();
        setInitialValues({
          categoryId: profileData.categoryId,
          title: profileData.title ?? "",
          introduction: profileData.introduction ?? "",
          region: profileData.region ?? "",
          price: String(profileData.price ?? ""),
          careerYears: String(profileData.careerYears ?? ""),
        });

        if (portfolioRes.ok) {
          setExistingPortfolios(await portfolioRes.json());
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "프로필을 불러올 수 없습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProfile();
  }, [id, router]);

  const handleSubmit = async (
    values: ProfileFormValues,
    newPortfolios: NewPortfolioItem[],
    deletedPortfolioIds: number[],
  ) => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const profileRes = await authFetch(
        `${API_BASE_URL}/api/freelancers/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryId: Number(values.categoryId),
            title: values.title.trim(),
            introduction: values.introduction.trim(),
            region: values.region,
            price: Number(values.price),
            careerYears: Number(values.careerYears),
          }),
        },
      );

      if (!profileRes.ok) {
        const data = await profileRes.json().catch(() => null);
        throw new Error(data?.message ?? "프로필 수정에 실패했습니다.");
      }

      for (const portfolioId of deletedPortfolioIds) {
        await authFetch(
          `${API_BASE_URL}/api/freelancers/${id}/portfolios/${portfolioId}`,
          { method: "DELETE" },
        ).catch(() => console.warn(`포트폴리오 ${portfolioId} 삭제 실패`));
      }

      const startOrder = existingPortfolios.length - deletedPortfolioIds.length;
      for (let i = 0; i < newPortfolios.length; i++) {
        const item = newPortfolios[i];
        const formData = new FormData();
        formData.append("image", item.file);
        if (item.description) formData.append("description", item.description);
        formData.append("sortOrder", String(startOrder + i));

        await authFetch(`${API_BASE_URL}/api/freelancers/${id}/portfolios`, {
          method: "POST",
          body: formData,
        }).catch(() => {
          console.warn(`포트폴리오 ${i + 1} 업로드 실패`);
          setErrorMessage(
            `포트폴리오 ${i + 1}번 이미지 업로드에 실패했습니다. 수정 페이지에서 다시 시도해주세요.`,
          );
        });
      }

      router.push(`/profile/${id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "프로필 수정에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf9f2] text-[#45483d]">
        프로필을 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-2xl font-semibold text-[#1b1c18] mb-8">
          프리랜서 프로필 수정
        </h1>
        {initialValues && (
          <FreelancerProfileForm
            mode="edit"
            initialValues={initialValues}
            existingPortfolios={existingPortfolios}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/profile/${id}`)}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
