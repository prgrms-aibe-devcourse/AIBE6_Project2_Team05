package com.wedge.backend.domain.review.dto;

import com.wedge.backend.domain.review.entity.Review;
import lombok.Getter;

@Getter
public class ReviewResponseDto {
    private Long id;
    private Long reservationId;
    private Long memberId;
    private String memberName;
    private Long freelancerProfileId; // 추가
    private int rating;
    private String content;
    private String createdAt;

    public ReviewResponseDto(Review review) {
        this.id = review.getId();
        this.reservationId = review.getReservation().getId();
        this.memberId = review.getMember().getId();
        this.memberName = review.getMember().getName();
        this.freelancerProfileId = review.getFreelancerProfile().getId(); // 추가
        this.rating = review.getRating();
        this.content = review.getContent();
        this.createdAt = review.getCreatedAt().toString();
    }
}
