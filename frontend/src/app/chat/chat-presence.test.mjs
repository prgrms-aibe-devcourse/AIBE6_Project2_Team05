import test from "node:test";
import assert from "node:assert/strict";

import { getChatPresenceIndicator } from "./chat-presence.mjs";

test("getChatPresenceIndicator returns green online status", () => {
  assert.deepEqual(getChatPresenceIndicator(true), {
    label: "채팅방 접속중",
    dotClassName: "bg-[#4f9d69]",
    textClassName: "text-[#4f9d69]",
  });
});

test("getChatPresenceIndicator returns gray offline status", () => {
  assert.deepEqual(getChatPresenceIndicator(false), {
    label: "채팅방 비접속중",
    dotClassName: "bg-[#9ca3af]",
    textClassName: "text-[#6b7280]",
  });
});
