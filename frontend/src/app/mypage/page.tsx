"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ProfileFormValues } from "@/components/freelancer/FreelancerProfileForm";
import BasicInfoForm from "@/components/mypage/BasicInfoForm";
import FreelancerProfileTab from "@/components/mypage/FreelancerProfileTab";
import MySidebar from "@/components/mypage/MySidebar";
import PortfolioTab from "@/components/mypage/PortfolioTab";
import ProfileImageUpload from "@/components/mypage/ProfileImageUpload";
import SecurityForm from "@/components/mypage/SecurityForm";
import { Button } from "@/components/ui/button";
import {
  API_BASE_URL,
  clearAccessToken,
  createAuthHeaders,
  getAccessToken,
} from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type MemberRole = "CLIENT" | "FREELANCER";
type ActiveTab = "info" | "profile" | "portfolio";

export default function MyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ActiveTab>("info");

  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<MemberRole | null>(null);
  const [freelancerProfileId, setFreelancerProfileId] = useState<number | null>(
    null,
  );
  const [profileInitialValues, setProfileInitialValues] =
    useState<ProfileFormValues | null>(null);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // URL 쿼리 파라미터로 탭 초기값 설정
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "profile") setActiveTab("profile");
    else if (tab === "portfolio") setActiveTab("portfolio");
  }, [searchParams]);

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
        if (!response.ok)
          throw new Error(data?.message ?? "회원 정보를 불러오지 못했습니다.");

        setName(data.name ?? "");
        setEmail(data.email ?? "");
        setPhone(data.phone ?? "");
        setProfileImg(data.profileImageUrl ?? null);
        setRole(data.role ?? null);

        if (data.role === "FREELANCER") {
          try {
            const profileRes = await authFetch(
              `${API_BASE_URL}/api/freelancers/me`,
            );
            if (profileRes.ok) {
              const profileData = await profileRes.json();
              setFreelancerProfileId(profileData.id);
              setProfileInitialValues({
                categoryId: profileData.categoryId,
                title: profileData.title ?? "",
                introduction: profileData.introduction ?? "",
                region: profileData.region ?? "",
                price: String(profileData.price ?? ""),
                careerYears: String(profileData.careerYears ?? ""),
              });
            }
          } catch {
            // profileId 없으면 무시
          }
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "회원 정보를 불러오지 못했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMyInfo();
  }, [router]);

  const handleProfileUpdate = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (newPw || currentPw || confirmPw) {
      if (!currentPw) {
        setErrorMessage("현재 비밀번호를 입력해주세요.");
        return;
      }
      if (newPw.length < 8) {
        setErrorMessage("새 비밀번호는 8자 이상이어야 합니다.");
        return;
      }
      if (newPw !== confirmPw) {
        setErrorMessage("새 비밀번호가 일치하지 않습니다.");
        return;
      }
    }
    try {
      const body: { name: string; phone: string; password?: string } = {
        name,
        phone,
      };
      if (newPw) body.password = newPw;
      const response = await fetch(`${API_BASE_URL}/api/v1/members/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...createAuthHeaders() },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(data?.message ?? "회원 정보 수정에 실패했습니다.");
      setName(data.name ?? "");
      setPhone(data.phone ?? "");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setSuccessMessage("회원 정보가 저장되었습니다.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "회원 정보 수정에 실패했습니다.",
      );
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm("정말 탈퇴하시겠습니까?")) return;
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
        error instanceof Error ? error.message : "회원 탈퇴에 실패했습니다.",
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
          <MySidebar
            name={name}
            email={email}
            profileImg={profileImg}
            role={role}
            freelancerProfileId={freelancerProfileId}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
          />

          <main className="flex-1 space-y-6">
            {activeTab === "info" && (
              <>
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
                <ProfileImageUpload
                  name={name}
                  profileImg={profileImg}
                  onImageChange={setProfileImg}
                />
                <BasicInfoForm
                  name={name}
                  email={email}
                  phone={phone}
                  onNameChange={setName}
                  onPhoneChange={setPhone}
                />
                <SecurityForm
                  currentPw={currentPw}
                  newPw={newPw}
                  confirmPw={confirmPw}
                  onCurrentPwChange={setCurrentPw}
                  onNewPwChange={setNewPw}
                  onConfirmPwChange={setConfirmPw}
                  onSave={handleProfileUpdate}
                  onCancel={() => {
                    setCurrentPw("");
                    setNewPw("");
                    setConfirmPw("");
                  }}
                />
                <div className="bg-white rounded-2xl border border-red-100 p-6">
                  <h2 className="font-semibold text-[#1b1c18] text-sm mb-1">
                    계정 삭제
                  </h2>
                  <p className="text-xs text-[#75786c] mb-4">
                    계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수
                    없습니다.
                  </p>
                  <Button
                    onClick={handleWithdraw}
                    variant="outline"
                    className="border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm"
                  >
                    계정 삭제
                  </Button>
                </div>
              </>
            )}

            {activeTab === "profile" &&
              freelancerProfileId &&
              profileInitialValues && (
                <FreelancerProfileTab
                  freelancerProfileId={freelancerProfileId}
                  initialValues={profileInitialValues}
                  onSuccess={() => {
                    setSuccessMessage("프로필이 저장되었습니다.");
                    setActiveTab("info");
                  }}
                  onCancel={() => setActiveTab("info")}
                />
              )}

            {activeTab === "portfolio" && freelancerProfileId && (
              <PortfolioTab
                freelancerProfileId={freelancerProfileId}
                onSuccess={() => {
                  setSuccessMessage("포트폴리오가 저장되었습니다.");
                  setActiveTab("info");
                }}
                onCancel={() => setActiveTab("info")}
              />
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
