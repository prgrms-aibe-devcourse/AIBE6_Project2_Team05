"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface FreelancerProfile {
  id: number;
  memberId: number;
  categoryId: number;
  categoryName: string;
  title: string;
  introduction: string;
  region: string;
  price: number;
  careerYears: number;
}

interface Portfolio {
  id: number;
  freelancerProfileId: number;
  imageUrl: string;
  description: string;
  sortOrder: number;
}

interface Review {
  id: number;
  memberId: number;
  memberName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [bookmarked, setBookmarked] = useState(false);
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileRes, portfolioRes, reviewRes] = await Promise.all([
          fetch(`/api/freelancers/${id}`),
          fetch(`/api/freelancers/${id}/portfolios`),
          fetch(`/api/freelancers/${id}/reviews`),
        ]);

        if (!profileRes.ok) throw new Error("프로필을 불러올 수 없습니다.");

        const profileData = await profileRes.json();
        const portfolioData = await portfolioRes.json();
        const reviewData = await reviewRes.json();

        setProfile(profileData);
        setPortfolios(portfolioData);
        setReviews(reviewData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#4f6231] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#75786c]">
              프로필을 불러오는 중입니다...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-[#1b1c18] mb-2">
              프로필을 찾을 수 없습니다
            </p>
            <p className="text-sm text-[#75786c] mb-6">{error}</p>
            <Link
              href="/search"
              className={cn(
                buttonVariants(),
                "bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl",
              )}
            >
              프리랜서 탐색하기
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />

      {/* Cover Image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src="https://picsum.photos/seed/cover/1400/500"
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-16 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end gap-5 mb-6">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg shrink-0">
            <Image
              src="https://picsum.photos/seed/elena/400/400"
              alt={profile.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Badge className="bg-[#f5f4ec] text-[#45483d] border-0 text-xs mb-2">
                  {profile.categoryName}
                </Badge>
                <h1 className="font-[var(--font-display)] text-2xl sm:text-3xl font-semibold text-[#1b1c18]">
                  {profile.title}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-[#f59e0b] fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-[#45483d] ml-1">
                      {reviews.length} 리뷰
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[#75786c]">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {profile.region}
                  </div>
                  {profile.price && (
                    <span className="text-sm font-semibold text-[#4f6231]">
                      ₩{profile.price.toLocaleString()}~
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    bookmarked
                      ? "border-[#6f5a55] bg-[#f6d9d3] text-[#6f5a55]"
                      : "border-[#c5c8ba] text-[#75786c] hover:border-[#6f5a55]"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={bookmarked ? "currentColor" : "none"}
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
                </button>
                <Link
                  href={`/reserve/${id}`}
                  className={cn(
                    buttonVariants(),
                    "bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl px-6",
                  )}
                >
                  예약하기
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="bg-transparent border-b border-[#efeee7] rounded-none p-0 h-auto gap-0 mb-8 w-full justify-start">
            {["portfolio", "reviews", "about"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none px-5 py-3 text-sm font-medium text-[#75786c] data-[state=active]:text-[#4f6231] data-[state=active]:border-b-2 data-[state=active]:border-[#4f6231] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {tab === "portfolio"
                  ? "포트폴리오"
                  : tab === "reviews"
                    ? "리뷰"
                    : "소개"}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="mt-0">
            {portfolios.length === 0 ? (
              <div className="text-center py-16 text-[#75786c]">
                <p>등록된 포트폴리오가 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {portfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden group"
                  >
                    <Image
                      src={portfolio.imageUrl}
                      alt={portfolio.description || "포트폴리오"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-0">
            {reviews.length === 0 ? (
              <div className="text-center py-16 text-[#75786c]">
                <p>아직 리뷰가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-6 max-w-2xl">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-2xl p-6 border border-[#efeee7]"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarFallback className="bg-[#d3ebac] text-[#4f6231] font-semibold text-sm">
                          {review.memberName.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-[#1b1c18] text-sm">
                          {review.memberName}
                        </p>
                        <p className="text-xs text-[#75786c]">
                          {review.createdAt.slice(0, 10)}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 ml-auto">
                        {[...Array(review.rating)].map((_, j) => (
                          <svg
                            key={j}
                            className="w-3.5 h-3.5 text-[#f59e0b] fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#45483d] leading-relaxed">
                      {review.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="mt-0">
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
                    {reviews.length}개
                  </p>
                  <p className="text-xs text-[#75786c]">리뷰</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="pb-16" />
      <Footer />
    </div>
  );
}
