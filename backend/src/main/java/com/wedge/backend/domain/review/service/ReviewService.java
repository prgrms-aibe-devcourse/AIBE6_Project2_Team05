package com.wedge.backend.domain.review.service;

import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.entity.Role;
import com.wedge.backend.domain.member.service.MemberService;
import com.wedge.backend.domain.reservations.entity.Reservation;
import com.wedge.backend.domain.reservations.entity.ReservationStatus;
import com.wedge.backend.domain.reservations.repository.ReservationRepository;
import com.wedge.backend.domain.review.dto.ReviewRequestDto;
import com.wedge.backend.domain.review.dto.ReviewResponseDto;
import com.wedge.backend.domain.review.entity.Review;
import com.wedge.backend.domain.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;
    private final MemberService memberService;

    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getReviews(Long freelancerProfileId) {
        return reviewRepository.findByFreelancerProfileId(freelancerProfileId)
                .stream()
                .map(ReviewResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getMyReviews(Long memberId) {
        return reviewRepository.findByMemberId(memberId)
                .stream()
                .map(ReviewResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewResponseDto createReview(Long memberId, Long reservationId, ReviewRequestDto request) {
        Member member = memberService.getMember(memberId);

        validateClientRole(member);
        validateRequest(request);

        Reservation reservation = findReservation(reservationId);

        validateReservationOwner(reservation, member);
        validateCompletedReservation(reservation);

        Review review = reviewRepository.findByReservationId(reservationId)
                .orElseGet(() -> Review.builder()
                        .member(member)
                        .freelancerProfile(reservation.getFreelancerProfile())
                        .reservation(reservation)
                        .rating(request.getRating())
                        .content(request.getContent().trim())
                        .build());

        review.update(request.getRating(), request.getContent().trim());

        return new ReviewResponseDto(reviewRepository.save(review));
    }

    @Transactional(readOnly = true)
    public ReviewResponseDto getReservationReview(Long memberId, Long reservationId) {
        Member member = memberService.getMember(memberId);
        Reservation reservation = findReservation(reservationId);
        validateReviewAccess(reservation, member);

        Review review = reviewRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("등록된 리뷰가 없습니다."));

        return new ReviewResponseDto(review);
    }

    @Transactional
    public ReviewResponseDto updateReservationReview(Long memberId, Long reservationId, ReviewRequestDto request) {
        Member member = memberService.getMember(memberId);
        validateClientRole(member);
        validateRequest(request);

        Reservation reservation = findReservation(reservationId);
        validateReservationOwner(reservation, member);
        validateCompletedReservation(reservation);

        Review review = reviewRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("등록된 리뷰가 없습니다."));

        review.update(request.getRating(), request.getContent().trim());

        return new ReviewResponseDto(reviewRepository.save(review));
    }

    private Reservation findReservation(Long reservationId) {
        return reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));
    }

    private void validateMember(Member member) {
        if (member == null || member.getId() == null) {
            throw new IllegalArgumentException("회원을 찾을 수 없습니다.");
        }
    }

    private void validateClientRole(Member member) {
        if (member.getRole() != Role.CLIENT) {
            throw new IllegalStateException("리뷰 등록 권한이 없습니다.");
        }
    }

    private void validateRequest(ReviewRequestDto request) {
        if (request == null) {
            throw new IllegalArgumentException("리뷰 요청은 필수입니다.");
        }
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("별점은 1점 이상 5점 이하로 입력해주세요.");
        }
        if (request.getContent() == null || request.getContent().trim().length() < 10) {
            throw new IllegalArgumentException("리뷰 내용은 10자 이상 입력해주세요.");
        }
    }

    private void validateReservationOwner(Reservation reservation, Member member) {
        if (!reservation.getClient().getId().equals(member.getId())) {
            throw new IllegalStateException("본인의 예약에만 리뷰를 등록할 수 있습니다.");
        }
    }

    private void validateReviewAccess(Reservation reservation, Member member) {
        boolean isClient = reservation.getClient().getId().equals(member.getId());
        boolean isFreelancer = reservation.getFreelancerProfile().getMember().getId().equals(member.getId());
        if (!isClient && !isFreelancer) {
            throw new IllegalStateException("리뷰 조회 권한이 없습니다.");
        }
    }

    private void validateCompletedReservation(Reservation reservation) {
        if (reservation.getStatus() != ReservationStatus.COMPLETED) {
            throw new IllegalStateException("완료된 예약에만 리뷰를 등록할 수 있습니다.");
        }
    }
}
