package com.wedge.backend.domain.chat.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatRoomCreateRequest {

    @NotNull(message = "예약 ID는 필수입니다.")
    private Long reservationId;
}
