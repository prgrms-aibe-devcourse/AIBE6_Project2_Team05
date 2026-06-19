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
import { Badge } from "@/components/ui/badge";

const categories = [
  { icon: "📸", label: "스냅 작가", href: "/search?category=photographer" },
  { icon: "💐", label: "플라워", href: "/search?category=flower" },
  { icon: "🏛️", label: "베뉴", href: "/search?category=venue" },
  { icon: "🍽️", label: "케이터링", href: "/search?category=catering" },
  { icon: "🎵", label: "뮤직", href: "/search?category=music" },
  { icon: "📋", label: "플래너", href: "/search?category=planning" },
];

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

const inspirations = [
  { title: "Provençal Minimal Garden", img: "https://picsum.photos/seed/provence/600/800" },
  { title: "Dining Aesthetics",        img: "https://picsum.photos/seed/dining/600/800" },
  { title: "Urban Romantic",           img: "https://picsum.photos/seed/urban/600/800" },
  { title: "Coastal Twilight",         img: "https://picsum.photos/seed/coastal/600/800" },
];

const communityRequests = [
  {
    title: "Lake Como 플로럴 작업 섭외 중",
    author: "Sophie L.",
    badge: "긴급",
    excerpt: "이탈리아 레이크 코모에서 6월 웨딩을 앞두고 있어요. 현지에서 작업 가능한 플로리스트를 찾고 있습니다.",
  },
  {
    title: "교토 필름 포토그래피 문의",
    author: "James K.",
    badge: null,
    excerpt: "교토 전통 정원에서 필름 카메라로 촬영해주실 작가를 찾습니다. 4월 봄 웨딩 예정입니다.",
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
  return (
    <div className="flex flex-col min-h-full bg-[#fbf9f2]">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f5f4ec] to-[#fbf9f2] pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium tracking-widest uppercase text-[#6f5a55] mb-4">
            Curated for Modern Couples
          </p>
          <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1b1c18] leading-tight mb-6">
            당신의 비전을 진심으로
            <br />
            이해하는 웨딩 전문가를 만나세요
          </h1>
          <p className="text-base text-[#45483d] mb-10 max-w-xl mx-auto">
            전국 최고의 스냅 작가, 플래너, 플로리스트, 베뉴를 한 곳에서 만나보세요.
          </p>
          <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(108,129,76,0.1)] p-3 max-w-3xl mx-auto flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-[#f5f4ec] rounded-xl">
              <svg className="w-4 h-4 text-[#75786c] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input className="flex-1 bg-transparent text-sm text-[#1b1c18] placeholder:text-[#75786c] outline-none" placeholder="지역 선택" />
            </div>
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-[#f5f4ec] rounded-xl">
              <svg className="w-4 h-4 text-[#75786c] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input className="flex-1 bg-transparent text-sm text-[#1b1c18] placeholder:text-[#75786c] outline-none" placeholder="날짜 선택" />
            </div>
            <select className="flex-1 px-4 py-2 bg-[#f5f4ec] rounded-xl text-sm text-[#45483d] outline-none border-0 cursor-pointer">
              <option value="">카테고리</option>
              <option>스냅 작가</option>
              <option>베뉴</option>
              <option>플라워</option>
              <option>케이터링</option>
              <option>뮤직</option>
              <option>플래너</option>
            </select>
            <Link
              href="/search"
              className={cn(buttonVariants(), "bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl px-6 shrink-0")}
            >
              웨딩 전문가 찾기
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-[#efeee7] hover:border-[#4f6231] hover:shadow-[0px_4px_20px_rgba(108,129,76,0.1)] transition-all group"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs font-medium text-[#45483d] group-hover:text-[#4f6231] text-center">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

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
              width: '50%',
              height: '120%',
              bottom: '-10%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'radial-gradient(ellipse, #e8c9a0 0%, #f0d4b0 30%, transparent 70%)',
              filter: 'blur(64px)',
              opacity: 0.7,
              zIndex: 0,
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
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 0,
                modifier: 1,
                slideShadows: false,
              }}
              navigation={{ prevEl: ".feat-prev", nextEl: ".feat-next" }}
              onProgress={(swiper) => calcArc(swiper)}
              onResize={(swiper) => calcArc(swiper)}
              onSetTransition={(swiper, speed) => {
                swiper.slides.forEach((slide) => {
                  const innerEl = slide.querySelector(".card-inner") as HTMLElement;
                  if (innerEl) {
                    innerEl.style.transitionDuration = `${speed}ms`;
                  }
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

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-[#6f5a55] mb-2">Gallery</p>
            <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[#1b1c18]">웨딩 인스피레이션</h2>
          </div>
          <Link href="/community" className="text-sm text-[#4f6231] font-medium hover:underline">
            모든 스토리 보기 →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {inspirations.map((item, i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer">
              <Image
                src={item.img}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-white font-[var(--font-display)] text-sm font-medium">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-[#f5f4ec]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-[#6f5a55] mb-2">Community</p>
              <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[#1b1c18]">최근 커뮤니티 요청</h2>
            </div>
            <Link href="/community" className="text-sm text-[#4f6231] font-medium hover:underline">
              커뮤니티 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communityRequests.map((req, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#efeee7] hover:shadow-[0px_4px_20px_rgba(108,129,76,0.08)] transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-[#1b1c18] text-base leading-snug">{req.title}</h3>
                  {req.badge && (
                    <Badge className="bg-[#f6d9d3] text-[#6f5a55] border-0 text-xs ml-2 shrink-0">{req.badge}</Badge>
                  )}
                </div>
                <p className="text-sm text-[#75786c] mb-1">{req.author}</p>
                <p className="text-sm text-[#45483d] leading-relaxed mb-4">{req.excerpt}</p>
                <Link href="/community" className="text-sm text-[#4f6231] font-medium hover:underline">
                  자세히 보기 →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}