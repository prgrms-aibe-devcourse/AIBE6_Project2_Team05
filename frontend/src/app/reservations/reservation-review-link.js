/**
 * @param {{ readonly isFreelancer: boolean; readonly reservationId: number }} params
 * @returns {string}
 */
export function getReservationReviewHref(params) {
  if (params.isFreelancer) {
    return "/mypage?tab=reviews";
  }

  return `/review/${params.reservationId}`;
}
