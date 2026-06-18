export type TurnStep = 1 | 2 | 3;

export interface QuickReply {
  label: string; // 화면에 보이는 텍스트
  value: string; // 백엔드로 보내는 값
}

export interface ChatMessage {
  role: "bot" | "user" | "estimate";
  content: string;
  estimate?: EstimateResult;
}

export interface EstimateResult {
  selectedServices: string[];
  priceRange: string;
  summary: string;
}

export interface ChatResponse {
  sessionId: string;
  message: string;
  isDone: boolean;
  estimate?: EstimateResult;
}

export interface ChatRequest {
  sessionId: string | null;
  turn: TurnStep;
  userMessage: string;
}
