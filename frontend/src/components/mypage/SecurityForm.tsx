"use client";

import PasswordInput from "@/components/mypage/PasswordInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SecurityFormProps {
  currentPw: string;
  newPw: string;
  confirmPw: string;
  onCurrentPwChange: (value: string) => void;
  onNewPwChange: (value: string) => void;
  onConfirmPwChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function SecurityForm({
  currentPw,
  newPw,
  confirmPw,
  onCurrentPwChange,
  onNewPwChange,
  onConfirmPwChange,
  onSave,
  onCancel,
}: SecurityFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#efeee7] p-6">
      <h2 className="font-semibold text-[#1b1c18] text-sm mb-1">보안 설정</h2>
      <p className="text-xs text-[#75786c] mb-5">
        비밀번호를 변경하려면 현재 비밀번호를 입력해주세요
      </p>
      <div className="space-y-4 max-w-md">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-[#45483d]">
            현재 비밀번호
          </Label>
          <PasswordInput
            value={currentPw}
            onChange={(e) => onCurrentPwChange(e.target.value)}
            placeholder="현재 비밀번호"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-[#45483d]">
            새 비밀번호
          </Label>
          <PasswordInput
            value={newPw}
            onChange={(e) => onNewPwChange(e.target.value)}
            placeholder="8자 이상 입력해주세요"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-[#45483d]">
            새 비밀번호 확인
          </Label>
          <PasswordInput
            value={confirmPw}
            onChange={(e) => onConfirmPwChange(e.target.value)}
            placeholder="비밀번호를 다시 입력해주세요"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            className="border-[#c5c8ba] text-[#45483d] rounded-xl"
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            onClick={onSave}
            className="bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl"
          >
            저장하기
          </Button>
        </div>
      </div>
    </div>
  );
}
