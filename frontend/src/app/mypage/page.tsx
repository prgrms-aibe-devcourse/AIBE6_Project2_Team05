"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL, clearAccessToken, createAuthHeaders, getAccessToken } from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";

const sidebarMenu = [
  { icon: "👤", label: "회원 정보 수정", href: "/mypage", active: true },
  { icon: "📅", label: "예약 내역", href: "/reservations", active: false },
  { icon: "🔖", label: "관심 프리랜서", href: "/bookmarks", active: false },
  { icon: "⭐", label: "리뷰 내역", href: "/mypage/reviews", active: false },
  { icon: "📝", label: "내 게시물", href: "/mypage/posts", active: false },
];

export default function MyPage() {
  const router = useRouter();
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchMyInfo = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/api/v1/members/me`);

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message ?? "회원 정보를 불러오지 못했습니다.");
        }

        setName(data.name ?? "");
        setEmail(data.email ?? "");
        setPhone(data.phone ?? "");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "회원 정보를 불러오지 못했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMyInfo();
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImg(url);
    }
  };

  const handleProfileUpdate = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await authFetch(`${API_BASE_URL}/api/v1/members/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? "회원 정보 수정에 실패했습니다.");
      }

      setName(data.name ?? "");
      setPhone(data.phone ?? "");
      setSuccessMessage("회원 정보가 저장되었습니다.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "회원 정보 수정에 실패했습니다."
      );
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm("정말 탈퇴하시겠습니까?")) {
      return;
    }

    try {
      const response = await authFetch(`${API_BASE_URL}/api/v1/members/me`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? "회원 탈퇴에 실패했습니다.");
      }

      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});

      clearAccessToken();
      router.push("/login");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "회원 탈퇴에 실패했습니다."
      );
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { ...createAuthHeaders() },
    }).catch(() => {});

    clearAccessToken();
    router.push("/login");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf9f2] text-[#45483d]">
        회원 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-[#efeee7] overflow-hidden">
              <div className="p-5 border-b border-[#efeee7]">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#d3ebac]">
                    {profileImg ? (
                      <Image src={profileImg} alt="" fill sizes="96px" className="object-cover" />
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
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#75786c] hover:bg-[#f5f4ec] hover:text-[#45483d] w-full transition-colors"
                >
                  <span>🚪</span>
                  로그아웃
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18]">
              회원 정보 수정
            </h1>

            {errorMessage && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                {successMessage}
              </p>
            )}

            {/* Profile Image */}
            <div className="bg-white rounded-2xl border border-[#efeee7] p-6">
              <h2 className="font-semibold text-[#1b1c18] text-sm mb-5">프로필 이미지</h2>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-[#d3ebac] shrink-0">
                  {profileImg ? (
                    <Image src={profileImg} alt="" fill sizes="96px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#4f6231] font-bold text-3xl">
                      {name.charAt(0)}
                    </div>
                  )}
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fileRef.current?.click()}
                      className="border-[#c5c8ba] text-[#45483d] hover:border-[#4f6231] hover:text-[#4f6231] rounded-xl text-xs"
                    >
                      이미지 업로드
                    </Button>
                    {profileImg && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setProfileImg(null)}
                        className="text-xs text-[#75786c] hover:text-red-500 rounded-xl"
                      >
                        제거
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-[#75786c]">
                    권장 크기: 800 × 800px · JPG, PNG, WebP
                  </p>
                </div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-[#efeee7] p-6">
              <h2 className="font-semibold text-[#1b1c18] text-sm mb-5">기본 정보</h2>
              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-[#45483d]">이름</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-[#45483d]">이메일</Label>
                  <Input
                    type="email"
                    value={email}
                    readOnly
                    className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-[#45483d]">전화번호</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] text-[#1b1c18]"
                  />
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl border border-[#efeee7] p-6">
              <h2 className="font-semibold text-[#1b1c18] text-sm mb-1">보안 설정</h2>
              <p className="text-xs text-[#75786c] mb-5">비밀번호를 변경하려면 현재 비밀번호를 입력해주세요</p>
              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-[#45483d]">현재 비밀번호</Label>
                  <Input
                    type="password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="현재 비밀번호"
                    className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] placeholder:text-[#75786c]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-[#45483d]">새 비밀번호</Label>
                  <Input
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="8자 이상 입력해주세요"
                    className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] placeholder:text-[#75786c]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-[#45483d]">새 비밀번호 확인</Label>
                  <Input
                    type="password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="비밀번호를 다시 입력해주세요"
                    className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231] placeholder:text-[#75786c]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="border-[#c5c8ba] text-[#45483d] rounded-xl"
                    onClick={() => { setCurrentPw(""); setNewPw(""); setConfirmPw(""); }}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleProfileUpdate}
                    className="bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl"
                  >
                    저장하기
                  </Button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl border border-red-100 p-6">
              <h2 className="font-semibold text-[#1b1c18] text-sm mb-1">계정 삭제</h2>
              <p className="text-xs text-[#75786c] mb-4">
                계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
              </p>
              <Button
                onClick={handleWithdraw}
                variant="outline"
                className="border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm"
              >
                계정 삭제
              </Button>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
