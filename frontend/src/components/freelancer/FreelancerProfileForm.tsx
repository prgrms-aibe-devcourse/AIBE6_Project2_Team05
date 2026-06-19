"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/lib/auth";
import { useEffect, useState } from "react";

export const REGIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "대전",
  "광주",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

export const INDUSTRIES = [
  "헤어메이크업",
  "스냅 사진",
  "보컬리스트",
  "드레스/수트",
  "MC/사회자",
  "하객 알바",
];

export interface ImageDto {
  id: number;
  imageUrl: string;
}

export interface ExistingPortfolio {
  id: number;
  imageUrl: string;
  description: string;
  sortOrder: number;
  startDate?: string;
  endDate?: string;
  client?: string;
  industry?: string;
  purpose?: string;
  images?: ImageDto[];
}

export interface NewPortfolioItem {
  file: File;
  preview: string;
  description: string;
  startDate: string;
  endDate: string;
  client: string;
  industry: string;
  purpose: string;
}

export interface ProfileFormValues {
  categoryId: number | "";
  title: string;
  introduction: string;
  selfIntroduction: string;
  region: string;
  price: string;
  careerYears: string;
}

interface Category {
  id: number;
  name: string;
}

interface FreelancerProfileFormProps {
  mode: "create" | "edit";
  initialValues: ProfileFormValues;
  isSubmitting: boolean;
  errorMessage: string;
  onSubmit: (values: ProfileFormValues) => void;
  onCancel: () => void;
}

export default function FreelancerProfileForm({
  mode,
  initialValues,
  isSubmitting,
  errorMessage,
  onSubmit,
  onCancel,
}: FreelancerProfileFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [values, setValues] = useState<ProfileFormValues>(initialValues);
  const [isHoverSubmit, setIsHoverSubmit] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => console.warn("카테고리 로딩 실패"));
  }, []);

  const updateField = <K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!values.categoryId) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (!values.title.trim()) {
      alert("프로필 제목을 입력해주세요.");
      return;
    }
    if (!values.introduction.trim()) {
      alert("서비스 설명을 입력해주세요.");
      return;
    }
    if (!values.region) {
      alert("활동 지역을 선택해주세요.");
      return;
    }
    if (!values.price) {
      alert("기본 가격을 입력해주세요.");
      return;
    }
    if (!values.careerYears) {
      alert("경력을 입력해주세요.");
      return;
    }
    onSubmit(values);
  };

  return (
    <div className="space-y-5">
      {errorMessage && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
          {errorMessage}
        </p>
      )}

      <div className="bg-white rounded-2xl border border-[#efeee7] p-6 space-y-4">
        <h2 className="font-semibold text-[#1b1c18] text-sm">기본 정보</h2>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#45483d]">
            카테고리 *
          </Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateField("categoryId", cat.id)}
                onMouseEnter={() => setHoveredCategoryId(cat.id)}
                onMouseLeave={() => setHoveredCategoryId(null)}
                style={
                  values.categoryId === cat.id
                    ? {
                        backgroundColor:
                          hoveredCategoryId === cat.id ? "#5a6d3e" : "#6C814C",
                        color: "#ffffff",
                      }
                    : hoveredCategoryId === cat.id
                      ? { borderColor: "#6C814C" }
                      : {}
                }
                className="px-4 py-2 rounded-xl text-sm border border-[#efeee7] transition-colors text-[#45483d]"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-[#45483d]">
            프로필 제목 *
          </Label>
          <Input
            value={values.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="예: 10년 경력 웨딩 헤어메이크업 전문가"
            className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#6C814C] text-[#1b1c18]"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-[#45483d]">
            서비스 설명 *
          </Label>
          <Textarea
            value={values.introduction}
            onChange={(e) => updateField("introduction", e.target.value)}
            placeholder="전문 분야, 스타일, 경력 등을 소개해주세요"
            rows={5}
            className="bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#6C814C] text-[#1b1c18] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-[#45483d]">자기소개</Label>
          <Textarea
            value={values.selfIntroduction}
            onChange={(e) => updateField("selfIntroduction", e.target.value)}
            placeholder="나를 소개하는 한마디를 자유롭게 작성해주세요"
            rows={4}
            className="bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#6C814C] text-[#1b1c18] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-[#45483d]">
            활동 지역 *
          </Label>
          <select
            value={values.region}
            onChange={(e) => updateField("region", e.target.value)}
            className="w-full h-11 px-3 rounded-xl bg-[#f5f4ec] border border-[#efeee7] text-sm text-[#1b1c18] focus:outline-none focus:ring-2 focus:ring-[#6C814C]"
          >
            <option value="">지역 선택</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[#45483d]">
              기본 가격 (원) *
            </Label>
            <Input
              type="number"
              value={values.price}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="예: 300000"
              min={0}
              className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#6C814C] text-[#1b1c18]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[#45483d]">
              경력 (년) *
            </Label>
            <Input
              type="number"
              value={values.careerYears}
              onChange={(e) => updateField("careerYears", e.target.value)}
              placeholder="예: 5"
              min={0}
              className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#6C814C] text-[#1b1c18]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-[#c5c8ba] text-[#45483d] rounded-xl"
        >
          취소
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            backgroundColor: isHoverSubmit ? "#5a6d3e" : "#6C814C",
            color: "#ffffff",
          }}
          className="rounded-xl px-8"
          onMouseEnter={() => setIsHoverSubmit(true)}
          onMouseLeave={() => setIsHoverSubmit(false)}
        >
          {isSubmitting
            ? mode === "create"
              ? "등록 중..."
              : "저장 중..."
            : mode === "create"
              ? "프로필 등록"
              : "저장하기"}
        </Button>
      </div>
    </div>
  );
}
