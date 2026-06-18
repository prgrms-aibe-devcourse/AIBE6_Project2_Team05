package com.wedge.backend.domain.chatbot.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatRequest {

    private String sessionId;

    @NotNull(message = "턴 번호는 필수입니다.")
    @Min(1) @Max(3)
    private int turn;

    @NotBlank(message = "메시지를 입력해주세요.")
    private String userMessage;
}