"use client";

import { Navigation, EffectCoverflow, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Search, MessageSquare, CalendarCheck, Star, FileText, Users, Bot } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const featured = [
  { id: "1",  name: "Julian Moore",  title: "에디토리얼 포토그래퍼", rating: 4.9, reviews: 128, price: "₩2,400,000~", img: "https://picsum.photos/seed/julian/400/400" },
  { id: "2",  name: "Arlo Sterling", title: "보태니컬 아티스트",      rating: 4.8, reviews: 96,  price: "₩1,200,000~", img: "https://picsum.photos/seed/arlo/400/400" },
  { id: "3",  name: "Evelyn Barnes", title: "수석 플래너",            rating: 5.0, reviews: 214, price: "₩3,800,000~", img: "https://picsum.photos/seed/evelyn/400/400" },
  { id: "4",  name: "Marcus Thorn",  title: "컬리너리 아키텍트",      rating: 4.7, reviews: 87,  price: "커스텀 견적",   img: "https://picsum.photos/seed/marcus/400/400" },
  { id: "5",  name: "Sophia Chen",   title: "웨딩 플로리스트",        rating: 4.9, reviews: 152, price: "₩800,000~",   img: "https://picsum.photos/seed/sophia/400/400" },
  { id: "6",  name: "Lucas Park",    title: "시네마틱 영상 감독",      rating: 4.8, reviews: 73,  price: "₩3,200,000~", img: "https://picsum.photos/seed/lucas/400/400" },
  { id: "7",  name: "Emma Wilson",   title: "브라이덜 메이크업",       rating: 4.9, reviews: 201, price: "₩500,000~",   img: "https://picsum.photos/seed/emma/400/400" },
  { id: "8",  name: "James Kim",     title: "웨딩 밴드 리더",          rating: 4.7, reviews: 64,  price: "₩2,000,000~", img: "https://picsum.photos/seed/james/400/400" },
  { id: "9",  name: "Olivia Park",   title: "드레스 디자이너",         rating: 5.0, reviews: 178, price: "₩3,500,000~", img: "https://picsum.photos/seed/olivia/400/400" },
  { id: "10", name: "Daniel Lee",    title: "웨딩 케이크 아티스트",    rating: 4.8, reviews: 92,  price: "₩800,000~",   img: "https://picsum.photos/seed/daniel/400/400" },
  { id: "11", name: "Hana Yoon",     title: "한복 스타일리스트",       rating: 4.9, reviews: 110, price: "₩600,000~",   img: "https://picsum.photos/seed/hana/400/400" },
  { id: "12", name: "Ethan Rowe",    title: "야외 세리머니 플래너",    rating: 4.8, reviews: 88,  price: "₩2,800,000~", img: "https://picsum.photos/seed/ethan/400/400" },
];

const platformValues = [
  {
    icon: <Search className="w-8 h-8 text-[#4f6231]" />,
    title: "전문가를 한 곳에서",
    desc: "스냅 작가부터 플래너까지\n키워드 검색으로 바로 비교하세요",
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-[#4f6231]" />,
    title: "견적 문의, 바로 여기서",
    desc: "AI 챗봇으로 사전 견적을 받고\n원하는 전문가에게 바로 연결하세요",
  },
  {
    icon: <CalendarCheck className="w-8 h-8 text-[#4f6231]" />,
    title: "예약까지 한 번에",
    desc: "날짜 조율부터 예약 확정까지\n플랫폼 안에서 모두 완결됩니다",
  },
  {
    icon: <Star className="w-8 h-8 text-[#4f6231]" />,
    title: "검증된 포트폴리오",
    desc: "실제 작업물과 리뷰로 확인하고\n믿고 맡길 수 있는 전문가를 선택하세요",
  },
];

const platformFeatures = [
  {
    bg: "#e8edd6",
    iconBg: "#4f6231",
    icon: <FileText className="w-8 h-8 text-white" />,
    title: "프리랜서가 나를 찾아옵니다",
    desc: "원하는 조건과 예산을 올리면\n관심 있는 프리랜서가 직접 제안서를 보내 드려요.\n여러 제안을 비교하고 최적의 전문가를 선택하세요.",
    cta: "구인글 올리기",
    href: "/jobs",
  },
  {
    bg: "#fdf3e7",
    iconBg: "#b07d4a",
    icon: <Users className="w-8 h-8 text-white" />,
    title: "웨딩 후기와 꿀팁을 나눠요",
    desc: "실제 결혼을 준비한 예비부부들의\n생생한 후기와 알짜 꿀팁을 한 곳에서 만나 보세요.",
    cta: "커뮤니티 보기",
    href: "/community",
  },
  {
    bg: "#e6ede3",
    iconBg: "#3d6b5e",
    icon: <Bot className="w-8 h-8 text-white" />,
    title: "AI로 사전 견적을 받아 보세요",
    desc: "원하는 서비스와 예산을 입력하면\nAI가 맞춤 견적을 먼저 제안해드려요.\n견적 후 바로 전문가 탐색까지 연결됩니다.",
    cta: "전문가 탐색하기",
    href: "/search",
  },
];

const calcArc = (swiper: any) => {
  const BASE_VW = 1280;
  const depth = (BASE_VW / 5) * 0.03;
  const lift = 20;

  swiper.slides.forEach((slide: any) => {
    const progress = slide.progress;
    const translateY = progress * progress * depth - lift * Math.max(0, 1 - Math.abs(progress));
    const rotate = progress * -3.5;
    const innerEl = slide.querySelector(".card-inner") as HTMLElement;
    if (innerEl) {
      innerEl.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
    }
  });
};

export default function HomePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (keyword.trim()) {
      router.push(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#fbf9f2]">

      {/* 히어로 섹션 */}
      <section className="bg-[#fbf9f2] pt-16 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-full max-w-2xl">
              <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl font-semibold text-[#1b1c18] leading-tight mb-8">
                설렘부터 완성까지,<br />
                <span className="text-[#4f6231]">딱 맞는 웨딩 전문가</span>를<br />
                찾아보세요
              </h1>

              {/* 검색바 */}
              <div className="flex items-center gap-2 bg-white rounded-2xl shadow-[0px_4px_20px_rgba(108,129,76,0.12)] p-2 mb-6">
                <div className="flex-1 flex items-center gap-2 px-4 py-2">
                  <svg className="w-5 h-5 text-[#75786c] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 bg-transparent text-sm text-[#1b1c18] placeholder:text-[#75786c] outline-none"
                    placeholder="어떤 웨딩 전문가가 필요하세요?"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className={cn(buttonVariants(), "bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl px-6 shrink-0")}
                >
                  전문가 찾기
                </button>
              </div>

              {/* 빠른 카테고리 태그 */}
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { label: "웨딩 사진작가",   href: "/search?categoryId=1" },
                  { label: "웨딩 영상",       href: "/search?categoryId=2" },
                  { label: "헤어·메이크업",   href: "/search?categoryId=3" },
                  { label: "웨딩 플로리스트", href: "/search?categoryId=4" },
                  { label: "웨딩 플래너",     href: "/search?categoryId=5" },
                  { label: "사회자",          href: "/search?categoryId=9" },
                ].map((tag) => (
                  <Link
                    key={tag.label}
                    href={tag.href}
                    className="text-xs font-medium px-4 py-2 rounded-full bg-white border border-[#dddcd4] text-[#45483d] hover:border-[#4f6231] hover:text-[#4f6231] transition-colors"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>

            

          </div>
        </div>
      </section>

      {/* 인기 전문가 캐러셀 섹션 */}
      <section className="py-20 bg-white overflow-hidden relative">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#f5f4ec] rounded-t-[100px] -z-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-semibold text-[#1b1c18]">
            이번 달 가장 사랑받은 <span className="text-[#4f6231]">웨딩 전문가</span>
          </h2>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div style={{ height: 'clamp(240px, 32vw, 440px)' }} className="relative">
            <div
              className="absolute pointer-events-none"
              style={{
                width: '50%', height: '120%', bottom: '-10%', left: '50%',
                transform: 'translateX(-50%)',
                background: 'radial-gradient(ellipse, #e8c9a0 0%, #f0d4b0 30%, transparent 70%)',
                filter: 'blur(64px)', opacity: 0.7, zIndex: 0,
              }}
            />
            <Swiper
              modules={[Navigation, EffectCoverflow, Autoplay]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              initialSlide={Math.floor(featured.length / 2)}
              spaceBetween={16}
              breakpoints={{
                0:    { slidesPerView: 3 },
                640:  { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
              }}
              coverflowEffect={{ rotate: 0, stretch: 0, depth: 0, modifier: 1, slideShadows: false }}
              navigation={{ prevEl: ".feat-prev", nextEl: ".feat-next" }}
              onProgress={(swiper) => calcArc(swiper)}
              onResize={(swiper) => calcArc(swiper)}
              onSetTransition={(swiper, speed) => {
                swiper.slides.forEach((slide) => {
                  const innerEl = slide.querySelector(".card-inner") as HTMLElement;
                  if (innerEl) innerEl.style.transitionDuration = `${speed}ms`;
                });
              }}
              className="w-full !overflow-visible h-full"
              style={{ position: 'relative', zIndex: 1 }}
            >
              {featured.map((pro, i) => (
                <SwiperSlide key={i} className="!flex !items-center !overflow-visible">
                  {({ isActive }) => (
                    <div className="relative w-full">
                      <div className="card-inner transition-all duration-500 origin-center w-full">
                        <Link href={`/profile/${pro.id}`} className="group block">
                          <div
                            className="relative overflow-hidden rounded-2xl transition-all duration-500"
                            style={{ aspectRatio: isActive ? '3/4' : '1/1' }}
                          >
                            <Image
                              src={pro.img}
                              alt={pro.name}
                              fill
                              sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                              loading={i === 0 ? "eager" : "lazy"}
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {isActive && (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                  <p className="text-[#f59e0b] text-xs font-medium mb-1">{pro.title}</p>
                                  <h3 className="text-white font-bold text-base mb-1">{pro.name}</h3>
                                  <p className="text-white/80 text-xs">{pro.price}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </Link>
                        {!isActive && (
                          <div className="mt-2 text-center">
                            <p className="text-[#75786c] text-xs mb-0.5 truncate">{pro.title}</p>
                            <h3 className="text-[#1b1c18] font-semibold text-xs sm:text-sm truncate">{pro.name}</h3>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="flex items-center justify-center gap-8 mt-1">
            <button className="feat-prev p-2 rounded-full border border-[#1b1c18] hover:bg-[#1b1c18]/5 transition-colors">
              <svg width="32" height="16" viewBox="0 0 48 24" fill="none">
                <line x1="48" y1="12" x2="8" y2="12" stroke="#1b1c18" strokeWidth="1.5" />
                <polyline points="20,2 8,12 20,22" fill="none" stroke="#1b1c18" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="feat-next p-2 rounded-full border border-[#1b1c18] hover:bg-[#1b1c18]/5 transition-colors">
              <svg width="32" height="16" viewBox="0 0 48 24" fill="none">
                <line x1="0" y1="12" x2="40" y2="12" stroke="#1b1c18" strokeWidth="1.5" />
                <polyline points="28,2 40,12 28,22" fill="none" stroke="#1b1c18" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* 플랫폼 가치 섹션 */}
      <section className="py-20 bg-[#fbf9f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-semibold text-[#1b1c18]">
              쉽고, 믿을 수 있는 <span className="text-[#4f6231]">웨딩 준비</span>
            </h2>
            <p className="mt-4 text-sm text-[#75786c]">
              Wedge가 처음부터 끝까지 함께합니다
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformValues.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-5 p-8 rounded-2xl bg-white border border-[#efeee7] hover:border-[#4f6231] hover:shadow-[0px_4px_20px_rgba(79,98,49,0.08)] transition-all"
              >
                <div className="w-20 h-20 rounded-full bg-[#f0f3eb] flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1b1c18] text-base mb-2">{item.title}</h3>
                  <p className="text-sm text-[#75786c] leading-relaxed whitespace-pre-line">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedge 활용 섹션 */}
      <section className="py-20 bg-[#fbf9f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-semibold text-[#1b1c18]">
              결혼 준비, 이렇게 하면 더 쉬워요
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platformFeatures.map((feat, i) => (
              <div key={i} className="flex flex-col rounded-2xl overflow-hidden bg-white border border-[#efeee7] hover:shadow-[0px_8px_30px_rgba(79,98,49,0.1)] transition-all group">
                <div
                  className="relative h-48 flex items-center justify-center"
                  style={{ backgroundColor: feat.bg }}
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundColor: feat.iconBg }}
                  >
                    {feat.icon}
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-6 gap-3">
                  <h3 className="font-semibold text-[#1b1c18] text-lg leading-snug">{feat.title}</h3>
                  <p className="text-sm text-[#75786c] leading-relaxed whitespace-pre-line flex-1">{feat.desc}</p>
                  <Link
                    href={feat.href}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#4f6231] border border-[#4f6231] rounded-lg px-4 py-2 hover:bg-[#4f6231] hover:text-white transition-colors w-fit"
                  >
                    {feat.cta} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}