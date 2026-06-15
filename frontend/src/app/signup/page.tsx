"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "@/lib/auth";

type UserType = "couple" | "freelancer" | null;
type Step = 1 | 2 | 3;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [userType, setUserType] = useState<UserType>(null);
  const [agreed, setAgreed] = useState({ terms: false, privacy: false, marketing: false });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const role = userType === "freelancer" ? "FREELANCER" : "CLIENT";

  const handleSignup = async () => {
    if (!userType) {
      setErrorMessage("회원 유형을 선택해주세요.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          phone,
          role,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? "회원가입에 실패했습니다.");
      }

      router.push("/login");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "회원가입에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f2] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link
        href="/"
        className="font-[var(--font-display)] text-3xl font-semibold text-[#4f6231] mb-2"
      >
        Wedge
      </Link>
      <p className="text-xs text-[#75786c] tracking-wider mb-10">
        현대적인 커플을 위한 큐레이팅된 추억
      </p>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {([1, 2, 3] as Step[]).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                step >= s
                  ? "bg-[#4f6231] text-white"
                  : "bg-[#efeee7] text-[#75786c]"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-0.5 transition-all ${
                  step > s ? "bg-[#4f6231]" : "bg-[#efeee7]"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0px_4px_20px_rgba(108,129,76,0.08)] p-8">
        {/* Step 1: User Type Selection */}
        {step === 1 && (
          <div>
            <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18] mb-2">
              어떤 분이신가요?
            </h1>
            <p className="text-sm text-[#75786c] mb-8">
              나에게 맞는 유형을 선택해주세요
            </p>
            <div className="space-y-4">
              <button
                onClick={() => { setUserType("couple"); setStep(2); }}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all hover:border-[#4f6231] hover:shadow-[0px_4px_20px_rgba(108,129,76,0.1)] ${
                  userType === "couple" ? "border-[#4f6231] bg-[#f5f4ec]" : "border-[#efeee7]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#f6d9d3] flex items-center justify-center text-2xl">
                      💑
                    </div>
                    <div>
                      <p className="font-semibold text-[#1b1c18] mb-1">예비 커플</p>
                      <p className="text-xs text-[#75786c] leading-relaxed max-w-xs">
                        엄선된 럭셔리 프리랜서를 찾고 꿈같은 기념일을 계획합니다
                      </p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-[#4f6231] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => { setUserType("freelancer"); setStep(2); }}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all hover:border-[#4f6231] hover:shadow-[0px_4px_20px_rgba(108,129,76,0.1)] ${
                  userType === "freelancer" ? "border-[#4f6231] bg-[#f5f4ec]" : "border-[#efeee7]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#d3ebac] flex items-center justify-center text-2xl">
                      📷
                    </div>
                    <div>
                      <p className="font-semibold text-[#1b1c18] mb-1">프리랜서</p>
                      <p className="text-xs text-[#75786c] leading-relaxed max-w-xs">
                        사진, 케이터링, 플라워, 베뉴 등 프리미엄 서비스를 제공합니다
                      </p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-[#4f6231] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Account Info */}
        {step === 2 && (
          <div>
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-sm text-[#75786c] hover:text-[#45483d] mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              이전 단계
            </button>
            <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18] mb-2">
              계정 정보 입력
            </h1>
            <p className="text-sm text-[#75786c] mb-8">
              기본 정보를 입력해주세요
            </p>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#45483d]">성함</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#45483d]">이메일 주소</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#45483d]">전화번호</Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#45483d]">비밀번호</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8자 이상 입력해주세요"
                  className="h-11 bg-[#f5f4ec] border-[#efeee7] focus-visible:ring-[#4f6231]"
                />
              </div>
              <Button type="submit" className="w-full h-11 bg-[#4f6231] hover:bg-[#677b47] text-white rounded-xl">
                다음 단계
              </Button>
            </form>
          </div>
        )}

        {/* Step 3: Terms */}
        {step === 3 && (
          <div>
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1 text-sm text-[#75786c] hover:text-[#45483d] mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              이전 단계
            </button>
            <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[#1b1c18] mb-2">
              약관 동의
            </h1>
            <p className="text-sm text-[#75786c] mb-8">
              서비스 이용을 위해 약관에 동의해주세요
            </p>
            <div className="space-y-4 mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed.terms}
                  onChange={(e) => setAgreed({ ...agreed, terms: e.target.checked })}
                  className="mt-0.5 w-4 h-4 accent-[#4f6231]"
                />
                <div>
                  <p className="text-sm font-medium text-[#1b1c18]">
                    이용약관 동의 <span className="text-red-500">*</span>
                  </p>
                  <p className="text-xs text-[#75786c]">서비스 이용에 관한 약관에 동의합니다</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed.privacy}
                  onChange={(e) => setAgreed({ ...agreed, privacy: e.target.checked })}
                  className="mt-0.5 w-4 h-4 accent-[#4f6231]"
                />
                <div>
                  <p className="text-sm font-medium text-[#1b1c18]">
                    개인정보 처리방침 및 쿠키 동의 <span className="text-red-500">*</span>
                  </p>
                  <p className="text-xs text-[#75786c]">개인정보 수집·이용에 동의합니다</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed.marketing}
                  onChange={(e) => setAgreed({ ...agreed, marketing: e.target.checked })}
                  className="mt-0.5 w-4 h-4 accent-[#4f6231]"
                />
                <div>
                  <p className="text-sm font-medium text-[#1b1c18]">
                    마케팅 정보 수신 동의{" "}
                    <span className="text-xs font-normal text-[#75786c]">(선택)</span>
                  </p>
                  <p className="text-xs text-[#75786c]">웨딩 트렌드 및 특별 혜택을 받아보세요</p>
                </div>
              </label>
            </div>
            {errorMessage && (
              <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
            )}
            <Button
              onClick={handleSignup}
              className="w-full h-11 bg-[#4f6231] hover:bg-[#677b47] text-white rounded-xl"
              disabled={!agreed.terms || !agreed.privacy || isSubmitting}
            >
              가입 완료하기
            </Button>
          </div>
        )}

        <p className="text-center text-sm text-[#75786c] mt-6">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-[#4f6231] font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>

      <div className="flex gap-5 mt-8 text-xs text-[#75786c]">
        <a href="#" className="hover:text-[#45483d]">도움말 센터</a>
        <a href="#" className="hover:text-[#45483d]">안전 가이드</a>
      </div>
    </div>
  );
}
