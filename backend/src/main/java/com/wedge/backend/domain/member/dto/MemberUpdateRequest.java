package com.wedge.backend.domain.member.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class MemberUpdateRequest {

    @NotBlank
    private String name;

    private String phone;
}
