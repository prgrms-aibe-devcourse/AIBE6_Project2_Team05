package com.wedge.backend.domain.member.controller;

import com.wedge.backend.domain.member.dto.MemberMeResponse;
import com.wedge.backend.domain.member.dto.MemberUpdateRequest;
import com.wedge.backend.domain.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/me")
    public ResponseEntity<MemberMeResponse> getMyInfo(Authentication authentication) {
        Long memberId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(memberService.getMyInfo(memberId));
    }

    @PatchMapping("/me")
    public ResponseEntity<MemberMeResponse> updateMyInfo(Authentication authentication,
        @RequestBody 
        @Valid MemberUpdateRequest request) {
        Long memberId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(memberService.updateMyInfo(memberId, request));
    }
}
