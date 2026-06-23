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
      <div className="grid grid-cols-3 gap-4">
        {visiblePortfolios.map((portfolio, index) => {
          const { plain, tags } = parseHashtags(portfolio.description || "");
          return (
            <div
              key={portfolio.id}
              className="group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedIndex(index)}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={portfolio.imageUrl}
                  alt={plain || "포트폴리오"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* 항상 보이는 그라디언트 텍스트 오버레이 */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-10 pb-3 px-3">
                  {plain && (
                    <p className="text-white text-sm font-semibold leading-tight line-clamp-2 drop-shadow">
                      {plain}
                    </p>
                  )}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs text-white/90 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-sm font-medium bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    자세히 보기
                  </span>
                </div>
              </div>
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
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="rounded-2xl overflow-hidden flex flex-col w-full shadow-2xl"
            style={{ maxWidth: "1000px", height: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상단 헤더 바 */}
            <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-[#efeee7] shrink-0">
              <button
                onClick={() => setSelectedIndex(null)}
                className="text-[#75786c] hover:text-[#1b1c18] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <span className="text-xs text-[#75786c]">
                {selectedIndex + 1} / {portfolios.length}
              </span>
              {/* 이전/다음 네비게이션 */}
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1); }}
                  disabled={selectedIndex === 0}
                  className="text-[#75786c] hover:text-[#1b1c18] transition-colors disabled:opacity-30"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); if (selectedIndex < portfolios.length - 1) setSelectedIndex(selectedIndex + 1); }}
                  disabled={selectedIndex >= portfolios.length - 1}
                  className="text-[#75786c] hover:text-[#1b1c18] transition-colors disabled:opacity-30"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 본문: 좌(텍스트) + 우(이미지) */}
            <div className="flex flex-1 min-h-0">
              {/* 좌측: 텍스트 정보 패널 */}
              <div className="w-80 shrink-0 bg-[#fafaf8] border-r border-[#efeee7] overflow-y-auto flex flex-col">
                <div className="p-6 flex flex-col gap-5">
                  {(() => {
                    const { plain, tags } = parseHashtags(
                      selectedPortfolio.description || "",
                    );
                    return (
                      <>
                        {/* 제목 */}
                        <h3
                          className="font-bold text-[#1b1c18] text-xl leading-snug break-keep"
                          style={{ wordBreak: "keep-all" }}
                        >
                          {plain || `포트폴리오 ${selectedIndex + 1}`}
                        </h3>

                        {/* 해시태그 */}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {tags.map((tag, i) => (
                              <span
                                key={i}
                                className="text-sm px-3 py-1.5 bg-[#f0f4eb] text-[#4f6231] rounded-full font-medium border border-[#d4e0c2]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="h-px bg-[#e5e3db]" />

                        {/* 메타데이터 - 각 항목 흰색 카드 */}
                        {(selectedPortfolio.startDate || selectedPortfolio.endDate) && (
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <p className="text-xs font-semibold text-[#75786c] uppercase tracking-wide mb-1.5">
                              참여 기간
                            </p>
                            <p className="text-sm font-semibold text-[#1b1c18]">
                              {selectedPortfolio.startDate?.replace(/-(\d{2})-(\d{2})$/, "년 $1월 $2일")}{" "}
                              —{" "}
                              {selectedPortfolio.endDate?.replace(/-(\d{2})-(\d{2})$/, "년 $1월 $2일")}
                            </p>
                          </div>
                        )}

                        {selectedPortfolio.client && (
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <p className="text-xs font-semibold text-[#75786c] uppercase tracking-wide mb-1.5">
                              클라이언트
                            </p>
                            <p className="text-sm font-semibold text-[#1b1c18]">
                              {selectedPortfolio.client}
                            </p>
                          </div>
                        )}

                        {selectedPortfolio.industry && (
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <p className="text-xs font-semibold text-[#75786c] uppercase tracking-wide mb-1.5">
                              업종
                            </p>
                            <span className="inline-block text-sm px-3 py-1 bg-[#f5f4ec] text-[#45483d] rounded-full border border-[#e2e1d9] mt-0.5">
                              {selectedPortfolio.industry}
                            </span>
                          </div>
                        )}

                        {selectedPortfolio.purpose && (
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <p className="text-xs font-semibold text-[#75786c] uppercase tracking-wide mb-1.5">
                              목적
                            </p>
                            <span className="inline-block text-sm px-3 py-1 bg-[#f5f4ec] text-[#45483d] rounded-full border border-[#e2e1d9] mt-0.5">
                              {selectedPortfolio.purpose}
                            </span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* 우측: 이미지 영역 */}
              <div className="flex-1 min-h-0 bg-[#f5f4ec] overflow-y-auto">
                <div className="p-4 flex flex-col gap-4">
                  <img
                    src={selectedPortfolio.imageUrl}
                    alt={selectedPortfolio.description || "포트폴리오"}
                    className="w-full h-auto rounded-xl block shadow-sm"
                  />
                  {selectedPortfolio.images?.map((img, i) => (
                    <img
                      key={i}
                      src={img.imageUrl}
                      alt={`포트폴리오 이미지 ${i + 1}`}
                      className="w-full h-auto rounded-xl block shadow-sm"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 하단: 다른 포트폴리오 썸네일 */}
            <div className="shrink-0 bg-white border-t border-[#efeee7] px-4 py-3">
              <p className="text-xs text-[#75786c] mb-2">다른 포트폴리오</p>
              <div
                className="flex gap-2.5 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "none" }}
              >
                {portfolios.map((p, i) => {
                  const { plain: t } = parseHashtags(p.description || "");
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedIndex(i)}
                      className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        i === selectedIndex
                          ? "border-[#4f6231] shadow-md"
                          : "border-transparent opacity-60 hover:opacity-100"
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
