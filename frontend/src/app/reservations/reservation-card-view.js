export function getReservationCardView({ reservation, userRole, profileImageUrl }) {
  const isFreelancer = userRole === "FREELANCER";
  const displayName = isFreelancer
    ? reservation.clientName || "신청인"
    : reservation.freelancerName || "프리랜서";
  const displaySubtitle = isFreelancer
    ? "예약 신청인"
    : reservation.freelancerTitle || "웨딩 전문가";

  return {
    displayName,
    displaySubtitle,
    imageUrl: isFreelancer
      ? reservation.clientImageUrl ?? null
      : reservation.freelancerImageUrl ?? profileImageUrl,
    imageAlt: displayName,
    imageFallback: displayName[0] ?? "W",
  };
}
