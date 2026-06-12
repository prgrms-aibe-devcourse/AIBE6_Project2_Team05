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

    // 예약자 (CLIENT)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Member client;

    // 프리랜서
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_profile_id", nullable = false)
    private FreelancerProfile freelancerProfile;

    // 예약 날짜
    @Column(name = "reservation_date", nullable = false)
    private LocalDateTime reservationDate;

    // 요청 메시지
    @Column(name = "request_message")
    private String requestMessage;

    // 예약 상태
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    // 취소 사유 (취소 시에만 사용)
    @Column(name = "cancel_reason")
    private String cancelReason;

    // 생성 / 수정 시간
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // =========================
    // 생성 메서드 (정적 팩토리)
    // =========================
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

    // =========================
    // 상태 변경 메서드
    // =========================
    public void accept() {
        this.status = ReservationStatus.ACCEPTED;
    }

    public void reject() {
        this.status = ReservationStatus.REJECTED;
    }

    public void complete() {
        this.status = ReservationStatus.COMPLETED;
    }

    public void cancel(String reason) {
        this.status = ReservationStatus.CANCELED;
        this.cancelReason = reason;
    }

    // =========================
    // 수정 시간 자동 업데이트
    // =========================
    @PreUpdate
    public void updateTime() {
        this.updatedAt = LocalDateTime.now();
    }
}