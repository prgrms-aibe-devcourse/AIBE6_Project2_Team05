"use client";

import { useUser } from "@/contexts/UserContext";
import { getRoleTheme, ROLE_LABEL } from "@/lib/roleTheme";
import Image from "next/image";
import Link from "next/link";

interface MySidebarProps {
  onLogout: () => void;
}

export default function MySidebar({ onLogout }: MySidebarProps) {
  const { user } = useUser();

  const name = user?.name ?? "";
  const email = user?.email ?? "";
  const profileImg = user?.profileImageUrl ?? null;
  const role = user?.role ?? null;
  const freelancerProfileId = user?.freelancerProfileId ?? null;
  const isFreelancerWithoutProfile =
    role === "FREELANCER" && !freelancerProfileId;
  const { badgeClass, avatarBgClass, avatarTextClass } = getRoleTheme(role);

  const allMenu = [
    { icon: "👤", label: "회원 정보 수정", href: "/mypage?tab=info" },
      { icon: "📅", label: role === "FREELANCER" ? "예약 관리" : "예약 현황", href: "/reservations" },
    { icon: "🔖", label: "관심 프리랜서", href: "/bookmarks" },
    { icon: "⭐", label: "리뷰 내역", href: "/mypage?tab=reviews" },
    ...(role !== "FREELANCER"
      ? [{ icon: "📝", label: "내 구인글", href: "/mypage/posts" }]
      : []),
    ...(role !== "CLIENT"
      ? [{ icon: "📩", label: "내 제안서", href: "/mypage/proposals" }]
      : []),
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
    ...(isFreelancerWithoutProfile
      ? [
          {
            icon: "✨",
            label: "프로필 등록하기",
            href: "/freelancer/profile/manage",
          },
        ]
      : []),
  ];

  const profileContent = (
    <div className="flex items-center gap-3">
      <div
        className={`relative w-12 h-12 rounded-full overflow-hidden ${avatarBgClass}`}
      >
        {profileImg ? (
          <Image
            src={profileImg}
            alt=""
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center font-bold text-lg ${avatarTextClass}`}
          >
            {name.charAt(0)}
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center gap-1">
          <p className="font-semibold text-[#1b1c18] text-sm">{name}</p>
          {role === "FREELANCER" && freelancerProfileId && (
            <svg
              className="w-3 h-3 text-[#4f6231]"
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
          )}
        </div>
        <p className="text-xs text-[#75786c]">{email}</p>
        {role && (
          <span
            className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeClass}`}
          >
            {ROLE_LABEL[role]}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <aside className="lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-[#efeee7] overflow-hidden">
        <div className="p-5 border-b border-[#efeee7]">
          {role === "FREELANCER" && freelancerProfileId ? (
            <Link
              href={`/profile/${freelancerProfileId}`}
              className="block hover:opacity-80 transition-opacity"
            >
              {profileContent}
            </Link>
          ) : (
            <div>
              {profileContent}
              {isFreelancerWithoutProfile && (
                <div className="mt-3 rounded-xl bg-[#f5f4ec] px-3 py-2.5">
                  <p className="text-xs text-[#75786c] leading-relaxed">
                    프로필 등록 후 내 페이지로 이동할 수 있어요.
                  </p>
                  <Link
                    href="/freelancer/profile/manage"
                    className="mt-1.5 inline-block text-xs font-semibold text-[#4f6231] hover:underline"
                  >
                    프로필 등록하기 →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        <nav className="p-2">
          {allMenu.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors text-[#45483d] hover:bg-[#f5f4ec] hover:text-[#4f6231]"
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
