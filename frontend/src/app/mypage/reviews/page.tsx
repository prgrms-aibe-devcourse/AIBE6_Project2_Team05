"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { API_BASE_URL, getAccessToken } from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Review {
  id: number;
  memberId: number;
  memberName: string;
  freelancerProfileId: number;
  rating: number;
  content: string;
  createdAt: string;
}

export default function MyReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!getAccessToken()) {
      router.push("/login");
      return;
    }

    const fetchReviews = async () => {
      try {
        const res = await authFetch(`${API_BASE_URL}/api/v1/reviews/me`);
        const data = await res.json();
        setReviews(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchReviews();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf9f2] text-[#45483d]">
        불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-[var(--font-display)] text-3xl font-semibold text-[#1b1c18] mb-2">
          리뷰 내역
        </h1>
        <p className="text-sm text-[#75786c] mb-8">
          내가 작성한 리뷰 목록입니다
        </p>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-[#efeee7] p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 fill-current ${i < review.rating ? "text-[#f59e0b]" : "text-[#d1d5db]"}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-[#45483d] ml-1">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#75786c]">
                    {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <p className="text-sm text-[#45483d] leading-relaxed mb-4">
                  {review.content}
                </p>
                <Link
                  href={`/profile/${review.freelancerProfileId}`}
                  className="text-xs text-[#4f6231] hover:underline"
                >
                  프리랜서 프로필 보기 →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#f5f4ec] flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#75786c]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <p className="text-[#75786c] text-sm">작성한 리뷰가 없습니다</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
