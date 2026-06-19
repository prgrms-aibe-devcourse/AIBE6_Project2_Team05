"use client";

import BasicInfoForm from "@/components/mypage/BasicInfoForm";
import ProfileImageUpload from "@/components/mypage/ProfileImageUpload";
import SecurityForm from "@/components/mypage/SecurityForm";
import { Button } from "@/components/ui/button";
import { MemberRole } from "@/lib/roleTheme";

interface InfoTabProps {
  name: string;
  email: string;
  phone: string;
  role: MemberRole | null;
  profileImg: string | null;
  currentPw: string;
  newPw: string;
  confirmPw: string;
  errorMessage: string;
  successMessage: string;
  isSaving: boolean;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onProfileImageSelected: (file: File, previewUrl: string) => void;
  onProfileImageRemoved: () => void;
  onCurrentPwChange: (v: string) => void;
  onNewPwChange: (v: string) => void;
  onConfirmPwChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onWithdraw: () => void;
}

export default function InfoTab({
  name,
  email,
  phone,
  role,
  profileImg,
  currentPw,
  newPw,
  confirmPw,
  errorMessage,
  successMessage,
  onNameChange,
  onPhoneChange,
  onProfileImageSelected,
  onProfileImageRemoved,
  onCurrentPwChange,
  onNewPwChange,
  onConfirmPwChange,
  onSave,
  onCancel,
  onWithdraw,
  isSaving,
}: InfoTabProps) {
  return (
    <>
      <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18]">
        회원 정보 수정
      </h1>
      {errorMessage && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
          {successMessage}
        </p>
      )}
      <ProfileImageUpload
        name={name}
        role={role}
        profileImg={profileImg}
        onImageSelected={onProfileImageSelected}
        onImageRemoved={onProfileImageRemoved}
        disabled={isSaving}
      />
      <BasicInfoForm
        name={name}
        email={email}
        phone={phone}
        onNameChange={onNameChange}
        onPhoneChange={onPhoneChange}
      />
      <SecurityForm
        currentPw={currentPw}
        newPw={newPw}
        confirmPw={confirmPw}
        onCurrentPwChange={onCurrentPwChange}
        onNewPwChange={onNewPwChange}
        onConfirmPwChange={onConfirmPwChange}
        onSave={onSave}
        onCancel={onCancel}
      />
      <div className="bg-white rounded-2xl border border-red-100 p-6">
        <h2 className="font-semibold text-[#1b1c18] text-sm mb-1">계정 삭제</h2>
        <p className="text-xs text-[#75786c] mb-4">
          계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
        </p>
        <Button
          onClick={onWithdraw}
          variant="outline"
          className="border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm"
        >
          계정 삭제
        </Button>
      </div>
    </>
  );
}
