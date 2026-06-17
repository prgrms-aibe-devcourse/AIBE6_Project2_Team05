"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";
import { useEffect, useRef, useState } from "react";

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
  images?: string[];
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
  region: string;
  price: string;
  careerYears: string;
}

interface Category {
  id: number;
  name: string;
}

interface EditingPortfolio {
  id: number;
  description: string;
  startDate: string;
  endDate: string;
  client: string;
  industry: string;
  purpose: string;
  newImages: { file: File; preview: string }[];
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

const CalendarIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-[#75786c] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

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
  const editImageInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [values, setValues] = useState<ProfileFormValues>(initialValues);
  const [currentExisting, setCurrentExisting] =
    useState<ExistingPortfolio[]>(existingPortfolios);
  const [deletedPortfolioIds, setDeletedPortfolioIds] = useState<number[]>([]);
  const [newPortfolios, setNewPortfolios] = useState<NewPortfolioItem[]>([]);
  const [isHoverSubmit, setIsHoverSubmit] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(
    null,
  );
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingPortfolio, setEditingPortfolio] =
    useState<EditingPortfolio | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

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
      startDate: "",
      endDate: "",
      client: "",
      industry: "",
      purpose: "",
    }));
    setNewPortfolios((prev) => [...prev, ...newItems]);
    e.target.value = "";
  };

  const updateNewPortfolio = (
    index: number,
    key: keyof NewPortfolioItem,
    value: string,
  ) => {
    setNewPortfolios((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
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
    if (editingPortfolio?.id === portfolioId) setEditingPortfolio(null);
  };

  const handleEditStart = (item: ExistingPortfolio) => {
    setEditingPortfolio({
      id: item.id,
      description: item.description || "",
      startDate: item.startDate || "",
      endDate: item.endDate || "",
      client: item.client || "",
      industry: item.industry || "",
      purpose: item.purpose || "",
      newImages: [],
    });
  };

  const handleEditImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newImgs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setEditingPortfolio((prev) =>
      prev ? { ...prev, newImages: [...prev.newImages, ...newImgs] } : prev,
    );
    e.target.value = "";
  };

  const handleEditImageRemove = (index: number) => {
    setEditingPortfolio((prev) => {
      if (!prev) return prev;
      URL.revokeObjectURL(prev.newImages[index].preview);
      return {
        ...prev,
        newImages: prev.newImages.filter((_, i) => i !== index),
      };
    });
  };

  const handleEditSave = async () => {
    if (!editingPortfolio) return;
    setIsSavingEdit(true);
    try {
      const formData = new FormData();
      if (editingPortfolio.description)
        formData.append("description", editingPortfolio.description);
      if (editingPortfolio.startDate)
        formData.append("startDate", editingPortfolio.startDate);
      if (editingPortfolio.endDate)
        formData.append("endDate", editingPortfolio.endDate);
      if (editingPortfolio.client)
        formData.append("client", editingPortfolio.client);
      if (editingPortfolio.industry)
        formData.append("industry", editingPortfolio.industry);
      if (editingPortfolio.purpose)
        formData.append("purpose", editingPortfolio.purpose);

      await authFetch(
        `${API_BASE_URL}/api/freelancers/me/portfolios/${editingPortfolio.id}`,
        { method: "PATCH", body: formData },
      ).catch(() => console.warn("포트폴리오 수정 실패"));

      for (const img of editingPortfolio.newImages) {
        const imgFormData = new FormData();
        imgFormData.append("image", img.file);
        await authFetch(
          `${API_BASE_URL}/api/freelancers/me/portfolios/${editingPortfolio.id}/images`,
          { method: "POST", body: imgFormData },
        ).catch(() => console.warn("추가 이미지 업로드 실패"));
      }

      setCurrentExisting((prev) =>
        prev.map((p) =>
          p.id === editingPortfolio.id
            ? {
                ...p,
                description: editingPortfolio.description,
                startDate: editingPortfolio.startDate,
                endDate: editingPortfolio.endDate,
                client: editingPortfolio.client,
                industry: editingPortfolio.industry,
                purpose: editingPortfolio.purpose,
              }
            : p,
        ),
      );
      setEditingPortfolio(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingEdit(false);
    }
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
            자기소개 *
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

      {/* 포트폴리오 */}
      <div className="bg-white rounded-2xl border border-[#efeee7] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#1b1c18] text-sm">포트폴리오</h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => portfolioInputRef.current?.click()}
            className="border-[#6C814C] text-[#6C814C] hover:bg-[#f5f4ec] rounded-xl text-xs"
          >
            + 포트폴리오 추가
          </Button>
        </div>
        <p className="text-xs text-[#75786c]">
          JPG, PNG, WebP · 10MB 이하 · 최대 10장
        </p>

        <input
          ref={portfolioInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePortfolioAdd}
        />
        <input
          ref={editImageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleEditImageAdd}
        />

        {!hasPortfolios ? (
          <button
            type="button"
            onClick={() => portfolioInputRef.current?.click()}
            className="w-full h-40 border-2 border-dashed border-[#efeee7] rounded-xl flex flex-col items-center justify-center gap-2 text-[#75786c] hover:border-[#6C814C] transition-colors"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">클릭하여 이미지를 업로드하세요</span>
          </button>
        ) : (
          <div className="flex flex-col gap-4">
            {/* 기존 포트폴리오 */}
            {currentExisting.map((item) => (
              <div key={`existing-${item.id}`}>
                <div className="border border-[#efeee7] rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 p-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.description || "포트폴리오"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1b1c18] truncate">
                        {item.description || "설명 없음"}
                      </p>
                      {item.client && (
                        <p className="text-xs text-[#75786c]">
                          클라이언트: {item.client}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          editingPortfolio?.id === item.id
                            ? setEditingPortfolio(null)
                            : handleEditStart(item)
                        }
                        className="w-7 h-7 rounded-full bg-[#f5f4ec] text-[#4f6231] flex items-center justify-center text-xs hover:bg-[#e8f5d0] transition-colors"
                        title="수정"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExistingPortfolioDelete(item.id)}
                        className="w-7 h-7 rounded-full bg-red-50 text-red-400 flex items-center justify-center text-xs hover:bg-red-100 transition-colors"
                        title="삭제"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* 수정 패널 */}
                  {editingPortfolio?.id === item.id && (
                    <div className="border-t border-[#efeee7] p-4 space-y-3 bg-[#fafaf8]">
                      <div className="space-y-1">
                        <Label className="text-xs text-[#75786c]">
                          제목 / 설명 #해시태그
                        </Label>
                        <Input
                          value={editingPortfolio.description}
                          onChange={(e) =>
                            setEditingPortfolio((prev) =>
                              prev
                                ? { ...prev, description: e.target.value }
                                : prev,
                            )
                          }
                          placeholder="프로젝트 제목 #해시태그"
                          className="h-9 text-xs bg-white border-[#efeee7] focus-visible:ring-[#6C814C]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-[#75786c]">
                            시작일
                          </Label>
                          <div className="relative">
                            <input
                              type="date"
                              value={editingPortfolio.startDate}
                              onChange={(e) =>
                                setEditingPortfolio((prev) =>
                                  prev
                                    ? { ...prev, startDate: e.target.value }
                                    : prev,
                                )
                              }
                              className="w-full h-9 px-3 pl-8 rounded-xl bg-white border border-[#efeee7] text-xs text-[#1b1c18] focus:outline-none focus:ring-2 focus:ring-[#6C814C]"
                            />
                            <CalendarIcon />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-[#75786c]">
                            종료일
                          </Label>
                          <div className="relative">
                            <input
                              type="date"
                              value={editingPortfolio.endDate}
                              onChange={(e) =>
                                setEditingPortfolio((prev) =>
                                  prev
                                    ? { ...prev, endDate: e.target.value }
                                    : prev,
                                )
                              }
                              className="w-full h-9 px-3 pl-8 rounded-xl bg-white border border-[#efeee7] text-xs text-[#1b1c18] focus:outline-none focus:ring-2 focus:ring-[#6C814C]"
                            />
                            <CalendarIcon />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-[#75786c]">
                            클라이언트
                          </Label>
                          <Input
                            value={editingPortfolio.client}
                            onChange={(e) =>
                              setEditingPortfolio((prev) =>
                                prev
                                  ? { ...prev, client: e.target.value }
                                  : prev,
                              )
                            }
                            placeholder="예: 신랑신부님"
                            className="h-9 text-xs bg-white border-[#efeee7] focus-visible:ring-[#6C814C]"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-[#75786c]">업종</Label>
                          <Input
                            value={editingPortfolio.industry}
                            onChange={(e) =>
                              setEditingPortfolio((prev) =>
                                prev
                                  ? { ...prev, industry: e.target.value }
                                  : prev,
                              )
                            }
                            placeholder="예: 일반·기타"
                            className="h-9 text-xs bg-white border-[#efeee7] focus-visible:ring-[#6C814C]"
                          />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-xs text-[#75786c]">
                            목적별
                          </Label>
                          <Input
                            value={editingPortfolio.purpose}
                            onChange={(e) =>
                              setEditingPortfolio((prev) =>
                                prev
                                  ? { ...prev, purpose: e.target.value }
                                  : prev,
                              )
                            }
                            placeholder="예: 웨딩"
                            className="h-9 text-xs bg-white border-[#efeee7] focus-visible:ring-[#6C814C]"
                          />
                        </div>
                      </div>

                      {/* 추가 이미지 */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-[#75786c]">
                            팝업 추가 이미지
                          </Label>
                          <button
                            type="button"
                            onClick={() => editImageInputRef.current?.click()}
                            className="text-xs text-[#6C814C] hover:underline"
                          >
                            + 이미지 추가
                          </button>
                        </div>
                        {editingPortfolio.newImages.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {editingPortfolio.newImages.map((img, i) => (
                              <div
                                key={i}
                                className="relative w-16 h-16 rounded-lg overflow-hidden"
                              >
                                <img
                                  src={img.preview}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleEditImageRemove(i)}
                                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center text-[10px]"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingPortfolio(null)}
                          className="text-xs px-3 py-1.5 border border-[#c5c8ba] rounded-lg text-[#45483d] hover:bg-[#f5f4ec]"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={handleEditSave}
                          disabled={isSavingEdit}
                          className="text-xs px-3 py-1.5 bg-[#6C814C] text-white rounded-lg hover:bg-[#5a6d3e] disabled:opacity-50"
                        >
                          {isSavingEdit ? "저장 중..." : "저장"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* 새 포트폴리오 */}
            {newPortfolios.map((item, index) => (
              <div
                key={`new-${index}`}
                className="border border-[#6C814C]/30 rounded-xl overflow-hidden"
              >
                <div className="flex items-center gap-3 p-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.preview}
                      alt={`새 포트폴리오 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {mode === "edit" && (
                      <div className="absolute top-1 left-1 bg-[#6C814C] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        NEW
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        updateNewPortfolio(index, "description", e.target.value)
                      }
                      placeholder="프로젝트 제목 #해시태그"
                      className="h-9 text-xs bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#6C814C] mb-1"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedIndex(expandedIndex === index ? null : index)
                      }
                      className="text-xs text-[#6C814C] hover:underline"
                    >
                      {expandedIndex === index
                        ? "▲ 상세 정보 접기"
                        : "▼ 상세 정보 입력"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNewPortfolioRemove(index)}
                    className="w-7 h-7 rounded-full bg-red-50 text-red-400 flex items-center justify-center text-xs hover:bg-red-100 shrink-0"
                  >
                    ✕
                  </button>
                </div>

                {expandedIndex === index && (
                  <div className="px-4 pb-4 grid grid-cols-2 gap-3 border-t border-[#efeee7] pt-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-[#75786c]">시작일</Label>
                      <div className="relative">
                        <input
                          type="date"
                          value={item.startDate}
                          onChange={(e) =>
                            updateNewPortfolio(
                              index,
                              "startDate",
                              e.target.value,
                            )
                          }
                          className="w-full h-9 px-3 pl-8 rounded-xl bg-[#f5f4ec] border border-[#efeee7] text-xs text-[#1b1c18] focus:outline-none focus:ring-2 focus:ring-[#6C814C]"
                        />
                        <CalendarIcon />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-[#75786c]">종료일</Label>
                      <div className="relative">
                        <input
                          type="date"
                          value={item.endDate}
                          onChange={(e) =>
                            updateNewPortfolio(index, "endDate", e.target.value)
                          }
                          className="w-full h-9 px-3 pl-8 rounded-xl bg-[#f5f4ec] border border-[#efeee7] text-xs text-[#1b1c18] focus:outline-none focus:ring-2 focus:ring-[#6C814C]"
                        />
                        <CalendarIcon />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-[#75786c]">
                        클라이언트
                      </Label>
                      <Input
                        value={item.client}
                        onChange={(e) =>
                          updateNewPortfolio(index, "client", e.target.value)
                        }
                        placeholder="예: 신랑신부님"
                        className="h-9 text-xs bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#6C814C]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-[#75786c]">업종</Label>
                      <Input
                        value={item.industry}
                        onChange={(e) =>
                          updateNewPortfolio(index, "industry", e.target.value)
                        }
                        placeholder="예: 일반·기타"
                        className="h-9 text-xs bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#6C814C]"
                      />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <Label className="text-xs text-[#75786c]">목적별</Label>
                      <Input
                        value={item.purpose}
                        onChange={(e) =>
                          updateNewPortfolio(index, "purpose", e.target.value)
                        }
                        placeholder="예: 웨딩"
                        className="h-9 text-xs bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#6C814C]"
                      />
                    </div>
                  </div>
                )}
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
