import test from "node:test";
import assert from "node:assert/strict";
import { canStartReservationChat } from "./reservation-chat.js";

test("canStartReservationChat allows chat for every current reservation status", () => {
  assert.equal(canStartReservationChat("REQUESTED"), true);
  assert.equal(canStartReservationChat("ACCEPTED"), true);
  assert.equal(canStartReservationChat("REJECTED"), true);
  assert.equal(canStartReservationChat("COMPLETED"), true);
  assert.equal(canStartReservationChat("CANCELED"), true);
});

test("canStartReservationChat rejects unknown statuses", () => {
  assert.equal(canStartReservationChat("UNKNOWN"), false);
});
