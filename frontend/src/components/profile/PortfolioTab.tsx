"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  images?: string[];
}

interface PortfolioTabProps {
  portfolios: Portfolio[];
  isLoggedIn: boolean;
  profileId: string;
}

export default function PortfolioTab({
  portfolios,
  isLoggedIn,
  profileId,
}: PortfolioTabProps) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedPortfolio =
    selectedIndex !== null ? portfolios[selectedIndex] : null;

  const parseHashtags = (text: string) => {
    const tags = text.match(/#[\w가-힣]+/g) || [];
    const plain = text.replace(/#[\w가-힣]+/g, "").trim();
    return { plain, tags };
  };

  if (portfolios.length === 0) {
    return (
      <div className="text-center py-16 text-[#75786c]">
        <p>등록된 포트폴리오가 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[#1b1c18] text-base">
          포트폴리오 ({portfolios.length})
        </h2>
      </div>

      {/* 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {portfolios.map((portfolio, index) => {
          const { plain, tags } = parseHashtags(portfolio.description || "");
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

      {!isLoggedIn && portfolios.length === 3 && (
        <div className="text-center py-8">
          <p className="text-sm text-[#75786c] mb-3">
            로그인하면 모든 포트폴리오를 볼 수 있어요
          </p>
          <button
            onClick={() => router.push(`/login?redirect=/profile/${profileId}`)}
            className="bg-[#4f6231] text-white px-6 py-2.5 rounded-xl text-sm hover:bg-[#677b47] transition-colors"
          >
            로그인하고 더보기
          </button>
        </div>
      )}

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
            {/* 좌측: 정보 패널 */}
            <div className="w-80 shrink-0 flex flex-col border-r border-[#efeee7] h-full overflow-y-auto">
              {/* 헤더 */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#efeee7] sticky top-0 bg-white z-10">
                <button
                  onClick={() => setSelectedIndex(null)}
                  className="text-[#75786c] hover:text-[#1b1c18] transition-colors"
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

              {/* 본문 */}
              <div className="p-5 flex flex-col gap-5">
                {(() => {
                  const { plain, tags } = parseHashtags(
                    selectedPortfolio.description || "",
                  );
                  return (
                    <>
                      {/* 제목 */}
                      <h3 className="font-semibold text-[#1b1c18] text-base leading-snug">
                        {plain || `포트폴리오 ${selectedIndex + 1}`}
                      </h3>

                      {/* 찜 / 공유 버튼 */}
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

                      {/* 해시태그 */}
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

                      {/* 프로젝트 설명 */}
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

                      {/* 참여 기간 */}
                      {(selectedPortfolio.startDate ||
                        selectedPortfolio.endDate) && (
                        <div>
                          <p className="text-xs font-semibold text-[#1b1c18] mb-1">
                            참여 기간
                          </p>
                          <p className="text-sm text-[#45483d]">
                            {selectedPortfolio.startDate?.replace("-", "년 ")}월 - {selectedPortfolio.endDate?.replace("-", "년 ")}월
                            {selectedPortfolio.endDate}
                          </p>
                        </div>
                      )}

                      {/* 클라이언트 */}
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

                      {/* 업종 */}
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

                      {/* 목적별 */}
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

                      {/* 다른 포트폴리오 썸네일 */}
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
                                className={`flex items-center gap-3 p-2 rounded-xl text-left transition-colors w-full ${
                                  i === selectedIndex
                                    ? "bg-[#f5f4ec] ring-1 ring-[#4f6231]"
                                    : "hover:bg-[#f9f8f4]"
                                }`}
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
              {/* 대표 이미지 */}
              <img
                src={selectedPortfolio.imageUrl}
                alt={selectedPortfolio.description || "포트폴리오"}
                className="w-full h-auto block"
              />
              {/* 추가 이미지들 */}
              {selectedPortfolio.images &&
                selectedPortfolio.images.length > 0 &&
                selectedPortfolio.images.map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt={`포트폴리오 이미지 ${i + 1}`}
                    className="w-full h-auto block mt-1"
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
