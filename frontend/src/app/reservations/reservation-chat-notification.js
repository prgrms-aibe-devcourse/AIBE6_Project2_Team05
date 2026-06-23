export function shouldNotifyReservationChat({
  messageSenderId,
  currentMemberId,
  reservationId,
}) {
  return (
    typeof reservationId === "number" &&
    Number.isFinite(reservationId) &&
    messageSenderId !== currentMemberId
  );
}

export function getNextChatNotificationIds(currentIds, reservationId) {
  const nextIds = new Set(currentIds);
  nextIds.add(reservationId);
  return nextIds;
}
