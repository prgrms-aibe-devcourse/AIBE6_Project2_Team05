import { createAuthHeaders } from "@/lib/auth";

export const reservationStatuses = [
  "REQUESTED",
  "ACCEPTED",
  "REJECTED",
  "COMPLETED",
  "CANCELED",
] as const;

export type ReservationStatus = (typeof reservationStatuses)[number];

export type ReservationCreateRequest = {
  readonly freelancerProfileId: number;
  readonly reservationDate: string;
  readonly requestMessage: string;
};

export type ReservationResponse = {
  readonly id: number;
  readonly clientId: number;
  readonly clientName: string;
  readonly freelancerProfileId: number;
  readonly freelancerName: string;
  readonly freelancerTitle: string;
  readonly reservationDate: string;
  readonly requestMessage: string;
  readonly status: ReservationStatus;
  readonly cancelReason: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type FreelancerProfileResponse = {
  readonly id: number;
  readonly memberId: number;
  readonly memberName: string;
  readonly categoryId: number;
  readonly categoryName: string;
  readonly title: string;
  readonly introduction: string;
  readonly region: string;
  readonly price: number;
  readonly careerYears: number;
  readonly averageRating: number;
  readonly reviewCount: number;
};

export class ReservationApiError extends Error {
  readonly name = "ReservationApiError";

  constructor(
    readonly status: number,
    message: string,
    readonly details: string | null = null,
  ) {
    super(message);
  }
}

function hasMessageField(
  value: unknown,
): value is { readonly message: unknown } {
  return typeof value === "object" && value !== null && "message" in value;
}

async function readErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.text();

  if (contentType.includes("application/json")) {
    try {
      const payload: unknown = JSON.parse(body);
      if (hasMessageField(payload)) {
        const message = payload.message;
        if (typeof message === "string" && message.trim().length > 0) {
          return message;
        }
      }
    } catch (parseError) {
      if (parseError instanceof Error) {
        return body.trim();
      }
      throw parseError;
    }
  }

  return body.trim();
}

async function requestJson<T>(
  path: string,
  init: RequestInit,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  const authHeaders = createAuthHeaders();
  for (const [key, value] of Object.entries(authHeaders)) {
    headers.set(key, value);
  }

  const response = await fetch(path, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const details = await readErrorMessage(response);
    throw new ReservationApiError(
      response.status,
      details || "예약 API 요청에 실패했습니다.",
      details || null,
    );
  }

  return await response.json();
}

export async function createReservation(
  request: ReservationCreateRequest,
): Promise<ReservationResponse> {
  return requestJson<ReservationResponse>("/api/v1/reservations", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function fetchReservations(): Promise<readonly ReservationResponse[]> {
  return requestJson<readonly ReservationResponse[]>("/api/v1/reservations", {
    method: "GET",
  });
}

export async function fetchFreelancerProfile(
  id: number,
): Promise<FreelancerProfileResponse> {
  return requestJson<FreelancerProfileResponse>(`/api/freelancers/${id}`, {
    method: "GET",
  });
}

export async function acceptReservation(id: number): Promise<ReservationResponse> {
  return requestJson<ReservationResponse>(`/api/v1/reservations/${id}/accept`, {
    method: "PATCH",
  });
}

export async function rejectReservation(id: number): Promise<ReservationResponse> {
  return requestJson<ReservationResponse>(`/api/v1/reservations/${id}/reject`, {
    method: "PATCH",
  });
}

export async function completeReservation(id: number): Promise<ReservationResponse> {
  return requestJson<ReservationResponse>(`/api/v1/reservations/${id}/complete`, {
    method: "PATCH",
  });
}

export async function cancelReservation(
  id: number,
  cancelReason?: string,
): Promise<ReservationResponse> {
  return requestJson<ReservationResponse>(`/api/v1/reservations/${id}/cancel`, {
    method: "PATCH",
    body: JSON.stringify({ cancelReason }),
  });
}

export async function fetchReservationById(id: number): Promise<ReservationResponse> {
  return requestJson<ReservationResponse>(`/api/v1/reservations/${id}`, {
    method: "GET",
  });
}
