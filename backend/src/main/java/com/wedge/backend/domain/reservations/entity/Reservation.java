package com.wedge.backend.domain.reservations.entity;

import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import com.wedge.backend.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Member client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_profile_id", nullable = false)
    private FreelancerProfile freelancerProfile;

    @Column(name = "reservation_date", nullable = false)
    private LocalDateTime reservationDate;

    @Column(name = "request_message")
    private String requestMessage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    @Column(name = "cancel_reason")
    private String cancelReason;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 예비부부와 프리랜서 정보를 바탕으로 요청 상태의 예약을 생성
    public static Reservation create(Member client,
                                     FreelancerProfile freelancerProfile,
                                     LocalDateTime reservationDate,
                                     String requestMessage) {

        Reservation reservation = new Reservation();
        reservation.client = client;
        reservation.freelancerProfile = freelancerProfile;
        reservation.reservationDate = reservationDate;
        reservation.requestMessage = requestMessage;
        reservation.status = ReservationStatus.REQUESTED;
        reservation.createdAt = LocalDateTime.now();
        reservation.updatedAt = LocalDateTime.now();

        return reservation;
    }

    // 요청된 예약을 수락 상태로 변경
    public void accept() {
        this.status = ReservationStatus.ACCEPTED;
    }

    // 요청된 예약을 거절 상태로 변경
    public void reject() {
        this.status = ReservationStatus.REJECTED;
    }

    // 수락된 예약을 완료 상태로 변경
    public void complete() {
        this.status = ReservationStatus.COMPLETED;
    }

    // 예약을 취소 상태로 변경하고 취소 사유를 저장
    public void cancel(String reason) {
        this.status = ReservationStatus.CANCELED;
        this.cancelReason = reason;
    }

    // 엔티티 수정 시 수정 시간을 현재 시각으로 갱신
    @PreUpdate
    public void updateTime() {
        this.updatedAt = LocalDateTime.now();
    }
}