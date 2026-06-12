interface FreelancerProfile {
  introduction: string;
  careerYears: number;
}

interface AboutTabProps {
  profile: FreelancerProfile;
  reviewCount: number;
}

export default function AboutTab({ profile, reviewCount }: AboutTabProps) {
  return (
    <div className="max-w-2xl">
      <h2 className="font-[var(--font-display)] text-xl font-semibold text-[#1b1c18] mb-4">
        소개
      </h2>
      <p className="text-sm text-[#45483d] leading-relaxed mb-4">
        {profile.introduction || "소개글이 없습니다."}
      </p>
      <div className="grid grid-cols-2 gap-4 mt-8 p-5 bg-[#f5f4ec] rounded-2xl">
        <div className="text-center">
          <p className="font-[var(--font-display)] text-2xl font-bold text-[#4f6231]">
            {profile.careerYears}년
          </p>
          <p className="text-xs text-[#75786c]">경력</p>
        </div>
        <div className="text-center">
          <p className="font-[var(--font-display)] text-2xl font-bold text-[#4f6231]">
            {reviewCount}개
          </p>
          <p className="text-xs text-[#75786c]">리뷰</p>
        </div>
      </div>
    </div>
  );
}
