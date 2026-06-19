"use client";

import {
  ExistingPortfolio,
  ImageDto,
} from "@/components/freelancer/FreelancerProfileForm";
import PortfolioDetailForm from "@/components/freelancer/PortfolioDetailForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";
import { useEffect, useRef, useState } from "react";

interface EditingPortfolio {
  id: number;
  description: string;
  startDate: string;
  endDate: string;
  client: string;
  industry: string;
  purpose: string;
  mainImageUrl: string;
  newMainImage: { file: File; preview: string } | null;
  existingImages: ImageDto[];
  newImages: { file: File; preview: string }[];
  error: string;
}

interface PortfolioTabProps {
  freelancerProfileId: number;
}

export default function PortfolioTab({
  freelancerProfileId,
}: PortfolioTabProps) {
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const editImageInputRef = useRef<HTMLInputElement>(null);
  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const [currentExisting, setCurrentExisting] = useState<ExistingPortfolio[]>(
    [],
  );
  const [editingPortfolio, setEditingPortfolio] =
    useState<EditingPortfolio | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeletingImageId, setIsDeletingImageId] = useState<number | null>(
    null,
  );
  const [deletingPortfolioId, setDeletingPortfolioId] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    authFetch(
      `${API_BASE_URL}/api/freelancers/${freelancerProfileId}/portfolios`,
    )
      .then((res) => res.json())
      .then((data) => setCurrentExisting(data))
      .catch(() => setErrorMessage("포트폴리오를 불러올 수 없습니다."))
      .finally(() => setIsLoading(false));
  }, [freelancerProfileId]);

  const handlePortfolioAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    addFiles(files);
    e.target.value = "";
  };

  const addFiles = async (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");
    let lastUploadedId: number | null = null;

    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("sortOrder", String(currentExisting.length));
      try {
        const res = await authFetch(
          `${API_BASE_URL}/api/freelancers/${freelancerProfileId}/portfolios`,
          { method: "POST", body: formData },
        );
        if (res.ok) {
          const data = await res.json();
          setCurrentExisting((prev) => [...prev, data]);
          lastUploadedId = data.id;
        } else {
          setErrorMessage("포트폴리오 업로드에 실패했습니다.");
        }
      } catch {
        setErrorMessage("포트폴리오 업로드에 실패했습니다.");
      }
    }

    setIsUploading(false);
    if (lastUploadedId !== null) {
      setSuccessMessage(
        "포트폴리오가 추가되었습니다. 상세 정보를 입력해주세요.",
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleExistingPortfolioDelete = async (portfolioId: number) => {
    if (!window.confirm("포트폴리오를 삭제하시겠습니까?")) return;
    setDeletingPortfolioId(portfolioId);
    setErrorMessage("");
    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/freelancers/${freelancerProfileId}/portfolios/${portfolioId}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        setCurrentExisting((prev) => prev.filter((p) => p.id !== portfolioId));
        if (editingPortfolio?.id === portfolioId) setEditingPortfolio(null);
      } else {
        setErrorMessage("포트폴리오 삭제에 실패했습니다.");
      }
    } catch {
      setErrorMessage("포트폴리오 삭제에 실패했습니다.");
    } finally {
      setDeletingPortfolioId(null);
    }
  };

  const handleEditStart = (item: ExistingPortfolio) => {
    const existingImages: ImageDto[] = (item.images || []).map((img, i) =>
      typeof img === "string" ? { id: i, imageUrl: img } : img,
    );
    setEditingPortfolio({
      id: item.id,
      description: item.description || "",
      startDate: item.startDate || "",
      endDate: item.endDate || "",
      client: item.client || "",
      industry: item.industry || "",
      purpose: item.purpose || "",
      mainImageUrl: item.imageUrl,
      newMainImage: null,
      existingImages,
      newImages: [],
      error: "",
    });
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditingPortfolio((prev) => {
      if (!prev) return prev;
      if (prev.newMainImage) URL.revokeObjectURL(prev.newMainImage.preview);
      return {
        ...prev,
        newMainImage: { file, preview: URL.createObjectURL(file) },
      };
    });
    e.target.value = "";
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

  const handleExistingImageDelete = async (imageId: number) => {
    if (!editingPortfolio) return;
    setIsDeletingImageId(imageId);
    try {
      await authFetch(
        `${API_BASE_URL}/api/freelancers/${freelancerProfileId}/portfolios/${editingPortfolio.id}/images/${imageId}`,
        { method: "DELETE" },
      );
      setEditingPortfolio((prev) =>
        prev
          ? {
              ...prev,
              existingImages: prev.existingImages.filter(
                (img) => img.id !== imageId,
              ),
            }
          : prev,
      );
    } catch (e) {
      console.error("이미지 삭제 실패", e);
    } finally {
      setIsDeletingImageId(null);
    }
  };

  const handleEditDetailChange = (key: string, value: string) => {
    setEditingPortfolio((prev) =>
      prev ? { ...prev, [key]: value, error: "" } : prev,
    );
  };

  const handleEditSave = async () => {
    if (!editingPortfolio) return;
    if (!editingPortfolio.description.trim()) {
      setEditingPortfolio((prev) =>
        prev ? { ...prev, error: "제목을 입력해주세요." } : prev,
      );
      return;
    }
    if (editingPortfolio.startDate && editingPortfolio.endDate) {
      if (
        new Date(editingPortfolio.startDate) >
        new Date(editingPortfolio.endDate)
      ) {
        setEditingPortfolio((prev) =>
          prev
            ? { ...prev, error: "시작일이 종료일보다 늦을 수 없습니다." }
            : prev,
        );
        return;
      }
    }
    setIsSavingEdit(true);
    try {
      const formData = new FormData();
      if (editingPortfolio.newMainImage)
        formData.append("image", editingPortfolio.newMainImage.file);
      formData.append("description", editingPortfolio.description);
      if (editingPortfolio.startDate)
        formData.append("startDate", editingPortfolio.startDate);
      if (editingPortfolio.endDate)
        formData.append("endDate", editingPortfolio.endDate);
      formData.append("client", editingPortfolio.client);
      formData.append("industry", editingPortfolio.industry);
      formData.append("purpose", editingPortfolio.purpose);

      await authFetch(
        `${API_BASE_URL}/api/freelancers/${freelancerProfileId}/portfolios/${editingPortfolio.id}`,
        { method: "PATCH", body: formData },
      ).catch(() => console.warn("포트폴리오 수정 실패"));

      const uploadedImages: ImageDto[] = [];
      for (const img of editingPortfolio.newImages) {
        const imgFormData = new FormData();
        imgFormData.append("image", img.file);
        const res = await authFetch(
          `${API_BASE_URL}/api/freelancers/${freelancerProfileId}/portfolios/${editingPortfolio.id}/images`,
          { method: "POST", body: imgFormData },
        ).catch(() => null);
        if (res?.ok) {
          const data = await res.json().catch(() => null);
          if (data?.id && data?.imageUrl)
            uploadedImages.push({ id: data.id, imageUrl: data.imageUrl });
        }
      }

      const newMainImageUrl =
        editingPortfolio.newMainImage?.preview || editingPortfolio.mainImageUrl;
      setCurrentExisting((prev) =>
        prev.map((p) =>
          p.id === editingPortfolio.id
            ? {
                ...p,
                imageUrl: newMainImageUrl,
                description: editingPortfolio.description,
                startDate: editingPortfolio.startDate,
                endDate: editingPortfolio.endDate,
                client: editingPortfolio.client,
                industry: editingPortfolio.industry,
                purpose: editingPortfolio.purpose,
                images: [...editingPortfolio.existingImages, ...uploadedImages],
              }
            : p,
        ),
      );
      setEditingPortfolio(null);
    } catch (e) {
      console.error(e);
      setEditingPortfolio((prev) =>
        prev ? { ...prev, error: "저장 중 오류가 발생했습니다." } : prev,
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  const hasPortfolios = currentExisting.length > 0;

  if (isLoading) {
    return (
      <div className="text-center py-12 text-[#75786c]">
        포트폴리오를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <>
      {/* 상단 제목 */}
      <div className="flex items-center justify-between">
        <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18]">
          포트폴리오 수정
        </h1>
        {isUploading && (
          <span className="text-xs text-[#75786c]">업로드 중...</span>
        )}
      </div>

      {successMessage && (
        <p className="rounded-xl border border-[#d3ebac] bg-[#f0f4eb] px-4 py-3 text-sm text-[#4f6231]">
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
          {errorMessage}
        </p>
      )}

      <input
        ref={portfolioInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handlePortfolioAdd}
      />
      <input
        ref={mainImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleMainImageChange}
      />
      <input
        ref={editImageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleEditImageAdd}
      />

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

        {!hasPortfolios ? (
          // 포트폴리오 없을 때: 드래그앤드롭 큰 영역
          <button
            type="button"
            onClick={() => portfolioInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-colors
              ${
                isDragging
                  ? "border-[#6C814C] bg-[#f0f4eb] text-[#6C814C]"
                  : "border-[#efeee7] text-[#75786c] hover:border-[#6C814C]"
              }`}
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
            <span className="text-sm font-medium">
              {isDragging
                ? "여기에 놓으세요"
                : "클릭하거나 이미지를 드래그하세요"}
            </span>
          </button>
        ) : (
          // 포트폴리오 있을 때: 버튼으로만 추가
          <div className="flex flex-col gap-3">
            {currentExisting.map((item) => (
              <div
                key={`existing-${item.id}`}
                className="flex items-center gap-4 p-3 border border-[#efeee7] rounded-xl transition-all hover:shadow-md hover:border-[#6C814C]/40 cursor-default"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
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
                  {item.images && item.images.length > 0 && (
                    <p className="text-xs text-[#75786c]">
                      추가 이미지 {item.images.length}장
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditStart(item)}
                    className="w-8 h-8 rounded-full bg-[#f5f4ec] text-[#4f6231] flex items-center justify-center text-xs hover:bg-[#e8f5d0] transition-colors"
                    title="수정"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExistingPortfolioDelete(item.id)}
                    className="w-8 h-8 rounded-full bg-red-50 text-red-400 flex items-center justify-center text-xs hover:bg-red-100 transition-colors"
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 포트폴리오 수정 모달 */}
      {editingPortfolio && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setEditingPortfolio(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#efeee7] sticky top-0 bg-white z-10">
              <h3 className="font-semibold text-[#1b1c18] text-base">
                포트폴리오 수정
              </h3>
              <button
                onClick={() => setEditingPortfolio(null)}
                className="text-[#75786c] hover:text-[#1b1c18]"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-xs text-[#75786c] mb-2 block">
                  대표 이미지
                </label>
                <div
                  className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#f5f4ec] group cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    mainImageInputRef.current?.click();
                  }}
                >
                  <img
                    src={
                      editingPortfolio.newMainImage?.preview ||
                      editingPortfolio.mainImageUrl
                    }
                    alt="대표 이미지"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                    사진 변경
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#75786c]">
                  제목 / 설명 #해시태그 *
                </label>
                <Input
                  value={editingPortfolio.description}
                  onChange={(e) =>
                    setEditingPortfolio((prev) =>
                      prev
                        ? { ...prev, description: e.target.value, error: "" }
                        : prev,
                    )
                  }
                  placeholder="프로젝트 제목 #해시태그"
                  className={`h-10 text-sm bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#6C814C] ${editingPortfolio.error === "제목을 입력해주세요." ? "border-red-300" : ""}`}
                />
              </div>
              <PortfolioDetailForm
                startDate={editingPortfolio.startDate}
                endDate={editingPortfolio.endDate}
                client={editingPortfolio.client}
                industry={editingPortfolio.industry}
                purpose={editingPortfolio.purpose}
                bgColor="bg-[#f5f4ec]"
                onChange={handleEditDetailChange}
              />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-[#75786c]">추가 이미지</label>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      editImageInputRef.current?.click();
                    }}
                    className="text-xs text-[#6C814C] hover:underline"
                  >
                    + 이미지 추가
                  </button>
                </div>
                {editingPortfolio.existingImages.length > 0 ||
                editingPortfolio.newImages.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {editingPortfolio.existingImages.map((img) => (
                      <div
                        key={`existing-${img.id}`}
                        className="relative w-20 h-20 rounded-lg overflow-hidden group"
                      >
                        <img
                          src={img.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleExistingImageDelete(img.id)}
                          disabled={isDeletingImageId === img.id}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium"
                        >
                          {isDeletingImageId === img.id ? "..." : "삭제"}
                        </button>
                        <span className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[9px] text-center py-0.5">
                          기존
                        </span>
                      </div>
                    ))}
                    {editingPortfolio.newImages.map((img, i) => (
                      <div
                        key={`new-${i}`}
                        className="relative w-20 h-20 rounded-lg overflow-hidden"
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
                        <span className="absolute bottom-0 left-0 right-0 bg-[#6C814C]/80 text-white text-[9px] text-center py-0.5">
                          NEW
                        </span>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        editImageInputRef.current?.click();
                      }}
                      className="w-20 h-20 rounded-lg border-2 border-dashed border-[#efeee7] flex items-center justify-center text-[#75786c] hover:border-[#6C814C] transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      editImageInputRef.current?.click();
                    }}
                    className="w-full h-24 border-2 border-dashed border-[#efeee7] rounded-xl flex flex-col items-center justify-center gap-1.5 text-[#75786c] hover:border-[#6C814C] transition-colors text-sm"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    이미지 추가
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#efeee7] sticky bottom-0 bg-white">
              {editingPortfolio.error ? (
                <p className="text-xs text-red-500 flex-1 mr-3">
                  {editingPortfolio.error}
                </p>
              ) : (
                <div className="flex-1" />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPortfolio(null)}
                  className="text-sm px-4 py-2 border border-[#c5c8ba] rounded-xl text-[#45483d] hover:bg-[#f5f4ec]"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleEditSave}
                  disabled={isSavingEdit}
                  className="text-sm px-4 py-2 bg-[#6C814C] text-white rounded-xl hover:bg-[#5a6d3e] disabled:opacity-50"
                >
                  {isSavingEdit ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
