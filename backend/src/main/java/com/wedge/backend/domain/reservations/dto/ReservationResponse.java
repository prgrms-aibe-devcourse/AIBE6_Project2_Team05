// 예약 상세 정보를 응답하는 DTO
package com.wedge.backend.domain.reservations.dto;

import com.wedge.backend.domain.reservations.entity.Reservation;
import com.wedge.backend.domain.reservations.entity.ReservationStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ReservationResponse {

    private final Long id;
    private final Long clientId;
    private final Long freelancerProfileId;
    private final LocalDateTime reservationDate;
    private final String requestMessage;
    private final ReservationStatus status;
    private final String cancelReason;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public ReservationResponse(Reservation reservation) {
        this.id = reservation.getId();
        this.clientId = reservation.getClient().getId();
        this.freelancerProfileId = reservation.getFreelancerProfile().getId();
        this.reservationDate = reservation.getReservationDate();
        this.requestMessage = reservation.getRequestMessage();
        this.status = reservation.getStatus();
        this.cancelReason = reservation.getCancelReason();
        this.createdAt = reservation.getCreatedAt();
        this.updatedAt = reservation.getUpdatedAt();
    }
}
