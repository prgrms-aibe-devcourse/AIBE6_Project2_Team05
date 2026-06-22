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
    <div className="flex gap-5 items-stretch">
      {/* 좌측: 프로필 사진만 */}
      <div className="w-100 shrink-0 rounded-2xl overflow-hidden border border-[#efeee7]">
        {profile.memberImageUrl ? (
          <div className="relative w-full h-full min-h-[420px] bg-[#f5f4ec]">
            <Image
              src={profile.memberImageUrl}
              alt={profile.memberName || "프리랜서"}
              fill
              className="object-cover object-top"
            />
          </div>
        ) : (
          <div className="w-full h-full min-h-[320px] flex items-center justify-center bg-[#d3ebac] text-[#4f6231] font-bold text-5xl">
            {profile.memberName?.charAt(0) ?? "?"}
          </div>
        )}
      </div>

      {/* 우측: 정보 */}
      <div className="flex-1 bg-white border border-[#efeee7] rounded-2xl p-6 flex flex-col gap-5">
        {/* 이름 + 카테고리 */}
        <div>
          <p className="font-semibold text-[#1b1c18] text-lg">
            {profile.memberName ?? "프리랜서"}
          </p>
          <p className="text-sm text-[#75786c] mt-0.5">
            {profile.categoryName}
          </p>
        </div>

        <div className="border-t border-[#efeee7]" />

        {/* 통계 */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-xl font-bold text-[#4f6231]">
              {profile.careerYears}년
            </p>
            <p className="text-xs text-[#75786c] mt-0.5">경력</p>
          </div>
          <div>
            <p className="text-xl font-bold text-[#4f6231]">{reviewCount}개</p>
            <p className="text-xs text-[#75786c] mt-0.5">리뷰</p>
          </div>
          <div>
            <p className="text-xl font-bold text-[#4f6231]">
              {profile.averageRating.toFixed(1)}
            </p>
            <p className="text-xs text-[#75786c] mt-0.5">평균 평점</p>
          </div>
          <div>
            <p className="text-xl font-bold text-[#4f6231]">
              {profile.bookmarkCount}
            </p>
            <p className="text-xs text-[#75786c] mt-0.5">찜</p>
          </div>
        </div>

        <div className="border-t border-[#efeee7]" />

        {/* 기본 정보 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#75786c]">카테고리</span>
            <span className="text-[#1b1c18] font-medium">
              {profile.categoryName}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#75786c]">활동 지역</span>
            <span className="text-[#1b1c18] font-medium">{profile.region}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#75786c]">시작 가격</span>
            <span className="text-[#4f6231] font-semibold">
              ₩{profile.price.toLocaleString()}~
            </span>
          </div>
        </div>

        {/* 자기소개 */}
        {profile.selfIntroduction && (
          <>
            <div className="border-t border-[#efeee7]" />
            <div>
              <h2 className="font-semibold text-[#1b1c18] text-sm mb-2">
                자기소개
              </h2>
              <p className="text-sm text-[#45483d] leading-relaxed whitespace-pre-wrap">
                {profile.selfIntroduction}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
