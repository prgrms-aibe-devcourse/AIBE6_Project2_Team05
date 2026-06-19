"use client";

import { getAccessToken } from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

interface ImageDto {
  id: number;
  imageUrl: string;
}

interface Portfolio {
  id: number;
  freelancerProfileId: number;
  imageUrl: string;
  description: string;
  sortOrder: number;
  startDate?: string;
  endDate?: string;
  client?: string;
  industry?: string;
  purpose?: string;
  images?: ImageDto[];
}

interface FreelancerInfo {
  title: string;
  memberId: number;
  averageRating: number;
  reviewCount: number;
  categoryName: string;
  region: string;
}

export default function PortfoliosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [freelancer, setFreelancer] = useState<FreelancerInfo | null>(null);
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);

  const selectedPortfolio = selectedIndex !== null ? portfolios[selectedIndex] : null;
  const isOwner = freelancer?.memberId === currentMemberId;

  const parseHashtags = (text: string) => {
    const tags = text.match(/#[\w가-힣]+/g) || [];
    const plain = text.replace(/#[\w가-힣]+/g, "").trim();
    return { plain, tags };
  };

  useEffect(() => {
    const token = getAccessToken();
    const fetcher = token ? authFetch : fetch;

    Promise.all([
      fetch(`/api/freelancers/${id}`),
      fetcher(`/api/freelancers/${id}/portfolios`),
      token ? authFetch(`/api/v1/members/me`) : Promise.resolve(null),
    ])
      .then(([profileRes, portfolioRes, meRes]) =>
        Promise.all([
          profileRes.json(),
          portfolioRes.json(),
          meRes ? meRes.json() : Promise.resolve(null),
        ]),
      )
      .then(([profileData, portfolioData, meData]) => {
        setFreelancer({
          title: profileData.title,
          memberId: profileData.memberId,
          averageRating: profileData.averageRating,
          reviewCount: profileData.reviewCount,
          categoryName: profileData.categoryName,
          region: profileData.region,
        });
        setPortfolios(portfolioData);
        if (meData) setCurrentMemberId(meData.id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="flex flex-col min-h-full bg-[#fbf9f2]">
      {/* 프리랜서 배너 */}
      <div className="bg-white border-b border-[#efeee7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <Link
            href={`/profile/${id}`}
            className="text-sm text-[#75786c] hover:text-[#1b1c18] flex items-center gap-1 mb-4"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            프로필로 돌아가기
          </Link>

          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#efeee7] shrink-0">
              <Image
                src="https://picsum.photos/seed/elena/400/400"
                alt={freelancer?.title || "프리랜서"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              {freelancer?.categoryName && (
                <span className="text-xs px-2 py-0.5 bg-[#f5f4ec] text-[#45483d] rounded-full mb-1 inline-block">
                  {freelancer.categoryName}
                </span>
              )}
              <h1 className="font-semibold text-[#1b1c18] text-lg">
                {freelancer?.title || ""}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3.5 h-3.5 fill-current ${i < Math.round(freelancer?.averageRating ?? 0) ? "text-[#f59e0b]" : "text-[#d1d5db]"}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-[#45483d] ml-1">
                    {freelancer?.averageRating.toFixed(1)} (
                    {freelancer?.reviewCount} 리뷰)
                  </span>
                </div>
                {freelancer?.region && (
                  <span className="text-xs text-[#75786c]">
                    · {freelancer.region}
                  </span>
                )}
              </div>
            </div>

            {isOwner && (
              <div className="ml-auto">
                <Link
                  href={`/mypage?tab=portfolio`}
                  className="text-sm px-4 py-2 border border-[#6C814C] text-[#6C814C] rounded-xl hover:bg-[#f5f4ec] transition-colors"
                >
                  포트폴리오 수정
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <h2 className="font-semibold text-[#1b1c18] text-base">
            포트폴리오 {!loading && `(${portfolios.length})`}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-xl bg-[#efeee7] animate-pulse"
              />
            ))}
          </div>
        ) : portfolios.length === 0 ? (
          <div className="text-center py-16 text-[#75786c]">
            <p>등록된 포트폴리오가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {portfolios.map((portfolio, index) => {
              const { plain, tags } = parseHashtags(
                portfolio.description || "",
              );
              return (
                <div
                  key={portfolio.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedIndex(index)}
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2">
                    <Image
                      src={portfolio.imageUrl}
                      alt={plain || "포트폴리오"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        자세히 보기
                      </span>
                    </div>
                  </div>
                  {plain && (
                    <p className="text-sm font-medium text-[#1b1c18] truncate">
                      {plain}
                    </p>
                  )}
                  {tags.length > 0 && (
                    <p className="text-xs text-[#75786c] truncate mt-0.5">
                      {tags.join(" ")}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 팝업 */}
      {selectedPortfolio && selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden flex w-full"
            style={{ maxWidth: "960px", height: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-80 shrink-0 flex flex-col border-r border-[#efeee7] h-full overflow-y-auto">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#efeee7] sticky top-0 bg-white z-10">
                <button
                  onClick={() => setSelectedIndex(null)}
                  className="text-[#75786c] hover:text-[#1b1c18]"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <span className="text-xs text-[#75786c]">
                  {selectedIndex + 1} / {portfolios.length}
                </span>
              </div>

              <div className="p-5 flex flex-col gap-5">
                {(() => {
                  const { plain, tags } = parseHashtags(
                    selectedPortfolio.description || "",
                  );
                  return (
                    <>
                      <h3 className="font-semibold text-[#1b1c18] text-base leading-snug">
                        {plain || `포트폴리오 ${selectedIndex + 1}`}
                      </h3>

                      <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 px-4 py-2 border border-[#c5c8ba] rounded-xl text-sm text-[#45483d] hover:border-[#4f6231] hover:text-[#4f6231] transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          찜하기
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2 border border-[#c5c8ba] rounded-xl text-sm text-[#45483d] hover:border-[#4f6231] hover:text-[#4f6231] transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                          </svg>
                          공유하기
                        </button>
                      </div>

                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1.5 bg-[#f5f4ec] text-[#4f6231] rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="border-t border-[#efeee7]" />

                      {plain && (
                        <div>
                          <p className="text-xs font-semibold text-[#1b1c18] mb-1">
                            프로젝트 설명
                          </p>
                          <p className="text-sm text-[#45483d] leading-relaxed">
                            {plain}
                          </p>
                        </div>
                      )}

                      {(selectedPortfolio.startDate ||
                        selectedPortfolio.endDate) && (
                        <div>
                          <p className="text-xs font-semibold text-[#1b1c18] mb-1">
                            참여 기간
                          </p>
                          <p className="text-sm text-[#45483d]">
                            {selectedPortfolio.startDate} -{" "}
                            {selectedPortfolio.endDate}
                          </p>
                        </div>
                      )}

                      {selectedPortfolio.client && (
                        <div>
                          <p className="text-xs font-semibold text-[#1b1c18] mb-1">
                            클라이언트
                          </p>
                          <p className="text-sm text-[#45483d]">
                            {selectedPortfolio.client}
                          </p>
                        </div>
                      )}

                      {selectedPortfolio.industry && (
                        <div>
                          <p className="text-xs font-semibold text-[#1b1c18] mb-1">
                            업종
                          </p>
                          <span className="inline-block text-xs px-3 py-1 bg-[#f5f4ec] text-[#45483d] rounded-full">
                            {selectedPortfolio.industry}
                          </span>
                        </div>
                      )}

                      {selectedPortfolio.purpose && (
                        <div>
                          <p className="text-xs font-semibold text-[#1b1c18] mb-1">
                            목적별
                          </p>
                          <span className="inline-block text-xs px-3 py-1 bg-[#f5f4ec] text-[#45483d] rounded-full">
                            {selectedPortfolio.purpose}
                          </span>
                        </div>
                      )}

                      <div className="border-t border-[#efeee7]" />

                      <div>
                        <p className="text-xs font-medium text-[#75786c] mb-3">
                          다른 포트폴리오
                        </p>
                        <div className="flex flex-col gap-2">
                          {portfolios.map((p, i) => {
                            const { plain: t } = parseHashtags(
                              p.description || "",
                            );
                            return (
                              <button
                                key={p.id}
                                onClick={() => setSelectedIndex(i)}
                                className={`flex items-center gap-3 p-2 rounded-xl text-left transition-colors w-full ${i === selectedIndex ? "bg-[#f5f4ec] ring-1 ring-[#4f6231]" : "hover:bg-[#f9f8f4]"}`}
                              >
                                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                                  <Image
                                    src={p.imageUrl}
                                    alt={t || "포트폴리오"}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <p className="text-xs text-[#1b1c18] line-clamp-2 flex-1">
                                  {t || `포트폴리오 ${i + 1}`}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* 우측: 이미지 세로 스크롤 */}
            <div className="flex-1 overflow-y-auto bg-[#1b1c18]">
              <img
                src={selectedPortfolio.imageUrl}
                alt={selectedPortfolio.description || "포트폴리오"}
                className="w-full h-auto block"
              />
              {selectedPortfolio.images &&
                selectedPortfolio.images.length > 0 &&
                selectedPortfolio.images.map((img, i) => (
                  <div key={i}>
                    <div className="h-6 bg-white" />
                    <img
                      src={img.imageUrl}
                      alt={`포트폴리오 이미지 ${i + 1}`}
                      className="w-full h-auto block"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}