"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORY } from "@/constants/category";
import { API_BASE_URL, createAuthHeaders } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type FreelancerProfile = {
  id: number;
  memberId: number;
  memberName: string;
  categoryId: number;
  title: string;
  introduction: string;
  portfolioImageUrl: string | null;
  region: string;
  price: number | null;
  careerYears: number;
  createdAt: string;
  updatedAt: string;
};

type FreelancerListResponse = {
  content: FreelancerProfile[];
  totalElements: number;
};

type BookmarkResponse = {
  id: number;
  freelancerProfileId: number;
  memberName: string;
  title: string;
  region: string;
  price: number | null;
  createdAt: string;
};

const SORT_OPTIONS = [
  { value: "ALL", label: "전체" },
  { value: "NEW", label: "최신순" },
  { value: "POPULAR", label: "인기순" },
];

const categories = Object.values(CATEGORY);

async function fetchFreelancers(params: {
  keyword: string;
  sortType: string;
  categoryId: number | null;
}): Promise<FreelancerListResponse> {
  const query = new URLSearchParams();
  if (params.keyword) query.append("keyword", params.keyword);
  if (params.sortType !== "ALL") query.append("sortType", params.sortType);
  if (params.categoryId !== null)
    query.append("categoryId", String(params.categoryId));

  const res = await fetch(
    `${API_BASE_URL}/api/freelancers?${query.toString()}`,
  );
  if (!res.ok) throw new Error("프리랜서 목록 조회 실패");
  return res.json();
}

async function fetchBookmarks(): Promise<BookmarkResponse[]> {
  const res = await fetch(`${API_BASE_URL}/api/bookmarks`, {
    headers: createAuthHeaders(),
  });
  if (!res.ok) throw new Error("북마크 조회 실패");
  return res.json();
}

function SkeletonCard() {
  return (
    <Card className="overflow-hidden border border-[#efeee7] rounded-2xl">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <CardContent className="p-4">
        <Skeleton className="h-4 w-3/4 mb-1" />
        <Skeleton className="h-3 w-1/2 mb-3" />
        <Skeleton className="h-3 w-1/3 mb-3" />
        <Skeleton className="h-4 w-1/4" />
      </CardContent>
    </Card>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    searchParams.get("categoryId")
      ? Number(searchParams.get("categoryId"))
      : null,
  );
  const [sortType, setSortType] = useState("ALL");
  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");
  const [submittedKeyword, setSubmittedKeyword] = useState(
    searchParams.get("keyword") ?? "",
  );

  useEffect(() => {
    const categoryId = searchParams.get("categoryId");
    const kw = searchParams.get("keyword") ?? "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedCategoryId(categoryId ? Number(categoryId) : null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKeyword(kw);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubmittedKeyword(kw);
  }, [searchParams]);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["freelancers", submittedKeyword, sortType, selectedCategoryId],
    queryFn: () =>
      fetchFreelancers({
        keyword: submittedKeyword,
        sortType,
        categoryId: selectedCategoryId,
      }),
    placeholderData: keepPreviousData,
  });

  const freelancers = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  const { data: bookmarkData } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
  });

  const bookmarked = new Set(
    bookmarkData?.map((b) => b.freelancerProfileId) ?? [],
  );

  const bookmarkMutation = useMutation({
    mutationFn: async (id: number) => {
      const headers = createAuthHeaders();
      if (!headers.Authorization) throw new Error("UNAUTHORIZED");
      const res = await fetch(`${API_BASE_URL}/api/bookmarks/${id}`, {
        method: "POST",
        headers,
      });
      if (!res.ok) throw new Error("북마크 API 실패");
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });
      const prev = queryClient.getQueryData<BookmarkResponse[]>(["bookmarks"]);

      queryClient.setQueryData<BookmarkResponse[]>(
        ["bookmarks"],
        (old = []) => {
          const exists = old.some((b) => b.freelancerProfileId === id);
          return exists
            ? old.filter((b) => b.freelancerProfileId !== id)
            : [...old, { freelancerProfileId: id } as BookmarkResponse];
        },
      );

      return { prev };
    },
    onError: (err, _id, context) => {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        router.push("/login");
        return;
      }
      if (context?.prev) {
        queryClient.setQueryData(["bookmarks"], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const handleSearch = () => setSubmittedKeyword(keyword);

  return (
    <div className="flex flex-col min-h-full bg-[#fbf9f2]">
      {/* Header */}
      <div className="bg-[#f5f4ec] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-display)] text-3xl font-semibold text-[#1b1c18] mb-2">
            전문가 탐색
          </h1>
          <p className="text-sm text-[#75786c]">
            당신의 특별한 기념일을 위한 엄선된 전문가들을 만나 보세요
          </p>
          <div className="mt-4 flex gap-2">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="이름 또는 서비스를 검색하세요"
              className="w-72 rounded-xl border-[#c5c8ba]"
            />
            <Button
              onClick={handleSearch}
              className="bg-[#4f6231] hover:bg-[#3d4c26] text-white rounded-xl"
            >
              검색
            </Button>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="border-b border-[#efeee7] bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategoryId === null
                  ? "bg-[#4f6231] text-white"
                  : "bg-[#f5f4ec] text-[#45483d] hover:bg-[#efeee7]"
              }`}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategoryId === category.id
                    ? "bg-[#4f6231] text-white"
                    : "bg-[#f5f4ec] text-[#45483d] hover:bg-[#efeee7]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 정렬 바 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#75786c]">
            총{" "}
            <span className="font-medium text-[#1b1c18]">{totalElements}</span>
            명
          </span>
          <Select
            value={sortType}
            onValueChange={(value) => setSortType(value ?? "ALL")}
          >
            <SelectTrigger className="w-32 rounded-xl border-[#c5c8ba]">
              <SelectValue>
                {
                  SORT_OPTIONS.find((option) => option.value === sortType)
                    ?.label
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              alignItemWithTrigger={false}
              side="bottom"
              sideOffset={5}
            >
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 프리랜서 목록 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : freelancers.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
            <p className="text-[#75786c]">등록된 전문가가 없습니다.</p>
            <Button
              variant="outline"
              onClick={() => {
                setKeyword("");
                setSubmittedKeyword("");
                setSelectedCategoryId(null);
              }}
              className="border-[#4f6231] text-[#4f6231]"
            >
              전체 보기
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5",
              "transition-opacity duration-300",
              isPlaceholderData && "opacity-50 pointer-events-none",
            )}
          >
            {freelancers.map((pro) => (
              <Link
                key={pro.id}
                href={`/profile/${pro.id}`}
                className="block animate-in fade-in duration-500"
              >
                <Card className="group overflow-hidden border border-[#efeee7] hover:shadow-[0px_4px_20px_rgba(108,129,76,0.1)] transition-all rounded-2xl cursor-pointer">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f4ec] flex items-center justify-center">
                    {pro.portfolioImageUrl ? (
                      <Image
                        src={pro.portfolioImageUrl}
                        alt={`${pro.memberName} 포트폴리오`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-[#75786c] text-sm">
                        이미지 없음
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        bookmarkMutation.mutate(pro.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <svg
                        className={`w-4 h-4 ${bookmarked.has(pro.id) ? "fill-[#6f5a55] text-[#6f5a55]" : "text-[#75786c]"}`}
                        fill={bookmarked.has(pro.id) ? "currentColor" : "none"}
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
                  </div>
                  <CardContent className="p-4">
                    <p className="font-semibold text-[#1b1c18] text-sm mb-0.5">
                      {pro.title}
                    </p>
                    <p className="text-xs text-[#75786c] mb-2">
                      {pro.memberName}
                    </p>
                    <div className="flex items-center gap-1 mb-3">
                      <svg
                        className="w-3 h-3 text-[#75786c]"
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
                      <span className="text-xs text-[#75786c]">
                        {pro.region}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-[#4f6231]">
                      {pro.price ? `₩${pro.price.toLocaleString()}~` : "협의"}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex min-h-full bg-[#fbf9f2]" />}>
      <SearchPageInner />
    </Suspense>
  );
}
