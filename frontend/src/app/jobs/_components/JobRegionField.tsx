"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PencilLine } from "lucide-react";
import { JOB_REGIONS, type JobFormValues } from "../job-form-options";
import { JOB_REGION_OTHER_VALUE } from "../job-region-utils.js";

type JobRegionFieldProps = {
  readonly values: JobFormValues;
  readonly onChange: <K extends keyof JobFormValues>(
    key: K,
    value: JobFormValues[K],
  ) => void;
};

export function JobRegionField({ values, onChange }: JobRegionFieldProps) {
  const isCustomRegion = values.selectedRegion === JOB_REGION_OTHER_VALUE;
  const selectedRegionLabel = isCustomRegion ? "기타" : values.selectedRegion;

  const clearRegion = () => {
    onChange("selectedRegion", "");
    onChange("customRegion", "");
  };

  return (
    <div className="space-y-2">
      <Label
        htmlFor="region-trigger"
        className="text-sm font-medium text-[#45483d]"
      >
        지역 <span className="text-xs font-normal text-[#75786c]">(선택)</span>
      </Label>

      <div className="rounded-2xl border border-[#efeee7] bg-[#f7f4eb] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
        <Select
          value={values.selectedRegion}
          onValueChange={(nextValue) => {
            if (nextValue === null) {
              clearRegion();
              return;
            }

            onChange("selectedRegion", nextValue);
            if (nextValue !== JOB_REGION_OTHER_VALUE) {
              onChange("customRegion", "");
            }
          }}
        >
          <SelectTrigger
            id="region-trigger"
            className="h-14 w-full rounded-xl border-[#e4dfd0] bg-white px-3 py-3 text-[#1b1c18] shadow-sm transition-all hover:border-[#cfc7b4] focus-visible:border-[#4f6231] focus-visible:ring-[#4f6231]/15"
          >
            <div className="flex min-w-0 flex-1 items-center">
              <SelectValue placeholder="지역을 선택해주세요">
                {selectedRegionLabel || "지역을 선택해주세요"}
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent
            className="overflow-hidden rounded-2xl border border-[#e5dfcf] bg-[#fffdf8] p-1.5 text-[#45483d] shadow-[0_18px_40px_rgba(79,98,49,0.14)]"
            sideOffset={8}
            align="start"
          >
            {JOB_REGIONS.map((region) => (
              <SelectItem
                key={region}
                value={region}
                className="rounded-xl px-3 py-2.5 text-sm data-[highlighted]:bg-[#f0f4eb] data-[highlighted]:text-[#4f6231]"
              >
                {region}
              </SelectItem>
            ))}
            <SelectItem
              value={JOB_REGION_OTHER_VALUE}
              className="rounded-xl px-3 py-2.5 text-sm data-[highlighted]:bg-[#f7efe2] data-[highlighted]:text-[#9a5b1f]"
            >
              기타
            </SelectItem>
          </SelectContent>
        </Select>

        <p className="mt-2 px-1 text-xs text-[#8a8d80]">
          주 활동 지역을 선택해주세요. 목록에 없으면 기타로 직접 입력할 수 있습니다.
        </p>

        {isCustomRegion ? (
          <div className="mt-3 rounded-xl border border-dashed border-[#d9cfba] bg-white/85 p-3">
            <Label
              htmlFor="customRegion"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-[#6a5d3d]"
            >
              <PencilLine className="h-4 w-4" />
              직접 입력 지역
            </Label>
            <div className="relative">
              <Input
                id="customRegion"
                value={values.customRegion}
                onChange={(event) => onChange("customRegion", event.target.value)}
                placeholder="예: 서울 강남구, 경기 성남시"
                className="h-11 border-[#e4dfd0] bg-[#fcfbf7] text-[#1b1c18] placeholder:text-[#9a978c] focus-visible:ring-[#4f6231]"
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
