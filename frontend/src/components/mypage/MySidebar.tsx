"use client";

import Image from "next/image";
import Link from "next/link";

const sidebarMenu = [
  { icon: "👤", label: "회원 정보 수정", href: "/mypage", active: true },
  { icon: "📅", label: "예약 내역", href: "/reservations", active: false },
  { icon: "🔖", label: "관심 프리랜서", href: "/bookmarks", active: false },
  { icon: "⭐", label: "리뷰 내역", href: "/mypage/reviews", active: false },
  { icon: "📝", label: "내 게시물", href: "/mypage/posts", active: false },
];

interface MySidebarProps {
  name: string;
  email: string;
  profileImg: string | null;
  onLogout: () => void;
}

export default function MySidebar({
  name,
  email,
  profileImg,
  onLogout,
}: MySidebarProps) {
  return (
    <aside className="lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-[#efeee7] overflow-hidden">
        <div className="p-5 border-b border-[#efeee7]">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#d3ebac]">
              {profileImg ? (
                <Image
                  src={profileImg}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#4f6231] font-bold text-lg">
                  {name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-[#1b1c18] text-sm">{name}</p>
              <p className="text-xs text-[#75786c]">{email}</p>
            </div>
          </div>
        </div>
        <nav className="p-2">
          {sidebarMenu.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                item.active
                  ? "bg-[#f5f4ec] text-[#4f6231] font-medium"
                  : "text-[#45483d] hover:bg-[#f5f4ec] hover:text-[#4f6231]"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-[#efeee7]">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#75786c] hover:bg-[#f5f4ec] hover:text-[#45483d] w-full transition-colors"
          >
            <span>🚪</span>
            로그아웃
          </button>
        </div>
      </div>
    </aside>
  );
}
