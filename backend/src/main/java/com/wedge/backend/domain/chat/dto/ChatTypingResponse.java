package com.wedge.backend.domain.chat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ChatTypingResponse(
        Long roomId,
        Long userId,
        @JsonProperty("isTyping")
        boolean typing
) {
}
