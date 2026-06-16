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
    private final String clientName;
    private final Long freelancerProfileId;
    private final String freelancerName;
    private final String freelancerTitle;
    private final LocalDateTime reservationDate;
    private final String requestMessage;
    private final ReservationStatus status;
    private final Long reviewId;
    private final String cancelReason;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public ReservationResponse(Reservation reservation) {
        this(reservation, null);
    }

    public ReservationResponse(Reservation reservation, Long reviewId) {
        this.id = reservation.getId();
        this.clientId = reservation.getClient().getId();
        this.clientName = reservation.getClient().getName();
        this.freelancerProfileId = reservation.getFreelancerProfile().getId();
        this.freelancerName = reservation.getFreelancerProfile().getMember().getName();
        this.freelancerTitle = reservation.getFreelancerProfile().getTitle();
        this.reservationDate = reservation.getReservationDate();
        this.requestMessage = reservation.getRequestMessage();
        this.status = reservation.getStatus();
        this.reviewId = reviewId;
        this.cancelReason = reservation.getCancelReason();
        this.createdAt = reservation.getCreatedAt();
        this.updatedAt = reservation.getUpdatedAt();
    }
}
