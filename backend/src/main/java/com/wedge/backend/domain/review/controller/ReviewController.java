package com.wedge.backend.domain.review.controller;

import com.wedge.backend.domain.review.dto.ReviewRequestDto;
import com.wedge.backend.domain.review.dto.ReviewResponseDto;
import com.wedge.backend.domain.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "리뷰", description = "프리랜서 리뷰 등록/조회 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "리뷰 목록 조회", description = "프리랜서 프로필의 리뷰 목록을 조회합니다. 비로그인 사용자도 조회 가능합니다.")
    @GetMapping("/freelancers/{profileId}/reviews")
    public ResponseEntity<List<ReviewResponseDto>> getReviews(
            @PathVariable Long profileId) {
        return ResponseEntity.ok(reviewService.getReviews(profileId));
    }

    @Operation(summary = "내 리뷰 목록 조회", description = "로그인한 회원이 작성한 리뷰 목록을 조회합니다.")
    @GetMapping("/v1/reviews/me")
    public ResponseEntity<List<ReviewResponseDto>> getMyReviews(Authentication authentication) {
        Long memberId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(reviewService.getMyReviews(memberId));
    }

    @Operation(summary = "리뷰 등록", description = "완료된 예약에 대해 예약자 회원이 리뷰를 등록합니다.")
    @PostMapping("/v1/reservations/{reservationId}/reviews")
    public ResponseEntity<ReviewResponseDto> createReview(
            Authentication authentication,
            @PathVariable Long reservationId,
            @RequestBody ReviewRequestDto request) {
        Long memberId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(reviewService.createReview(memberId, reservationId, request));
    }

    @Operation(summary = "예약 리뷰 조회", description = "예약에 등록된 리뷰를 조회합니다.")
    @GetMapping("/v1/reservations/{reservationId}/reviews")
    public ResponseEntity<ReviewResponseDto> getReservationReview(
            Authentication authentication,
            @PathVariable Long reservationId) {
        Long memberId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(reviewService.getReservationReview(memberId, reservationId));
    }

    @Operation(summary = "리뷰 수정", description = "완료된 예약에 등록한 리뷰를 수정합니다.")
    @PutMapping("/v1/reservations/{reservationId}/reviews")
    public ResponseEntity<ReviewResponseDto> updateReview(
            Authentication authentication,
            @PathVariable Long reservationId,
            @RequestBody ReviewRequestDto request) {
        Long memberId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(reviewService.updateReservationReview(memberId, reservationId, request));
    }

}