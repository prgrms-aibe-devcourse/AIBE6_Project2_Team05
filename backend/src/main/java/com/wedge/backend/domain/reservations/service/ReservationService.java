// 예약 생성, 목록 조회 및 상태 변경 비즈니스 로직
package com.wedge.backend.domain.reservations.service;

import com.wedge.backend.domain.chat.service.ChatService;
import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import com.wedge.backend.domain.freelancer.repository.FreelancerProfileRepository;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.entity.Role;
import com.wedge.backend.domain.reservations.dto.ReservationCreateRequest;
import com.wedge.backend.domain.reservations.dto.ReservationResponse;
import com.wedge.backend.domain.reservations.entity.Reservation;
import com.wedge.backend.domain.reservations.entity.ReservationStatus;
import com.wedge.backend.domain.reservations.repository.ReservationRepository;
import com.wedge.backend.domain.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final ReviewRepository reviewRepository;
    private final ChatService chatService;

    // 회원 권한 검증 후 프리랜서 예약을 생성하고 저장
    @Transactional
    public ReservationResponse createReservation(Member member, ReservationCreateRequest request) {
        validateMember(member);
        validateClientRole(member);
        validateCreateRequest(request);

        FreelancerProfile freelancerProfile = findFreelancerProfile(request.getFreelancerProfileId());
        Reservation reservation = Reservation.create(
                member,
                freelancerProfile,
                request.getReservationDate(),
                request.getRequestMessage()
        );

        return new ReservationResponse(reservationRepository.save(reservation));
    }

    // 회원 역할을 검증하고 예비부부 또는 프리랜서의 예약 목록을 조회
    @Transactional(readOnly = true)
    public List<ReservationResponse> getReservations(Member member) {
        validateMember(member);

        List<Reservation> reservations;
        if (member.getRole() == Role.CLIENT) {
            reservations = reservationRepository.findAllByClientIdOrderByCreatedAtDesc(member.getId());
        } else if (member.getRole() == Role.FREELANCER) {
            reservations = reservationRepository.findAllByFreelancerProfileMemberIdOrderByCreatedAtDesc(member.getId());
        } else {
            throw new IllegalStateException("예약 목록 조회 권한이 없습니다.");
        }

        return reservations.stream()
                .map(this::toReservationResponse)
                .toList();
    }

    // 특정 예약 내역 조회 (본인 확인 권한 검증 포함)
    @Transactional(readOnly = true)
    public ReservationResponse getReservation(Long reservationId, Member member) {
        Reservation reservation = findReservation(reservationId);
        validateReservationAccess(reservation, member);
        return toReservationResponse(reservation);
    }

    // 예약자 권한과 취소 가능한 상태를 검증한 후 예약을 취소
    @Transactional
    public ReservationResponse cancelReservation(Long reservationId, Member member, String cancelReason) {
        Reservation reservation = findReservation(reservationId);
        validateMember(member);

        if (member.getRole() == Role.CLIENT) {
            validateClientOwner(reservation, member);
            validateStatus(reservation, ReservationStatus.REQUESTED);
        } else if (member.getRole() == Role.FREELANCER) {
            validateFreelancerOwner(reservation, member);
            validateStatus(reservation, ReservationStatus.ACCEPTED);
        } else {
            throw new IllegalStateException("예약 취소 권한이 없습니다.");
        }

        reservation.cancel(cancelReason);
        chatService.deactivateRoomByReservationId(reservation.getId());
        return toReservationResponse(reservation);
    }

    // 프리랜서 권한과 요청 상태를 검증한 후 예약을 수락
    @Transactional
    public ReservationResponse acceptReservation(Long reservationId, Member member) {
        Reservation reservation = findReservation(reservationId);
        validateFreelancerOwner(reservation, member);
        validateStatus(reservation, ReservationStatus.REQUESTED);
        reservation.accept();
        return toReservationResponse(reservation);
    }

    // 프리랜서 권한과 요청 상태를 검증한 후 예약을 거절
    @Transactional
    public ReservationResponse rejectReservation(Long reservationId, Member member) {
        Reservation reservation = findReservation(reservationId);
        validateFreelancerOwner(reservation, member);
        validateStatus(reservation, ReservationStatus.REQUESTED);
        reservation.reject();
        return toReservationResponse(reservation);
    }

    // 프리랜서 권한과 수락 상태를 검증한 후 예약을 완료 처리
    @Transactional
    public ReservationResponse completeReservation(Long reservationId, Member member) {
        Reservation reservation = findReservation(reservationId);
        validateFreelancerOwner(reservation, member);
        validateStatus(reservation, ReservationStatus.ACCEPTED);
        reservation.complete();
        return toReservationResponse(reservation);
    }

    private ReservationResponse toReservationResponse(Reservation reservation) {
        Long reviewId = reviewRepository.findByReservationId(reservation.getId())
                .map(review -> review.getId())
                .orElse(null);
        return new ReservationResponse(reservation, reviewId);
    }

    // 프리랜서 프로필 ID로 프로필을 조회하고 없으면 예외 처리
    private FreelancerProfile findFreelancerProfile(Long freelancerProfileId) {
        return freelancerProfileRepository.findById(freelancerProfileId)
                .orElseThrow(() -> new IllegalArgumentException("프리랜서 프로필을 찾을 수 없습니다."));
    }

    // 예약 ID로 예약을 조회하고 없으면 예외 처리
    private Reservation findReservation(Long reservationId) {
        return reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));
    }

    // 로그인 회원 정보의 존재 여부를 검증
    private void validateMember(Member member) {
        if (member == null || member.getId() == null) {
            throw new IllegalArgumentException("회원을 찾을 수 없습니다.");
        }
    }

    // 예약 생성 회원이 예비부부 역할인지 검증
    private void validateClientRole(Member member) {
        if (member.getRole() != Role.CLIENT) {
            throw new IllegalStateException("예약 생성 권한이 없습니다.");
        }
    }

    // 예약 생성 요청의 필수 입력값을 검증
    private void validateCreateRequest(ReservationCreateRequest request) {
        if (request == null || request.getFreelancerProfileId() == null) {
            throw new IllegalArgumentException("프리랜서 프로필 ID는 필수입니다.");
        }
        if (request.getReservationDate() == null) {
            throw new IllegalArgumentException("예약 날짜는 필수입니다.");
        }
    }

    // 예약 취소 요청자가 해당 예약의 예비부부인지 검증
    private void validateClientOwner(Reservation reservation, Member member) {
        validateMember(member);
        if (!reservation.getClient().getId().equals(member.getId())) {
            throw new IllegalStateException("예약 취소 권한이 없습니다.");
        }
    }

    // 상태 변경 요청자가 해당 예약의 프리랜서인지 검증
    private void validateFreelancerOwner(Reservation reservation, Member member) {
        validateMember(member);
        if (!reservation.getFreelancerProfile().getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("예약 상태 변경 권한이 없습니다.");
        }
    }

    private void validateReservationAccess(Reservation reservation, Member member) {
        validateMember(member);
        boolean isClient = reservation.getClient().getId().equals(member.getId());
        boolean isFreelancer = reservation.getFreelancerProfile().getMember().getId().equals(member.getId());
        if (!isClient && !isFreelancer) {
            throw new IllegalStateException("예약 상세 조회 권한이 없습니다.");
        }
    }

    // 현재 예약 상태가 요청한 처리를 허용하는 상태인지 검증
    private void validateStatus(Reservation reservation, ReservationStatus... allowedStatuses) {
        for (ReservationStatus allowedStatus : allowedStatuses) {
            if (reservation.getStatus() == allowedStatus) {
                return;
            }
        }
        throw new IllegalStateException("현재 예약 상태에서는 처리할 수 없습니다.");
    }
}
