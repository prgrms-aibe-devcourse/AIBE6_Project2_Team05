package com.wedge.backend.domain.freelancer.dto;

import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import com.wedge.backend.domain.review.entity.Review;
import lombok.Getter;

import java.util.List;

@Getter
public class FreelancerProfileResponseDto {
    private Long id;
    private Long memberId;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String introduction;
    private String region;
    private Integer price;
    private int careerYears;
    private double averageRating;
    private int reviewCount;

    public FreelancerProfileResponseDto(FreelancerProfile profile) {
        this.id = profile.getId();
        this.memberId = profile.getMember().getId();
        this.categoryId = profile.getCategory().getId();
        this.categoryName = profile.getCategory().getName();
        this.title = profile.getTitle();
        this.introduction = profile.getIntroduction();
        this.region = profile.getRegion();
        this.price = profile.getPrice();
        this.careerYears = profile.getCareerYears();

        List<Review> reviews = profile.getReviews();
        this.reviewCount = reviews.size();
        this.averageRating = reviews.isEmpty() ? 0.0
                : reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }
}