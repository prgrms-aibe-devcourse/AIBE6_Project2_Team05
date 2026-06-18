package com.wedge.backend.domain.proposal.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class ProposalRequest {

    @NotBlank(message = "제안 내용을 입력해주세요.")
    private String content;

    @Min(value = 0, message = "가격은 0 이상이어야 합니다.")
    private Integer price;

    private String region;
}
