"use client";

import FreelancerProfileForm, {
  ProfileFormValues,
} from "@/components/freelancer/FreelancerProfileForm";
import InfoTab from "@/components/mypage/InfoTab";
import MySidebar from "@/components/mypage/MySidebar";
import PortfolioTab from "@/components/mypage/PortfolioTab";
import ReviewTab from "@/components/mypage/ReviewTab";
import { useUser } from "@/contexts/UserContext";
import {
  API_BASE_URL,
  clearAccessToken,
  createAuthHeaders,
  getAccessToken,
} from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

type ActiveTab = "info" | "profile" | "portfolio" | "reviews";

function NoFreelancerProfileNotice() {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8d6ca] bg-white px-6 py-14 text-center">
      <p className="text-base font-semibold text-[#1b1c18]">
        아직 등록된 프로필이 없어요
      </p>
      <p className="mt-2 text-sm text-[#75786c]">
        프로필을 등록하면 이 메뉴를 이용할 수 있어요.
      </p>
      <Link
        href="/freelancer/profile/manage"
        className="mt-4 inline-block rounded-xl bg-[#4f6231] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#677b47]"
      >
        프로필 등록하기
      </Link>
    </div>
  );
}

export default function MyPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center bg-[#fbf9f2] text-[#45483d]">
          회원 정보를 불러오는 중입니다...
        </div>
      }
    >
      <MyPage />
    </Suspense>
  );
}

function MyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: userLoading, refreshUser, clearUser } = useUser();
  const [activeTab, setActiveTab] = useState<ActiveTab>("info");

  const [phone, setPhone] = useState("");
  const [profileInitialValues, setProfileInitialValues] =
    useState<ProfileFormValues | null>(null);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [localProfileImg, setLocalProfileImg] = useState<string | null>(null);
  const [serverProfileImg, setServerProfileImg] = useState<string | null>(null);
  const [pendingProfileImageFile, setPendingProfileImageFile] =
    useState<File | null>(null);
  const [pendingProfileImageRemoval, setPendingProfileImageRemoval] =
    useState(false);
  const [localName, setLocalName] = useState("");
  const previewImageUrlRef = useRef<string | null>(null);

  const clearPreviewImageUrl = () => {
    if (previewImageUrlRef.current) {
      URL.revokeObjectURL(previewImageUrlRef.current);
      previewImageUrlRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearPreviewImageUrl();
    };
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "profile") setActiveTab("profile");
    else if (tab === "portfolio") setActiveTab("portfolio");
    else if (tab === "reviews") setActiveTab("reviews");
    else setActiveTab("info");
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

        if (data.status === "ONBOARDING") {
          router.replace("/select-role");
          return;
        }

        setLocalName(data.name ?? "");
        setPhone(data.phone ?? "");
        clearPreviewImageUrl();
        setServerProfileImg(data.profileImageUrl ?? null);
        setLocalProfileImg(data.profileImageUrl ?? null);
        setPendingProfileImageFile(null);
        setPendingProfileImageRemoval(false);

        if (data.role === "FREELANCER") {
          try {
            const profileRes = await authFetch(
              `${API_BASE_URL}/api/freelancers/me`,
            );
            if (profileRes.ok) {
              const profileData = await profileRes.json();
              setProfileInitialValues({
                categoryId: profileData.categoryId,
                title: profileData.title ?? "",
                introduction: profileData.introduction ?? "",
                selfIntroduction: profileData.selfIntroduction ?? "",
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
    setIsSaving(true);
    try {
      const body: { name: string; phone: string; password?: string } = {
        name: localName,
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

      if (pendingProfileImageFile) {
        const formData = new FormData();
        formData.append("image", pendingProfileImageFile);
        const imageRes = await authFetch(
          `${API_BASE_URL}/api/v1/members/me/image`,
          {
            method: "PATCH",
            body: formData,
          },
        );
        const imageData = await imageRes.json().catch(() => null);
        if (!imageRes.ok) {
          throw new Error(
            imageData?.message ?? "프로필 이미지 저장에 실패했습니다.",
          );
        }
        clearPreviewImageUrl();
        setServerProfileImg(imageData.profileImageUrl ?? null);
        setLocalProfileImg(imageData.profileImageUrl ?? null);
      } else if (pendingProfileImageRemoval) {
        const removeRes = await authFetch(
          `${API_BASE_URL}/api/v1/members/me/image`,
          {
            method: "DELETE",
          },
        );
        const removeData = await removeRes.json().catch(() => null);
        if (!removeRes.ok) {
          throw new Error(
            removeData?.message ?? "프로필 이미지 제거에 실패했습니다.",
          );
        }
        clearPreviewImageUrl();
        setServerProfileImg(null);
        setLocalProfileImg(null);
      }

      setPendingProfileImageFile(null);
      setPendingProfileImageRemoval(false);
      setLocalName(data.name ?? "");
      setPhone(data.phone ?? "");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setSuccessMessage("회원 정보가 저장되었습니다.");
      await refreshUser();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "회원 정보 수정에 실패했습니다.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleFreelancerProfileSubmit = async (values: ProfileFormValues) => {
    if (!user?.freelancerProfileId) return;
    setErrorMessage("");
    setIsSaving(true);
    try {
      const response = await authFetch(
        `${API_BASE_URL}/api/freelancers/${user.freelancerProfileId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryId: Number(values.categoryId),
            title: values.title.trim(),
            introduction: values.introduction.trim(),
            selfIntroduction: values.selfIntroduction.trim(),
            region: values.region,
            price: Number(values.price),
            careerYears: Number(values.careerYears),
          }),
        },
      );
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? "프로필 수정에 실패했습니다.");
      }
      setProfileInitialValues(values);
      setSuccessMessage("프로필이 저장되었습니다.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "프로필 수정에 실패했습니다.",
      );
    } finally {
      setIsSaving(false);
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
      clearUser();
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
    clearUser();
    router.push("/login");
    router.refresh();
  };

  if (isLoading || userLoading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#fbf9f2] text-[#45483d]">
        회원 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#fbf9f2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <MySidebar onLogout={handleLogout} />
          <main className="flex-1 space-y-6">
            {activeTab === "info" && (
              <InfoTab
                name={localName}
                email={user?.email ?? ""}
                phone={phone}
                role={user?.role ?? null}
                profileImg={localProfileImg}
                currentPw={currentPw}
                newPw={newPw}
                confirmPw={confirmPw}
                errorMessage={errorMessage}
                successMessage={successMessage}
                onNameChange={setLocalName}
                onPhoneChange={setPhone}
                onProfileImageSelected={(file, previewUrl) => {
                  clearPreviewImageUrl();
                  previewImageUrlRef.current = previewUrl;
                  setLocalProfileImg(previewUrl);
                  setPendingProfileImageFile(file);
                  setPendingProfileImageRemoval(false);
                }}
                onProfileImageRemoved={() => {
                  clearPreviewImageUrl();
                  setLocalProfileImg(null);
                  setPendingProfileImageFile(null);
                  setPendingProfileImageRemoval(serverProfileImg !== null);
                }}
                onCurrentPwChange={setCurrentPw}
                onNewPwChange={setNewPw}
                onConfirmPwChange={setConfirmPw}
                onSave={handleProfileUpdate}
                onCancel={() => {
                  clearPreviewImageUrl();
                  setLocalProfileImg(serverProfileImg);
                  setPendingProfileImageFile(null);
                  setPendingProfileImageRemoval(false);
                  setCurrentPw("");
                  setNewPw("");
                  setConfirmPw("");
                }}
                onWithdraw={handleWithdraw}
                isSaving={isSaving}
              />
            )}
            {activeTab === "profile" &&
              (user?.freelancerProfileId ? (
                profileInitialValues ? (
                  <FreelancerProfileForm
                    mode="edit"
                    initialValues={profileInitialValues}
                    isSubmitting={isSaving}
                    errorMessage={errorMessage}
                    onSubmit={handleFreelancerProfileSubmit}
                    onCancel={() => router.push("/mypage?tab=info")}
                  />
                ) : (
                  <div className="flex items-center justify-center py-14 text-sm text-[#75786c]">
                    프로필 정보를 불러오는 중입니다...
                  </div>
                )
              ) : (
                <NoFreelancerProfileNotice />
              ))}
            {activeTab === "portfolio" &&
              (user?.freelancerProfileId ? (
                <PortfolioTab freelancerProfileId={user.freelancerProfileId} />
              ) : (
                <NoFreelancerProfileNotice />
              ))}
            {activeTab === "reviews" && (
              <ReviewTab
                freelancerProfileId={user?.freelancerProfileId ?? null}
                role={user?.role ?? null}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
