"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ProfileFormValues } from "@/components/freelancer/FreelancerProfileForm";
import FreelancerProfileTab from "@/components/mypage/FreelancerProfileTab";
import InfoTab from "@/components/mypage/InfoTab";
import MySidebar from "@/components/mypage/MySidebar";
import PortfolioTab from "@/components/mypage/PortfolioTab";
import ReviewTab from "@/components/mypage/ReviewTab";
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
type ActiveTab = "info" | "profile" | "portfolio" | "reviews";

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

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "profile") setActiveTab("profile");
    else if (tab === "portfolio") setActiveTab("portfolio");
    else if (tab === "reviews") setActiveTab("reviews");
    else if (tab === "info") setActiveTab("info");
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
          } catch {}
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
            onLogout={handleLogout}
          />

          <main className="flex-1 space-y-6">
            {activeTab === "info" && (
              <InfoTab
                name={name}
                email={email}
                phone={phone}
                profileImg={profileImg}
                currentPw={currentPw}
                newPw={newPw}
                confirmPw={confirmPw}
                errorMessage={errorMessage}
                successMessage={successMessage}
                onNameChange={setName}
                onPhoneChange={setPhone}
                onProfileImgChange={setProfileImg}
                onCurrentPwChange={setCurrentPw}
                onNewPwChange={setNewPw}
                onConfirmPwChange={setConfirmPw}
                onSave={handleProfileUpdate}
                onCancel={() => {
                  setCurrentPw("");
                  setNewPw("");
                  setConfirmPw("");
                }}
                onWithdraw={handleWithdraw}
              />
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

            {activeTab === "reviews" && (
              <ReviewTab
                freelancerProfileId={freelancerProfileId}
                role={role}
              />
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
