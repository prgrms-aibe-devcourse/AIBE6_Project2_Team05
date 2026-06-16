import Image from "next/image";

type FreelancerProfile = {
  readonly memberName: string;
  readonly title: string;
  readonly introduction: string;
  readonly region: string;
  readonly price: number | null;
};

type FreelancerCardProps = {
  readonly profile: FreelancerProfile | null;
  readonly loading: boolean;
};

export function FreelancerCard({ profile, loading }: FreelancerCardProps) {
  const displayName = profile?.memberName ?? "프리랜서";
  const displayTitle = profile?.title ?? "프리랜서 정보를 불러오는 중";
  const displayIntroduction =
    profile?.introduction ?? "실제 프리랜서 프로필 데이터가 표시됩니다.";
  const displayRegion = profile?.region ?? "지역 정보 없음";
  const displayPrice =
    profile?.price == null ? "협의" : `₩${profile.price.toLocaleString()}~`;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#efeee7] bg-white p-5">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
        <Image
          src="https://picsum.photos/seed/julianne/200/200"
          alt={displayName}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="mb-0.5 text-sm font-semibold text-[#1b1c18]">
          {loading ? "불러오는 중..." : displayName}
        </h3>
        <p className="mb-2 text-xs text-[#75786c]">
          {loading ? "프리랜서 프로필을 가져오는 중입니다" : displayTitle}
        </p>
        <div className="flex items-center gap-3 text-xs text-[#45483d]">
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3 text-[#75786c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {loading ? "지역 정보를 확인 중" : displayRegion}
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3 fill-current text-[#f59e0b]" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {loading ? "조회 중" : "프로필 확인됨"}
          </span>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-[#75786c]">
          {loading ? "프로필 설명을 가져오는 중입니다" : displayIntroduction}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-lg font-bold text-[#4f6231]">
          {loading ? "..." : displayPrice}
        </p>
        <p className="text-xs text-[#75786c]">{loading ? "조회 중" : "부터"}</p>
      </div>
    </div>
  );
}
