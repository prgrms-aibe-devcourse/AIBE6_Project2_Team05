/**
 * @param {Date} [now]
 * @returns {string}
 */
export function getTodayDateString(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * @param {Date} [now]
 * @returns {string}
 */
export function getCurrentTimeString(now = new Date()) {
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

/**
 * @param {string} selectedDate
 * @param {Date} [now]
 * @returns {string | undefined}
 */
export function getMinimumTimeForDate(selectedDate, now = new Date()) {
  if (selectedDate !== getTodayDateString(now)) {
    return undefined;
  }

  return getCurrentTimeString(now);
}

/**
 * @param {string} selectedDate
 * @param {string} selectedTime
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isPastReservationSelection(
  selectedDate,
  selectedTime,
  now = new Date(),
) {
  if (!selectedDate || !selectedTime) {
    return false;
  }

  const selectedDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

  return Number.isFinite(selectedDateTime.getTime())
    && selectedDateTime.getTime() < now.getTime();
}
