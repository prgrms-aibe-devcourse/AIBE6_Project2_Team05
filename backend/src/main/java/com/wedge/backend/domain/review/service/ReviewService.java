package com.wedge.backend.domain.review.service;

import com.wedge.backend.domain.review.dto.ReviewResponseDto;
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

    // 프리랜서 프로필 리뷰 목록 조회
    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getReviews(Long freelancerProfileId) {
        return reviewRepository.findByFreelancerProfileId(freelancerProfileId)
                .stream()
                .map(ReviewResponseDto::new)
                .collect(Collectors.toList());
    }

    // 내 리뷰 목록 조회
    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getMyReviews(Long memberId) {
        return reviewRepository.findByMemberId(memberId)
                .stream()
                .map(ReviewResponseDto::new)
                .collect(Collectors.toList());
    }
}