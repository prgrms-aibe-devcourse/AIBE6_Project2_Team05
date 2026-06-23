"use client";

import { API_BASE_URL, createAuthHeaders } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { JobForm } from "../_components/JobForm";
import {
  getJobWeddingDateValidationMessage,
  getTodayDateString,
} from "../job-date-utils.js";
import type { Category, JobFormValues } from "../job-form-options";
import { resolveJobRegionValue } from "../job-region-utils.js";

const INITIAL_VALUES: JobFormValues = {
  title: "",
  content: "",
  categoryId: "",
  budget: "",
  weddingDate: "",
  selectedRegion: "",
  customRegion: "",
};

export default function JobsWritePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [values, setValues] = useState<JobFormValues>(INITIAL_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const minWeddingDate = getTodayDateString();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then((response) => response.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const updateValue = <K extends keyof JobFormValues>(
    key: K,
    value: JobFormValues[K],
  ) => {
    setValues((previousValues) => ({
      ...previousValues,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const validationMessage = getJobWeddingDateValidationMessage(
      values.weddingDate,
    );
    if (validationMessage !== null) {
      setError(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...createAuthHeaders() },
        body: JSON.stringify({
          title: values.title,
          content: values.content,
          categoryId: Number(values.categoryId),
          budget: values.budget ? Number(values.budget) : null,
          weddingDate: values.weddingDate,
          region:
            resolveJobRegionValue(values.selectedRegion, values.customRegion) ||
            null,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? "구인글 등록에 실패했습니다.");
      }

      await response.json();

      router.push("/mypage/posts");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "구인글 등록에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-[#fbf9f2]">
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/mypage/posts"
          className="mb-8 flex items-center gap-1 text-sm text-[#75786c] hover:text-[#45483d]"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          구인글 목록으로
        </Link>

        <div className="rounded-2xl border border-[#efeee7] bg-white p-6 sm:p-8">
          <h1 className="mb-2 font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18]">
            구인글 작성
          </h1>
          <p className="mb-8 text-sm text-[#75786c]">
            원하는 조건을 등록하면 프리랜서가 직접 제안서를 보내드려요.
          </p>

          <JobForm
            values={values}
            categories={categories}
            error={error}
            isSubmitting={isSubmitting}
            submitLabel="등록하기"
            submittingLabel="등록 중..."
            minWeddingDate={minWeddingDate}
            onChange={updateValue}
            onCancel={() => router.back()}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
