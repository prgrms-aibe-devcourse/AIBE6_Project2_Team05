"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AboutTab from "@/components/profile/AboutTab";
import PortfolioTab from "@/components/profile/PortfolioTab";
import ProfileErrorState from "@/components/profile/ProfileErrorState";
import ProfileLoadingState from "@/components/profile/ProfileLoadingState";
import ReviewTab from "@/components/profile/ReviewTab";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAccessToken } from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

interface FreelancerProfile {
  id: number;
  memberId: number;
  memberName: string;
  memberImageUrl: string;
  categoryId: number;
  categoryName: string;
  title: string;
  introduction: string;
  keywords: string;
  region: string;
  price: number;
  careerYears: number;
  averageRating: number;
  reviewCount: number;
  bookmarkCount: number;
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
  images?: { id: number; imageUrl: string }[];
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");

  const isOwner = profile?.memberId === currentMemberId;

  const handleBookmark = async () => {
    try {
      const res = await authFetch(`/api/bookmarks/${id}`, { method: "POST" });
      const data = await res.json();
      setBookmarked(data.bookmarked);
    } catch (err) {
      console.error("북마크 오류:", err);
    }
  };

  useEffect(() => {
    setIsLoggedIn(!!getAccessToken());

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getAccessToken();

        const [profileRes, portfolioRes, reviewRes, meRes] = await Promise.all([
          fetch(`/api/freelancers/${id}`),
          authFetch(`/api/freelancers/${id}/portfolios`),
          fetch(`/api/freelancers/${id}/reviews`),
          token ? authFetch(`/api/v1/members/me`) : Promise.resolve(null),
        ]);

        if (!profileRes.ok) throw new Error("프로필을 불러올 수 없습니다.");

        const profileData = await profileRes.json();
        const portfolioData = await portfolioRes.json();
        const reviewData = await reviewRes.json();

        setProfile(profileData);
        setProfileImageUrl(profileData.memberImageUrl || "");
        setPortfolios(portfolioData);
        setReviews(reviewData);

        if (meRes?.ok) {
          const meData = await meRes.json();
          setCurrentMemberId(meData.id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading) return <ProfileLoadingState />;
  if (error || !profile) return <ProfileErrorState error={error} />;

  const coverImageUrl =
    portfolios[0]?.imageUrl || "https://picsum.photos/seed/cover/1400/500";
  const keywords =
    profile.keywords
      ?.split(",")
      .map((k) => k.trim())
      .filter(Boolean) || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />

      {/* Cover Image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <Image src={coverImageUrl} alt="Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-16 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end gap-5 mb-6">
          {/* 프로필 사진 */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
            <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={
                  profileImageUrl || "https://picsum.photos/seed/elena/400/400"
                }
                alt={profile.memberName || profile.title}
                fill
                className="object-cover rounded-2xl"
              />
            </div>
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
                <p className="text-sm text-[#75786c] mt-0.5">
                  {profile.memberName}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 fill-current ${
                          i < Math.round(profile.averageRating)
                            ? "text-[#f59e0b]"
                            : "text-[#d1d5db]"
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-[#45483d] ml-1">
                      {profile.averageRating.toFixed(1)} ({profile.reviewCount}{" "}
                      리뷰)
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
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {keywords.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 bg-[#f5f4ec] text-[#4f6231] rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBookmark}
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
                {isOwner && (
                  <Link
                    href={`/mypage?tab=profile`}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "border-[#6C814C] text-[#6C814C] hover:bg-[#f5f4ec] rounded-xl px-6",
                    )}
                  >
                    프로필 수정
                  </Link>
                )}
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
            {["portfolio", "about", "reviews"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none px-5 py-3 text-sm font-medium text-[#75786c] data-[state=active]:text-[#4f6231] data-[state=active]:border-b-2 data-[state=active]:border-[#4f6231] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {tab === "portfolio"
                  ? "포트폴리오"
                  : tab === "about"
                    ? "전문가 정보"
                    : "리뷰"}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="portfolio" className="mt-0">
            <PortfolioTab
              portfolios={portfolios}
              isLoggedIn={isLoggedIn}
              profileId={id}
              introduction={profile.introduction}
            />
          </TabsContent>

          <TabsContent value="about" className="mt-0">
            <AboutTab profile={profile} reviewCount={profile.reviewCount} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <ReviewTab reviews={reviews} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="pb-16" />
      <Footer />
    </div>
  );
}
