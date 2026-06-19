package com.wedge.backend.domain.freelancer.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FreelancerProfileRequestDto {
    private Long categoryId;
    private String title;
    private String introduction;
    private String selfIntroduction;
    private String keywords;
    private String region;
    private Integer price;
    private int careerYears;
}