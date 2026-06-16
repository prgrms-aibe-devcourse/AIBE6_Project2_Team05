"use client";

import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface ProfileImageUploadProps {
  name: string;
  profileImg: string | null;
  onImageChange: (img: string | null) => void;
}

export default function ProfileImageUpload({
  name,
  profileImg,
  onImageChange,
}: ProfileImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageChange(url);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#efeee7] p-6">
      <h2 className="font-semibold text-[#1b1c18] text-sm mb-5">
        프로필 이미지
      </h2>
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-[#d3ebac] shrink-0">
          {profileImg ? (
            <Image
              src={profileImg}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#4f6231] font-bold text-3xl">
              {name.charAt(0)}
            </div>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileRef.current?.click()}
              className="border-[#c5c8ba] text-[#45483d] hover:border-[#4f6231] hover:text-[#4f6231] rounded-xl text-xs"
            >
              이미지 업로드
            </Button>
            {profileImg && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onImageChange(null)}
                className="text-xs text-[#75786c] hover:text-red-500 rounded-xl"
              >
                제거
              </Button>
            )}
          </div>
          <p className="text-xs text-[#75786c]">
            권장 크기: 800 × 800px · JPG, PNG, WebP
          </p>
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}
