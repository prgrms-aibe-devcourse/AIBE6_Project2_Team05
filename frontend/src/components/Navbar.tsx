"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL, clearAccessToken, createAuthHeaders, getAccessToken } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navLinks = [
    { href: "/search?category=photographer", label: "작가" },
    { href: "/search?category=venue", label: "베뉴" },
    { href: "/search?category=flower", label: "플라워" },
    { href: "/search?category=catering", label: "케이터링" },
    { href: "/community", label: "커뮤니티" },
  ];

  useEffect(() => {
    setIsLoggedIn(Boolean(getAccessToken()));
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { ...createAuthHeaders() },
      });
    } catch {
      // 네트워크 오류와 무관하게 클라이언트 로그아웃은 계속 진행
    }

    clearAccessToken();
    setIsLoggedIn(false);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fbf9f2] border-b border-[#c5c8ba]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-[var(--font-display)] text-2xl font-semibold text-[#4f6231] tracking-tight"
          >
            Wedge
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#45483d] hover:text-[#4f6231] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!mounted ? (
              <>
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </>
            ) : isLoggedIn ? (
              <>
                <Link
                  href="/mypage"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "text-[#45483d] hover:text-[#4f6231] hover:bg-[#f5f4ec]"
                  )}
                >
                  마이페이지
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-[#c5c8ba] text-[#45483d] hover:bg-[#f5f4ec]"
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "text-[#45483d] hover:text-[#4f6231] hover:bg-[#f5f4ec]"
                  )}
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "bg-[#4f6231] text-white hover:bg-[#677b47] rounded-full px-5"
                  )}
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="md:hidden"
              render={
                <Button variant="ghost" size="sm" className="p-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </Button>
              }
            />
            <SheetContent side="right" className="bg-[#fbf9f2] w-72">
              <div className="flex flex-col gap-6 mt-8">
                <Link
                  href="/"
                  className="font-[var(--font-display)] text-2xl font-semibold text-[#4f6231]"
                  onClick={() => setMobileOpen(false)}
                >
                  Wedge
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-base font-medium text-[#45483d] hover:text-[#4f6231] transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-3 pt-4 border-t border-[#c5c8ba]">
                  {!mounted ? (
                    <>
                      <Skeleton className="h-9 w-full rounded-md" />
                      <Skeleton className="h-9 w-full rounded-md" />
                    </>
                  ) : isLoggedIn ? (
                    <>
                      <Link
                        href="/mypage"
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "w-full justify-center"
                        )}
                      >
                        마이페이지
                      </Link>
                      <Button
                        onClick={handleLogout}
                        className="w-full justify-center bg-[#4f6231] text-white hover:bg-[#677b47]"
                      >
                        로그아웃
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "w-full justify-center"
                        )}
                      >
                        로그인
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          buttonVariants(),
                          "w-full justify-center bg-[#4f6231] text-white hover:bg-[#677b47]"
                        )}
                      >
                        회원가입
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
