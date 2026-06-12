// 예약 생성 요청 정보를 전달하는 DTO
package com.wedge.backend.domain.reservations.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class ReservationCreateRequest {

    private Long freelancerProfileId;
    private LocalDateTime reservationDate;
    private String requestMessage;
}
