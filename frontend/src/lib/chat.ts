import { API_BASE_URL } from "@/lib/auth";
import { authFetch } from "@/lib/authFetch";

export interface ChatOpponent {
  id: number;
  name: string;
  profileImageUrl: string | null;
  isOnline: boolean;
}

export interface ChatRoom {
  id: number;
  reservationId: number;
  opponent: ChatOpponent;
  lastMessageAt: string | null;
  isActive: boolean;
}

export interface ChatRoomCreateRequest {
  readonly reservationId: number;
}

export interface ChatMessage {
  id: number;
  roomId: number;
  senderId: number;
  receiverId: number;
  content: string;
  readAt: string | null;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface MemberMe {
  id: number;
  name: string;
  role: string;
}

async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message ?? "요청을 처리하지 못했습니다.";
    throw new Error(message);
  }

  return data as T;
}

export async function fetchChatRoom(roomId: number): Promise<ChatRoom> {
  const response = await authFetch(`${API_BASE_URL}/api/v1/chat/rooms/${roomId}`);
  return parseJson<ChatRoom>(response);
}

export async function createChatRoom(
  request: ChatRoomCreateRequest,
): Promise<ChatRoom> {
  const response = await authFetch(`${API_BASE_URL}/api/v1/chat/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return parseJson<ChatRoom>(response);
}

export async function fetchChatMessages(
  roomId: number,
  page = 0,
  size = 20,
): Promise<PageResponse<ChatMessage>> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const response = await authFetch(
    `${API_BASE_URL}/api/v1/chat/rooms/${roomId}/messages?${params.toString()}`,
  );
  return parseJson<PageResponse<ChatMessage>>(response);
}

export async function markChatRoomRead(roomId: number): Promise<void> {
  await authFetch(`${API_BASE_URL}/api/v1/chat/rooms/${roomId}/read`, {
    method: "PUT",
  });
}

export async function fetchCurrentMember(): Promise<MemberMe> {
  const response = await authFetch(`${API_BASE_URL}/api/v1/members/me`);
  return parseJson<MemberMe>(response);
}

export function createWebSocketUrl() {
  return `${API_BASE_URL.replace(/^http/, "ws")}/ws`;
}
