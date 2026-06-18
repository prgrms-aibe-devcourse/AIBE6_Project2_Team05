"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedPortfolio =
    selectedIndex !== null ? portfolios[selectedIndex] : null;

  const parseHashtags = (text: string) => {
    const tags = text.match(/#[\w가-힣]+/g) || [];
    const plain = text.replace(/#[\w가-힣]+/g, "").trim();
    return { plain, tags };
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });
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

      {/* 포트폴리오 가로 슬라이드 */}
      <div className="relative">
        {portfolios.length > 3 && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 bg-white border border-[#efeee7] rounded-full shadow flex items-center justify-center hover:bg-[#f5f4ec] transition-colors"
          >
            <svg
              className="w-4 h-4 text-[#45483d]"
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
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {portfolios.map((portfolio, index) => {
            const { plain, tags } = parseHashtags(portfolio.description || "");
            return (
              <div
                key={portfolio.id}
                className="group cursor-pointer shrink-0"
                style={{ minWidth: "280px", width: "calc(33.333% - 8px)" }}
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
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 bg-white border border-[#efeee7] rounded-full shadow flex items-center justify-center hover:bg-[#f5f4ec] transition-colors"
          >
            <svg
              className="w-4 h-4 text-[#45483d]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

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
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden flex w-full"
            style={{ maxWidth: "960px", height: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 좌측: 정보 패널 */}
            <div className="w-80 shrink-0 border-r border-[#efeee7] overflow-y-auto flex flex-col">
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
