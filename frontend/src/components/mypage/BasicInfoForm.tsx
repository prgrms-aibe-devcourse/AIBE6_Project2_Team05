"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoFormProps {
  name: string;
  email: string;
  phone: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

export default function BasicInfoForm({
  name,
  email,
  phone,
  onNameChange,
  onPhoneChange,
}: BasicInfoFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#efeee7] p-6">
      <h2 className="font-semibold text-[#1b1c18] text-sm mb-5">기본 정보</h2>
      <div className="space-y-4 max-w-md">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-[#45483d]">이름</Label>
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18]"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-[#45483d]">이메일</Label>
          <Input
            type="email"
            value={email}
            readOnly
            className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18]"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-[#45483d]">전화번호</Label>
          <Input
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18]"
          />
        </div>
      </div>
    </div>
  );
}
