package com.wedge.backend.domain.freelancer.dto;

import lombok.Getter;

@Getter
public class IntroductionGenerateResponse {

    private final String introduction;

    private IntroductionGenerateResponse(String introduction) {
        this.introduction = introduction;
    }

    public static IntroductionGenerateResponse from(String introduction) {
        return new IntroductionGenerateResponse(introduction);
    }
}