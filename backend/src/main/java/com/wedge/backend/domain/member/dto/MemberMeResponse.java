package com.wedge.backend.domain.member.dto;

import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.entity.MemberStatus;
import com.wedge.backend.domain.member.entity.Provider;
import com.wedge.backend.domain.member.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MemberMeResponse {

    private Long id;
    private String email;
    private String name;
    private String phone;
    private Role role;
    private Provider provider;
    private MemberStatus status;

    public static MemberMeResponse from(Member member) {
        return new MemberMeResponse(
                member.getId(),
                member.getEmail(),
                member.getName(),
                member.getPhone(),
                member.getRole(),
                member.getProvider(),
                member.getStatus()
        );
    }
}
