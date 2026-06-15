import { createAuthHeaders } from "@/lib/auth";

export async function authFetch(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const authHeaders = createAuthHeaders() as Record<string, string>;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options?.headers as Record<string, string>),
      ...authHeaders,
    },
  });

  if (response.status === 401) {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  }

  return response;
}
