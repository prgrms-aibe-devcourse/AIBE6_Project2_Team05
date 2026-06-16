package com.wedge.backend.domain.freelancer.dto;

import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import lombok.Getter;

@Getter
public class AiRecommendationResponse {

    private final Long freelancerProfileId;
    private final String title;
    private final String region;
    private final Integer price;
    private final int careerYears;
    private final String recommendReason;

    private AiRecommendationResponse(FreelancerProfile profile, String recommendReason) {
        this.freelancerProfileId = profile.getId();
        this.title = profile.getTitle();
        this.region = profile.getRegion();
        this.price = profile.getPrice();
        this.careerYears = profile.getCareerYears();
        this.recommendReason = recommendReason;
    }

    public static AiRecommendationResponse of(FreelancerProfile profile, String recommendReason) {
        return new AiRecommendationResponse(profile, recommendReason);
    }
}