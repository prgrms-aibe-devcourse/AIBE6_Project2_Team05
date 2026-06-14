package com.wedge.backend.domain.review.controller;

import com.wedge.backend.domain.review.dto.ReviewResponseDto;
import com.wedge.backend.domain.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "리뷰", description = "프리랜서 리뷰 목록 조회 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/freelancers/{profileId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "리뷰 목록 조회", description = "프리랜서 프로필의 리뷰 목록을 조회합니다. 비로그인 사용자도 조회 가능합니다.")
    @GetMapping
    public ResponseEntity<List<ReviewResponseDto>> getReviews(
            @PathVariable Long profileId) {
        return ResponseEntity.ok(reviewService.getReviews(profileId));
    }
}