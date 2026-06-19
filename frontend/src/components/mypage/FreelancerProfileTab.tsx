"use client";

import { API_BASE_URL } from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";
import { useState } from "react";

import FreelancerProfileForm, {
  ProfileFormValues,
} from "@/components/freelancer/FreelancerProfileForm";

interface FreelancerProfileTabProps {
  freelancerProfileId: number;
  initialValues: ProfileFormValues;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function FreelancerProfileTab({
  freelancerProfileId,
  initialValues,
  onSuccess,
  onCancel,
}: FreelancerProfileTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (values: ProfileFormValues) => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/freelancers/${freelancerProfileId}`,
        {
          method: "PUT",
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
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "프로필 수정에 실패했습니다.");
      }
      onSuccess();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "프로필 수정에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18]">
        프리랜서 프로필 수정
      </h1>
      <FreelancerProfileForm
        mode="edit"
        initialValues={initialValues}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </>
  );
}
