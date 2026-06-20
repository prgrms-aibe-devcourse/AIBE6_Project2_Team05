import assert from "node:assert/strict";
import test from "node:test";
import { getReservationReviewHref } from "./reservation-review-link.js";

test("getReservationReviewHref routes freelancers to the reviews tab", () => {
  assert.equal(
    getReservationReviewHref({ isFreelancer: true, reservationId: 17 }),
    "/mypage?tab=reviews",
  );
});

test("getReservationReviewHref routes clients to the reservation review page", () => {
  assert.equal(
    getReservationReviewHref({ isFreelancer: false, reservationId: 17 }),
    "/review/17",
  );
});
