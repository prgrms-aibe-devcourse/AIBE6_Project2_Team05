package com.wedge.backend.domain.recruit.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class RecruitPostRequest {

    @NotBlank(message = "제목을 입력해주세요.")
    private String title;

    @NotBlank(message = "내용을 입력해주세요.")
    private String content;

    @NotNull(message = "카테고리를 선택해주세요.")
    private Long categoryId;

    @Min(value = 0, message = "예산은 0 이상이어야 합니다.")
    private Integer budget;

    @NotNull(message = "웨딩 예정일을 입력해주세요.")
    private LocalDate weddingDate;

    private String region;
}
