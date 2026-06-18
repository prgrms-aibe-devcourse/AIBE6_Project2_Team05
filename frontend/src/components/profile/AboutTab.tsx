interface FreelancerProfile {
  careerYears: number;
  region: string;
  price: number;
  categoryName: string;
  averageRating: number;
  reviewCount: number;
  bookmarkCount: number;
}

interface AboutTabProps {
  profile: FreelancerProfile;
  reviewCount: number;
}

export default function AboutTab({ profile, reviewCount }: AboutTabProps) {
  return (
    <div className="max-w-2xl">
      {/* 전문가 정보 요약 카드 */}
      <div className="bg-white border border-[#efeee7] rounded-2xl p-5 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
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
      </div>

      {/* 기본 정보 */}
      <div className="bg-[#f5f4ec] rounded-2xl p-5 flex flex-col gap-3">
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
    </div>
  );
}
