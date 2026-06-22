"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

interface PortfolioTabProps {
  portfolios: Portfolio[];
  isLoggedIn: boolean;
  profileId: string;
  introduction?: string;
}

export default function PortfolioTab({
  portfolios,
  isLoggedIn,
  profileId,
  introduction,
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

  const visiblePortfolios = portfolios.slice(0, 3);

  return (
    <div>
      {/* 포트폴리오 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[#1b1c18] text-base">
          포트폴리오 ({portfolios.length})
        </h2>
        <Link
          href={`/profile/${profileId}/portfolios`}
          className="text-sm text-[#6C814C] hover:underline font-medium"
        >
          전체보기
        </Link>
      </div>

      {/* 대표 3개 그리드 */}
      <div className="grid grid-cols-3 gap-3">
        {visiblePortfolios.map((portfolio, index) => {
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

      {portfolios.length > 3 && (
        <div className="text-center mt-4">
          <Link
            href={`/profile/${profileId}/portfolios`}
            className="inline-block text-sm text-[#4f6231] hover:underline font-medium"
          >
            포트폴리오 {portfolios.length}개 전체보기 →
          </Link>
        </div>
      )}

      {!isLoggedIn && portfolios.length >= 3 && (
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

      {/* 서비스 설명 */}
      {introduction && (
        <div className="mt-8 border-t border-[#efeee7] pt-8">
          <h2 className="font-semibold text-[#1b1c18] text-base mb-4">
            서비스 설명
          </h2>
          <div className="bg-white rounded-2xl border border-[#efeee7] p-6">
            <p className="text-sm text-[#45483d] leading-relaxed whitespace-pre-wrap">
              {introduction}
            </p>
          </div>
        </div>
      )}

      {/* 팝업 */}
      {selectedPortfolio && selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden flex flex-col w-full"
            style={{ maxWidth: "960px", height: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상단: 정보 패널 + 이미지 */}
            <div className="flex flex-1 min-h-0">
              {/* 좌측: 정보 패널 */}
              <div className="w-72 shrink-0 border-r border-[#efeee7] flex flex-col overflow-y-auto">
                {/* 헤더 */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#efeee7] sticky top-0 bg-white z-10 shrink-0">
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

                {/* 상세 정보 */}
                <div className="p-5 flex flex-col gap-4">
                  {(() => {
                    const { plain, tags } = parseHashtags(
                      selectedPortfolio.description || "",
                    );
                    return (
                      <>
                        <h3
                          className="font-semibold text-[#1b1c18] text-base leading-snug break-keep"
                          style={{ wordBreak: "keep-all" }}
                        >
                          {plain || `포트폴리오 ${selectedIndex + 1}`}
                        </h3>

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

                        {(selectedPortfolio.startDate ||
                          selectedPortfolio.endDate) && (
                          <div>
                            <p className="text-xs font-semibold text-[#1b1c18] mb-1">
                              참여 기간
                            </p>
                            <p className="text-sm text-[#45483d]">
                              {selectedPortfolio.startDate?.replace(
                                /-(\d{2})-(\d{2})$/,
                                "년 $1월 $2일",
                              )}{" "}
                              -{" "}
                              {selectedPortfolio.endDate?.replace(
                                /-(\d{2})-(\d{2})$/,
                                "년 $1월 $2일",
                              )}
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
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* 우측: 이미지 */}
              <div className="flex-1 overflow-y-auto bg-[#f8f7f2]">
                {!selectedPortfolio.images ||
                selectedPortfolio.images.length === 0 ? (
                  // 1장: 세로 중앙 정렬
                  <div className="min-h-full flex items-center">
                    <img
                      src={selectedPortfolio.imageUrl}
                      alt={selectedPortfolio.description || "포트폴리오"}
                      className="w-full h-auto block"
                    />
                  </div>
                ) : (
                  // 여러 장: 위에서부터 쌓기
                  <>
                    <img
                      src={selectedPortfolio.imageUrl}
                      alt={selectedPortfolio.description || "포트폴리오"}
                      className="w-full h-auto block"
                    />
                    {selectedPortfolio.images.map((img, i) => (
                      <div key={i}>
                        <div className="h-2 bg-[#efeee7]" />
                        <img
                          src={img.imageUrl}
                          alt={`포트폴리오 이미지 ${i + 1}`}
                          className="w-full h-auto block"
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* 하단: 다른 포트폴리오 가로 스크롤 */}
            <div className="shrink-0 border-t border-[#efeee7] bg-white px-4 py-3">
              <p className="text-xs text-[#75786c] mb-2">다른 포트폴리오</p>
              <div
                className="flex gap-2 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "none" }}
              >
                {portfolios.map((p, i) => {
                  const { plain: t } = parseHashtags(p.description || "");
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedIndex(i)}
                      className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        i === selectedIndex
                          ? "border-[#4f6231]"
                          : "border-transparent hover:border-[#c5c8ba]"
                      }`}
                    >
                      <Image
                        src={p.imageUrl}
                        alt={t || "포트폴리오"}
                        fill
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
