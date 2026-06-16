"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/lib/auth";
import { useEffect, useRef, useState } from "react";

export const REGIONS = [
  "서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산",
  "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
];

export interface ExistingPortfolio {
  id: number;
  imageUrl: string;
  description: string;
  sortOrder: number;
}

export interface NewPortfolioItem {
  file: File;
  preview: string;
  description: string;
}

export interface ProfileFormValues {
  categoryId: number | "";
  title: string;
  introduction: string;
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
  existingPortfolios?: ExistingPortfolio[];
  isSubmitting: boolean;
  errorMessage: string;
  onSubmit: (
    values: ProfileFormValues,
    newPortfolios: NewPortfolioItem[],
    deletedPortfolioIds: number[],
  ) => void;
  onCancel: () => void;
}

export default function FreelancerProfileForm({
  mode,
  initialValues,
  existingPortfolios = [],
  isSubmitting,
  errorMessage,
  onSubmit,
  onCancel,
}: FreelancerProfileFormProps) {
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [values, setValues] = useState<ProfileFormValues>(initialValues);
  const [currentExisting, setCurrentExisting] = useState<ExistingPortfolio[]>(existingPortfolios);
  const [deletedPortfolioIds, setDeletedPortfolioIds] = useState<number[]>([]);
  const [newPortfolios, setNewPortfolios] = useState<NewPortfolioItem[]>([]);
  const [isHoverSubmit, setIsHoverSubmit] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(null);

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

  const handlePortfolioAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newItems: NewPortfolioItem[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      description: "",
    }));
    setNewPortfolios((prev) => [...prev, ...newItems]);
    e.target.value = "";
  };

  const handleNewPortfolioDescChange = (index: number, value: string) => {
    setNewPortfolios((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, description: value } : item,
      ),
    );
  };

  const handleNewPortfolioRemove = (index: number) => {
    setNewPortfolios((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleExistingPortfolioDelete = (portfolioId: number) => {
    setDeletedPortfolioIds((prev) => [...prev, portfolioId]);
    setCurrentExisting((prev) => prev.filter((p) => p.id !== portfolioId));
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
      alert("자기소개를 입력해주세요.");
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
    onSubmit(values, newPortfolios, deletedPortfolioIds);
  };

  const hasPortfolios = currentExisting.length > 0 || newPortfolios.length > 0;

  return (
    <div className="space-y-5">
      {errorMessage && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
          {errorMessage}
        </p>
      )}

      {/* 기본 정보 */}
      <div className="bg-white rounded-2xl border border-[#efeee7] p-6 space-y-5">
        <h2 className="font-semibold text-[#1b1c18] text-sm">기본 정보</h2>

        {/* 카테고리 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#45483d]">카테고리 *</Label>
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
                    ? { backgroundColor: hoveredCategoryId === cat.id ? "#5a6d3e" : "#6C814C", color: "#ffffff" }
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

        {/* 제목 */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-[#45483d]">프로필 제목 *</Label>
          <Input
            value={values.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="예: 10년 경력 웨딩 헤어메이크업 전문가"
            className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#6C814C] text-[#1b1c18]"
          />
        </div>

        {/* 소개 */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-[#45483d]">자기소개 *</Label>
          <Textarea
            value={values.introduction}
            onChange={(e) => updateField("introduction", e.target.value)}
            placeholder="전문 분야, 스타일, 경력 등을 소개해주세요"
            rows={5}
            className="bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#6C814C] text-[#1b1c18] resize-none"
          />
        </div>

        {/* 지역 */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-[#45483d]">활동 지역 *</Label>
          <select
            value={values.region}
            onChange={(e) => updateField("region", e.target.value)}
            className="w-full h-11 px-3 rounded-xl bg-[#f5f4ec] border border-[#efeee7] text-sm text-[#1b1c18] focus:outline-none focus:ring-2 focus:ring-[#6C814C]"
          >
            <option value="">지역 선택</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* 가격 / 경력 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[#45483d]">기본 가격 (원) *</Label>
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
            <Label className="text-sm font-medium text-[#45483d]">경력 (년) *</Label>
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

      {/* 포트폴리오 */}
      <div className="bg-white rounded-2xl border border-[#efeee7] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#1b1c18] text-sm">포트폴리오 이미지</h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => portfolioInputRef.current?.click()}
            className="border-[#6C814C] text-[#6C814C] hover:bg-[#f5f4ec] rounded-xl text-xs"
          >
            + 이미지 추가
          </Button>
        </div>
        <p className="text-xs text-[#75786c]">JPG, PNG, WebP · 10MB 이하 · 최대 10장</p>

        <input
          ref={portfolioInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePortfolioAdd}
        />

        {!hasPortfolios ? (
          <button
            type="button"
            onClick={() => portfolioInputRef.current?.click()}
            className="w-full h-40 border-2 border-dashed border-[#efeee7] rounded-xl flex flex-col items-center justify-center gap-2 text-[#75786c] hover:border-[#6C814C] transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">클릭하여 이미지를 업로드하세요</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {currentExisting.map((item) => (
              <div key={`existing-${item.id}`} className="space-y-2">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#f5f4ec]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.description || "포트폴리오"} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleExistingPortfolioDelete(item.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center text-xs hover:bg-black/70"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-[#75786c] truncate px-1">{item.description || "설명 없음"}</p>
              </div>
            ))}
            {newPortfolios.map((item, index) => (
              <div key={`new-${index}`} className="space-y-2">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#f5f4ec]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.preview} alt={`새 포트폴리오 ${index + 1}`} className="w-full h-full object-cover" />
                  {mode === "edit" && (
                    <div className="absolute top-2 left-2 bg-[#6C814C] text-white text-xs px-2 py-0.5 rounded-full">NEW</div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleNewPortfolioRemove(index)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center text-xs hover:bg-black/70"
                  >
                    ✕
                  </button>
                </div>
                <Input
                  value={item.description}
                  onChange={(e) => handleNewPortfolioDescChange(index, e.target.value)}
                  placeholder="설명 (선택)"
                  className="h-9 text-xs bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#6C814C]"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 버튼 */}
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
            ? mode === "create" ? "등록 중..." : "저장 중..."
            : mode === "create" ? "프로필 등록" : "저장하기"}
        </Button>
      </div>
    </div>
  );
}