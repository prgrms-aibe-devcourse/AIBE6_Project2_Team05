package com.wedge.backend.domain.review.controller;

import com.wedge.backend.domain.review.dto.ReviewResponseDto;
import com.wedge.backend.domain.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "리뷰", description = "프리랜서 리뷰 목록 조회 API")
@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "리뷰 목록 조회", description = "프리랜서 프로필의 리뷰 목록을 조회합니다. 비로그인 사용자도 조회 가능합니다.")
    @GetMapping("/api/freelancers/{profileId}/reviews")
    public ResponseEntity<List<ReviewResponseDto>> getReviews(
            @PathVariable Long profileId) {
        return ResponseEntity.ok(reviewService.getReviews(profileId));
    }

    @Operation(summary = "내 리뷰 목록 조회", description = "로그인한 회원이 작성한 리뷰 목록을 조회합니다.")
    @GetMapping("/api/v1/reviews/me")
    public ResponseEntity<List<ReviewResponseDto>> getMyReviews(Authentication authentication) {
        Long memberId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(reviewService.getMyReviews(memberId));
    }
}