"use client";

import { API_BASE_URL, getAccessToken } from "@/lib/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type MemberRole = "CLIENT" | "FREELANCER";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  profileImageUrl: string | null;
  role: MemberRole;
  freelancerProfileId: number | null;
}

interface UserContextType {
  user: UserInfo | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  refreshUser: async () => {},
  clearUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/members/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();

      let freelancerProfileId = null;
      if (data.role === "FREELANCER") {
        const profileRes = await fetch(`${API_BASE_URL}/api/freelancers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => null);
        if (profileRes?.ok) {
          const profileData = await profileRes.json();
          freelancerProfileId = profileData.id;
        }
      }

      setUser({
        id: data.id,
        name: data.name ?? "",
        email: data.email ?? "",
        profileImageUrl: data.profileImageUrl ?? null,
        role: data.role,
        freelancerProfileId,
      });
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        refreshUser,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
