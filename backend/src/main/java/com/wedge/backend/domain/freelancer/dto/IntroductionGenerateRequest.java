package com.wedge.backend.domain.freelancer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class IntroductionGenerateRequest {

    @NotBlank(message = "카테고리명은 필수입니다.")
    private String categoryName;

    @NotBlank(message = "키워드는 필수입니다.")
    private String keywords;
}