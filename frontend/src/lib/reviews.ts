import { authFetch } from "@/lib/authFetch";
import { fetchReservations } from "@/lib/reservations";
import type { ReservationResponse } from "@/lib/reservations";

export type MemberRole = "CLIENT" | "FREELANCER" | "ADMIN";

export type CurrentMember = {
  readonly id: number;
  readonly email: string;
  readonly name: string;
  readonly phone: string | null;
  readonly role: MemberRole;
};

export type ReviewResponse = {
  readonly id: number;
  readonly memberId: number;
  readonly memberName: string;
  readonly rating: number;
  readonly content: string;
  readonly createdAt: string;
};

type FreelancerProfileSummary = {
  readonly id: number;
  readonly memberId: number;
};

type FreelancerPageResponse = {
  readonly content: readonly FreelancerProfileSummary[];
};

export class ReviewApiError extends Error {
  readonly name = "ReviewApiError";

  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMemberRole(value: unknown): value is MemberRole {
  return value === "CLIENT" || value === "FREELANCER" || value === "ADMIN";
}

function parseCurrentMember(value: unknown): CurrentMember {
  if (!isRecord(value) || typeof value.id !== "number" || !isMemberRole(value.role)) {
    throw new ReviewApiError(500, "회원 정보를 확인할 수 없습니다.");
  }

  return {
    id: value.id,
    email: typeof value.email === "string" ? value.email : "",
    name: typeof value.name === "string" ? value.name : "",
    phone: typeof value.phone === "string" ? value.phone : null,
    role: value.role,
  };
}

function parseReview(value: unknown): ReviewResponse {
  if (!isRecord(value) || typeof value.id !== "number") {
    throw new ReviewApiError(500, "리뷰 응답 형식이 올바르지 않습니다.");
  }

  return {
    id: value.id,
    memberId: typeof value.memberId === "number" ? value.memberId : 0,
    memberName: typeof value.memberName === "string" ? value.memberName : "익명",
    rating: typeof value.rating === "number" ? value.rating : 0,
    content: typeof value.content === "string" ? value.content : "",
    createdAt: typeof value.createdAt === "string" ? value.createdAt : "",
  };
}

function parseFreelancerProfileSummary(value: unknown): FreelancerProfileSummary | null {
  if (!isRecord(value) || typeof value.id !== "number" || typeof value.memberId !== "number") {
    return null;
  }

  return {
    id: value.id,
    memberId: value.memberId,
  };
}

function parseFreelancerPage(value: unknown): FreelancerPageResponse | null {
  if (!isRecord(value) || !Array.isArray(value.content)) {
    return null;
  }

  return {
    content: value.content
      .map(parseFreelancerProfileSummary)
      .filter((profile) => profile !== null),
  };
}

async function readErrorMessage(response: Response): Promise<string> {
  const body = await response.text();
  if (!body.trim()) {
    return "";
  }

  try {
    const payload: unknown = JSON.parse(body);
    if (isRecord(payload) && typeof payload.message === "string") {
      return payload.message;
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return body.trim();
    }
    throw error;
  }

  return body.trim();
}

async function requestJson(path: string): Promise<unknown> {
  const response = await authFetch(path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new ReviewApiError(
      response.status,
      message || "리뷰 정보를 불러오지 못했습니다.",
    );
  }

  return await response.json();
}

export async function fetchCurrentMember(): Promise<CurrentMember> {
  return parseCurrentMember(await requestJson("/api/v1/members/me"));
}

export async function fetchReceivedReviews(
  freelancerProfileId: number,
): Promise<readonly ReviewResponse[]> {
  const payload = await requestJson(
    `/api/freelancers/${freelancerProfileId}/reviews`,
  );

  if (!Array.isArray(payload)) {
    throw new ReviewApiError(500, "리뷰 목록 응답 형식이 올바르지 않습니다.");
  }

  return payload.map(parseReview);
}

function findProfileIdFromReservations(
  reservations: readonly ReservationResponse[],
): number | null {
  return reservations[0]?.freelancerProfileId ?? null;
}

async function findProfileIdFromSearch(memberId: number): Promise<number | null> {
  const payload = await requestJson("/api/freelancers?size=100");
  const page = parseFreelancerPage(payload);

  if (page === null) {
    return null;
  }

  return page.content.find((profile) => profile.memberId === memberId)?.id ?? null;
}

export async function fetchMyFreelancerProfileId(
  memberId: number,
): Promise<number | null> {
  const reservations = await fetchReservations();
  return findProfileIdFromReservations(reservations) ?? findProfileIdFromSearch(memberId);
}
