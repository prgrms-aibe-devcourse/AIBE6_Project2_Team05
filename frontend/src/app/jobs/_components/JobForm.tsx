"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { JobRegionField } from "./JobRegionField";
import {
  JOB_CATEGORY_ICONS,
  type Category,
  type JobFormValues,
} from "../job-form-options";

type JobFormProps = {
  readonly values: JobFormValues;
  readonly categories: readonly Category[];
  readonly error: string;
  readonly isSubmitting: boolean;
  readonly submitLabel: string;
  readonly submittingLabel: string;
  readonly onChange: <K extends keyof JobFormValues>(
    key: K,
    value: JobFormValues[K],
  ) => void;
  readonly onCancel: () => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly minWeddingDate?: string;
  readonly imageField?: ReactNode;
};

export function JobForm({
  values,
  categories,
  error,
  isSubmitting,
  submitLabel,
  submittingLabel,
  onChange,
  onCancel,
  onSubmit,
  minWeddingDate,
  imageField,
}: JobFormProps) {
  const formattedBudget = values.budget
    ? Number(values.budget).toLocaleString()
    : "";

  const handleBudgetChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/,/g, "");
    if (rawValue === "" || /^\d+$/.test(rawValue)) {
      onChange("budget", rawValue);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-[#45483d]">
          카테고리 <span className="text-red-400">*</span>
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange("categoryId", category.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-sm transition-all ${
                values.categoryId === category.id
                  ? "border-[#4f6231] bg-[#f0f4eb] font-medium text-[#4f6231]"
                  : "border-[#efeee7] bg-[#f5f4ec] text-[#45483d] hover:border-[#c5c8ba]"
              }`}
            >
              <span className="text-xl">
                {JOB_CATEGORY_ICONS[category.name] ?? "📋"}
              </span>
              <span className="text-center text-xs leading-tight">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#efeee7]" />

      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-sm font-medium text-[#45483d]">
          제목 <span className="text-red-400">*</span>
        </Label>
        <Input
          id="title"
          value={values.title}
          onChange={(event) => onChange("title", event.target.value)}
          placeholder="예: 야외 웨딩 스냅 작가 구합니다"
          maxLength={200}
          required
          className="h-11 border-[#efeee7] bg-[#f5f4ec] text-[#1b1c18] placeholder:text-[#75786c] focus-visible:ring-[#4f6231]"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="content" className="text-sm font-medium text-[#45483d]">
          상세 내용 <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="content"
          value={values.content}
          onChange={(event) => onChange("content", event.target.value)}
          placeholder={`원하는 스타일, 촬영 장소, 시간 등 구체적으로 적어주세요.\n\n예시)\n- 촬영 장소: 서울 야외\n- 촬영 시간: 2시간\n- 원하는 스타일: 자연스러운 스냅`}
          rows={8}
          required
          className="resize-none border-[#efeee7] bg-[#f5f4ec] placeholder:text-[#75786c] focus-visible:ring-[#4f6231]"
        />
        <p className="text-right text-xs text-[#75786c]">
          {values.content.length}자
        </p>
      </div>

      <div className="border-t border-[#efeee7]" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="budget" className="text-sm font-medium text-[#45483d]">
            예산 <span className="text-xs font-normal text-[#75786c]">(선택)</span>
          </Label>
          <div className="relative">
            <Input
              id="budget"
              type="text"
              inputMode="numeric"
              value={formattedBudget}
              onChange={handleBudgetChange}
              placeholder="협의 가능"
              className={`h-11 border-[#efeee7] bg-[#f5f4ec] text-[#1b1c18] placeholder:text-[#75786c] focus-visible:ring-[#4f6231] ${
                values.budget ? "pr-16" : "pr-8"
              }`}
            />
            {values.budget ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  aria-label="예산 지우기"
                  onClick={() => onChange("budget", "")}
                  className="absolute right-7 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0 text-[#8a8d80] hover:bg-[#f0f4eb] hover:text-[#4f6231]"
                >
                  <X className="h-4 w-4" />
                </Button>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#75786c]">
                  원
                </span>
              </>
            ) : null}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="weddingDate"
            className="text-sm font-medium text-[#45483d]"
          >
            웨딩 예정일 <span className="text-red-400">*</span>
          </Label>
          <Input
            id="weddingDate"
            type="date"
            value={values.weddingDate}
            onChange={(event) => onChange("weddingDate", event.target.value)}
            min={minWeddingDate}
            required
            className="h-11 border-[#efeee7] bg-[#f5f4ec] text-[#1b1c18] focus-visible:ring-[#4f6231]"
          />
        </div>
      </div>

      <JobRegionField values={values} onChange={onChange} />

      {imageField}

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
          {error}
        </p>
      ) : null}

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-11 flex-1 rounded-xl border-[#c5c8ba] text-[#45483d]"
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !values.title.trim() ||
            !values.content.trim() ||
            !values.categoryId ||
            !values.weddingDate
          }
          className="h-11 flex-1 rounded-xl bg-[#4f6231] text-white hover:bg-[#677b47]"
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
