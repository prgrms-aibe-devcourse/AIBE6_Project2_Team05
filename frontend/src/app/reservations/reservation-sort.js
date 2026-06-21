/**
 * @template {{ readonly createdAt: string }}
 * @param {readonly T[]} reservations
 * @returns {T[]}
 */
export function sortReservationsByDateDescending(reservations) {
  return [...reservations].sort((leftReservation, rightReservation) => {
    const leftTime = new Date(leftReservation.createdAt).getTime();
    const rightTime = new Date(rightReservation.createdAt).getTime();

    return rightTime - leftTime;
  });
}
