package com.wedge.backend.domain.freelancer.dto;

import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class FreelancerProfileResponse {

    private final Long id;
    private final Long memberId;
    private final String memberName;
    private final Long categoryId;
    private final String title;
    private final String introduction;
    private final String portfolioImageUrl;
    private final String region;
    private final Integer price;
    private final int careerYears;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    private FreelancerProfileResponse(FreelancerProfile profile, String portfolioImageUrl) {
        this.id = profile.getId();
        this.memberId = profile.getMember().getId();
        this.memberName = profile.getMember().getName();
        this.categoryId = profile.getCategory().getId();
        this.title = profile.getTitle();
        this.introduction = profile.getIntroduction();
        this.portfolioImageUrl = portfolioImageUrl;
        this.region = profile.getRegion();
        this.price = profile.getPrice();
        this.careerYears = profile.getCareerYears();
        this.createdAt = profile.getCreatedAt();
        this.updatedAt = profile.getUpdatedAt();
    }

    public static FreelancerProfileResponse from(FreelancerProfile profile, String portfolioImageUrl) {
        return new FreelancerProfileResponse(profile, portfolioImageUrl);
    }
}