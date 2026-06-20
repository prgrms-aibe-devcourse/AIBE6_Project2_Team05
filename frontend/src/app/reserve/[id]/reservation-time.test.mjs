import test from "node:test";
import assert from "node:assert/strict";

import {
  getCurrentTimeString,
  getMinimumTimeForDate,
  getTodayDateString,
  isPastReservationSelection,
} from "./reservation-time.js";
import {
  buildReservationDateTime,
  getReservationValidationMessage,
} from "./reservation-submit.js";

test("getTodayDateString formats the current date", () => {
  const now = new Date("2026-06-20T14:35:00+09:00");

  assert.equal(getTodayDateString(now), "2026-06-20");
});

test("getCurrentTimeString formats the current time", () => {
  const now = new Date("2026-06-20T09:05:00+09:00");

  assert.equal(getCurrentTimeString(now), "09:05");
});

test("getMinimumTimeForDate returns the current time for today", () => {
  const now = new Date("2026-06-20T14:35:00+09:00");

  assert.equal(getMinimumTimeForDate("2026-06-20", now), "14:35");
});

test("getMinimumTimeForDate returns undefined for future dates", () => {
  const now = new Date("2026-06-20T14:35:00+09:00");

  assert.equal(getMinimumTimeForDate("2026-06-21", now), undefined);
});

test("isPastReservationSelection rejects past time on the same day", () => {
  const now = new Date("2026-06-20T14:35:00+09:00");

  assert.equal(
    isPastReservationSelection("2026-06-20", "14:34", now),
    true,
  );
});

test("isPastReservationSelection accepts future time on the same day", () => {
  const now = new Date("2026-06-20T14:35:00+09:00");

  assert.equal(
    isPastReservationSelection("2026-06-20", "14:36", now),
    false,
  );
});

test("isPastReservationSelection rejects past dates", () => {
  const now = new Date("2026-06-20T14:35:00+09:00");

  assert.equal(
    isPastReservationSelection("2026-06-19", "23:59", now),
    true,
  );
});

test("getReservationValidationMessage requires a date", () => {
  assert.equal(
    getReservationValidationMessage("", "12:00"),
    "예식 날짜를 선택해주세요.",
  );
});

test("getReservationValidationMessage rejects past dates", () => {
  const now = new Date("2026-06-20T14:35:00+09:00");

  assert.equal(
    getReservationValidationMessage("2026-06-19", "23:59", now),
    "지난 날짜로는 예약을 신청할 수 없습니다.",
  );
});

test("getReservationValidationMessage rejects past times", () => {
  const now = new Date("2026-06-20T14:35:00+09:00");

  assert.equal(
    getReservationValidationMessage("2026-06-20", "14:34", now),
    "지난 시간으로는 예약을 신청할 수 없습니다.",
  );
});

test("getReservationValidationMessage accepts valid selections", () => {
  const now = new Date("2026-06-20T14:35:00+09:00");

  assert.equal(
    getReservationValidationMessage("2026-06-20", "14:36", now),
    null,
  );
});

test("buildReservationDateTime creates the API payload shape", () => {
  assert.equal(
    buildReservationDateTime("2026-06-20", "14:36"),
    "2026-06-20T14:36:00",
  );
});
