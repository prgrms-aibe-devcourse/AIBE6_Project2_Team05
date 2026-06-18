package com.wedge.backend.domain.chat.dto;

import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatTypingRequest {

    @NotNull(message = "채팅방 ID는 필수입니다.")
    private Long roomId;

    @JsonProperty("isTyping")
    private boolean typing;
}
