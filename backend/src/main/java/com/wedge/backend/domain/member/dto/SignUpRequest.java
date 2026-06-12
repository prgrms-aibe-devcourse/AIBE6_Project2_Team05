package com.wedge.backend.domain.member.dto;

import com.wedge.backend.domain.member.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class SignUpRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다.") // 최소 8자부터 가능 ~!
    private String password;

    @NotBlank
    private String name;

    private String phone;

    @NotNull
    private Role role;
}
