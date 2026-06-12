// 예약 취소 사유를 전달하는 DTO
package com.wedge.backend.domain.reservations.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReservationCancelRequest {

    private String cancelReason;
}
