import Image from "next/image";

interface FreelancerProfile {
  careerYears: number;
  region: string;
  price: number;
  categoryName: string;
  averageRating: number;
  reviewCount: number;
  bookmarkCount: number;
  selfIntroduction?: string;
  memberName?: string;
  memberImageUrl?: string;
}

interface AboutTabProps {
  profile: FreelancerProfile;
  reviewCount: number;
}

export default function AboutTab({ profile, reviewCount }: AboutTabProps) {
  return (
    <div className="flex gap-8 items-stretch">
      {/* 좌측: 프로필 사진 */}
      <div className="w-96 shrink-0 rounded-2xl overflow-hidden border border-[#efeee7] shadow-sm">
        {profile.memberImageUrl ? (
          <div className="relative w-full h-full min-h-[460px] bg-[#f5f4ec]">
            <Image
              src={profile.memberImageUrl}
              alt={profile.memberName || "프리랜서"}
              fill
              className="object-cover object-top"
            />
          </div>
        ) : (
          <div className="w-full h-full min-h-[360px] flex items-center justify-center bg-[#d3ebac] text-[#4f6231] font-bold text-5xl">
            {profile.memberName?.charAt(0) ?? "?"}
          </div>
        )}
      </div>

      {/* 우측: 정보 */}
      <div className="flex-1 flex flex-col gap-5">
        {/* 이름 + 카테고리 */}
        <div className="bg-white border border-[#efeee7] rounded-2xl p-6 shadow-sm">
          <p className="font-bold text-[#1b1c18] text-xl">
            {profile.memberName ?? "프리랜서"}
          </p>
          <p className="text-sm text-[#75786c] mt-1">{profile.categoryName}</p>
        </div>

        {/* 통계 그리드 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-[#efeee7] rounded-2xl p-5 shadow-sm text-center">
            <p className="text-2xl font-bold text-[#4f6231]">
              {profile.careerYears}년
            </p>
            <p className="text-xs text-[#75786c] mt-1">경력</p>
          </div>
          <div className="bg-white border border-[#efeee7] rounded-2xl p-5 shadow-sm text-center">
            <p className="text-2xl font-bold text-[#4f6231]">
              {profile.averageRating.toFixed(1)}
            </p>
            <p className="text-xs text-[#75786c] mt-1">평균 평점</p>
          </div>
          <div className="bg-white border border-[#efeee7] rounded-2xl p-5 shadow-sm text-center">
            <p className="text-2xl font-bold text-[#4f6231]">{reviewCount}개</p>
            <p className="text-xs text-[#75786c] mt-1">리뷰</p>
          </div>
          <div className="bg-white border border-[#efeee7] rounded-2xl p-5 shadow-sm text-center">
            <p className="text-2xl font-bold text-[#4f6231]">
              {profile.bookmarkCount}
            </p>
            <p className="text-xs text-[#75786c] mt-1">찜</p>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="bg-white border border-[#efeee7] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <p className="text-xs font-semibold text-[#75786c] uppercase tracking-wide">
            기본 정보
          </p>
          <div className="flex items-center justify-between text-sm py-2 border-b border-[#f5f4ec]">
            <span className="text-[#75786c]">카테고리</span>
            <span className="text-[#1b1c18] font-medium">
              {profile.categoryName}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm py-2 border-b border-[#f5f4ec]">
            <span className="text-[#75786c]">활동 지역</span>
            <span className="text-[#1b1c18] font-medium">{profile.region}</span>
          </div>
          <div className="flex items-center justify-between text-sm py-2">
            <span className="text-[#75786c]">시작 가격</span>
            <span className="text-[#4f6231] font-bold text-base">
              ₩{profile.price.toLocaleString()}~
            </span>
          </div>
        </div>

        {/* 자기소개 */}
        {profile.selfIntroduction && (
          <div className="bg-white border border-[#efeee7] rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-semibold text-[#75786c] uppercase tracking-wide mb-3">
              자기소개
            </p>
            <p className="text-sm text-[#45483d] leading-relaxed whitespace-pre-wrap">
              {profile.selfIntroduction}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
