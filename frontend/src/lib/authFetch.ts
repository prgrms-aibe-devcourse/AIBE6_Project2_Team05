import {
  API_BASE_URL,
  clearAccessToken,
  createAuthHeaders,
  setAccessToken,
} from "@/lib/auth";

let refreshPromise: Promise<boolean> | null = null;

export async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) return false;

        const data = await response.json().catch(() => null);
        if (!data?.accessToken) return false;

        setAccessToken(data.accessToken);
        return true;
      } catch {
        return false;
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

function redirectToLogin() {
  clearAccessToken();
  const currentPath = window.location.pathname;
  window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
}

export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const withAuthHeaders = (init: RequestInit): RequestInit => ({
    ...init,
    headers: { ...createAuthHeaders(), ...(init.headers ?? {}) },
  });

  let response = await fetch(url, withAuthHeaders(options));

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      response = await fetch(url, withAuthHeaders(options));
    }

    if (response.status === 401) {
      redirectToLogin();
      return response;
    }
  }

  return response;
}
