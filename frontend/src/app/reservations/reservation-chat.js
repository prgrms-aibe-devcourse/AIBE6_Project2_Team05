const reservationChatAvailableStatuses = [
  "REQUESTED",
  "ACCEPTED",
  "REJECTED",
  "COMPLETED",
  "CANCELED",
];

export function canStartReservationChat(status) {
  return reservationChatAvailableStatuses.includes(status);
}
