import test from "node:test";
import assert from "node:assert/strict";
import { canStartReservationChat } from "./reservation-chat.js";

test("canStartReservationChat allows chat for active reservation statuses", () => {
  assert.equal(canStartReservationChat("REQUESTED"), true);
  assert.equal(canStartReservationChat("ACCEPTED"), true);
  assert.equal(canStartReservationChat("REJECTED"), true);
  assert.equal(canStartReservationChat("CANCELED"), true);
});

test("canStartReservationChat blocks chat for completed reservations", () => {
  assert.equal(canStartReservationChat("COMPLETED"), false);
});

test("canStartReservationChat rejects unknown statuses", () => {
  assert.equal(canStartReservationChat("UNKNOWN"), false);
});
