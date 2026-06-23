export type Category = {
  readonly id: number;
  readonly name: string;
};

export type JobFormValues = {
  readonly title: string;
  readonly content: string;
  readonly categoryId: number | "";
  readonly budget: string;
  readonly weddingDate: string;
  readonly selectedRegion: string;
  readonly customRegion: string;
};

export const JOB_CATEGORY_ICONS: Record<string, string> = {
  헤어메이크업: "💄",
  "스냅 사진": "📸",
  "MC/사회자": "🎤",
  "드레스/수트": "👗",
  보컬리스트: "🎵",
  "하객 알바": "🤝",
};

export const JOB_REGIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "대전",
  "광주",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
] as const;
