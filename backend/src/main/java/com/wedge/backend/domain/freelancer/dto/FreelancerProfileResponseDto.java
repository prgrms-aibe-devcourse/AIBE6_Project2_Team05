package com.wedge.backend.domain.freelancer.dto;

import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import lombok.Getter;

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
    }
}