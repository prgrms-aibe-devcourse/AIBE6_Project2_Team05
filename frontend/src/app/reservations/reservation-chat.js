const reservationChatAvailableStatuses = [
  "REQUESTED",
  "ACCEPTED",
  "REJECTED",
  "CANCELED",
];

export function canStartReservationChat(status) {
  return reservationChatAvailableStatuses.includes(status);
}
