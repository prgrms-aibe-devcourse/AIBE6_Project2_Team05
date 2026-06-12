// 예약 저장 및 사용자 유형별 예약 목록 조회 기능
package com.wedge.backend.domain.reservations.repository;

import com.wedge.backend.domain.reservations.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findAllByClientIdOrderByCreatedAtDesc(Long clientId);

    List<Reservation> findAllByFreelancerProfileMemberIdOrderByCreatedAtDesc(Long memberId);
}
