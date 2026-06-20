import {
  getTodayDateString,
  isPastReservationSelection,
} from "./reservation-time.js";

/**
 * @param {string} selectedDate
 * @param {string} selectedTime
 * @param {Date} [now]
 * @returns {string | null}
 */
export function getReservationValidationMessage(
  selectedDate,
  selectedTime,
  now = new Date(),
) {
  if (!selectedDate) {
    return "예식 날짜를 선택해주세요.";
  }

  if (selectedDate < getTodayDateString(now)) {
    return "지난 날짜로는 예약을 신청할 수 없습니다.";
  }

  if (isPastReservationSelection(selectedDate, selectedTime, now)) {
    return "지난 시간으로는 예약을 신청할 수 없습니다.";
  }

  return null;
}

/**
 * @param {string} selectedDate
 * @param {string} selectedTime
 * @returns {string}
 */
export function buildReservationDateTime(selectedDate, selectedTime) {
  return `${selectedDate}T${selectedTime}:00`;
}
