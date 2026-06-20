export function getChatPresenceIndicator(isOnline) {
  if (isOnline) {
    return {
      label: "채팅방 접속중",
      dotClassName: "bg-[#4f9d69]",
      textClassName: "text-[#4f9d69]",
    };
  }

  return {
    label: "채팅방 비접속중",
    dotClassName: "bg-[#9ca3af]",
    textClassName: "text-[#6b7280]",
  };
}
