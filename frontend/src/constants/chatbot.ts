interface TurnConfig {
  botMessage: string;
  quickReplies: { label: string; value: string }[];
}

export const TURN_CONFIGS: Record<number, TurnConfig> = {
  1: {
    botMessage: "원하시는 웨딩 서비스를 선택해 주세요 💍\n",
    quickReplies: [
      { label: "📸 스냅사진 촬영", value: "웨딩 스냅사진" },
      { label: "👗 드레스 대여", value: "드레스·정장" },
      { label: "✨ 헤어메이크업", value: "헤어·메이크업" },
      { label: "💐 부케", value: "웨딩 플로리스트" },
      { label: "🎬 영상 촬영", value: "웨딩 영상" },
    ],
  },
  2: {
    botMessage: "총 예산 범위를 알려 주세요!",
    quickReplies: [
      { label: "100 ~ 200만원", value: "100~200만원" },
      { label: "200 ~ 350만원", value: "200~350만원" },
      { label: "350 ~ 500만원", value: "350~500만원" },
      { label: "500만원 이상", value: "500만원 이상" },
    ],
  },
  3: {
    botMessage: "하객 예상 인원을 알려 주세요!",
    quickReplies: [
      { label: "50명 이하", value: "50명 이하" },
      { label: "51 ~ 100명", value: "51~100명" },
      { label: "101명 이상", value: "101명 이상" },
    ],
  },
};

export const INITIAL_BOT_MESSAGE =
  "안녕하세요! 💍 Wedge 견적 도우미예요.\n몇 가지만 여쭤 볼게요!";
