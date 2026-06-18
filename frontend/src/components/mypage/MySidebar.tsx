"use client";

import Image from "next/image";
import Link from "next/link";

type MemberRole = "CLIENT" | "FREELANCER";

const ROLE_LABEL: Record<MemberRole, string> = {
  CLIENT: "예비부부",
  FREELANCER: "프리랜서",
};

interface MySidebarProps {
  name: string;
  email: string;
  profileImg: string | null;
  role: MemberRole | null;
  freelancerProfileId?: number | null;
  activeTab?: string;
  onLogout: () => void;
}

export default function MySidebar({
  name,
  email,
  profileImg,
  role,
  freelancerProfileId,
  activeTab,
  onLogout,
}: MySidebarProps) {
  const allMenu = [
    { icon: "👤", label: "회원 정보 수정", href: "/mypage?tab=info" },
    { icon: "📅", label: "예약 내역", href: "/reservations" },
    { icon: "🔖", label: "관심 프리랜서", href: "/bookmarks" },
    { icon: "⭐", label: "리뷰 내역", href: "/mypage?tab=reviews" },
    { icon: "📝", label: "내 게시물", href: "/mypage/posts" },
    { icon: "📩", label: "내 제안서", href: "/mypage/proposals" },
    ...(role === "FREELANCER" && freelancerProfileId
      ? [
          { icon: "🎨", label: "프로필 수정", href: "/mypage?tab=profile" },
          {
            icon: "🖼️",
            label: "포트폴리오 수정",
            href: "/mypage?tab=portfolio",
          },
        ]
      : []),
  ];

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
              {role && (
                <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#e8f5d0] text-[#4f6231]">
                  {ROLE_LABEL[role]}
                </span>
              )}
            </div>
          </div>
        </div>
        <nav className="p-2">
          {allMenu.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors text-[#45483d] hover:bg-[#f5f4ec] hover:text-[#4f6231] ${
                activeTab && item.href.includes(`tab=${activeTab}`)
                  ? "bg-[#f5f4ec] text-[#4f6231] font-medium"
                  : ""
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
