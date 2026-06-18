package com.wedge.backend.domain.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatMessageRequest {

    @NotNull(message = "채팅방 ID는 필수입니다.")
    private Long roomId;

    @NotBlank(message = "메시지를 입력해주세요.")
    @Size(max = 1000, message = "메시지는 1000자 이하로 입력해주세요.")
    private String content;
}
