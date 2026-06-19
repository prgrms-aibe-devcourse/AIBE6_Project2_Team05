package com.wedge.backend.domain.member.controller;

import com.wedge.backend.domain.member.dto.MemberMeResponse;
import com.wedge.backend.domain.member.dto.MemberUpdateRequest;
import com.wedge.backend.domain.member.entity.Role;
import com.wedge.backend.domain.member.service.MemberService;
import com.wedge.backend.domain.recruit.dto.RecruitPostResponse;
import com.wedge.backend.domain.recruit.service.RecruitPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final RecruitPostService recruitPostService;

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

    @PatchMapping(value = "/me/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MemberMeResponse> updateProfileImage(
            Authentication authentication,
            @RequestParam MultipartFile image) throws IOException {
        Long memberId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(memberService.updateProfileImage(memberId, image));
    }

    @DeleteMapping("/me/image")
    public ResponseEntity<MemberMeResponse> removeProfileImage(Authentication authentication) {
        Long memberId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(memberService.removeProfileImage(memberId));
    }

    @PatchMapping("/me/role")
    public ResponseEntity<MemberMeResponse> changeRole(Authentication authentication,
                                                        @RequestParam Role role) {
        Long memberId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(memberService.changeRole(memberId, role));
    }

    @GetMapping("/me/jobs")
    public ResponseEntity<List<RecruitPostResponse>> getMyRecruitPosts(Authentication authentication) {
        Long memberId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(recruitPostService.getMyRecruitPosts(memberId));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> withdrawMyAccount(Authentication authentication) {
        Long memberId = (Long) authentication.getPrincipal();
        memberService.withdrawMyAccount(memberId);
        return ResponseEntity.noContent().build();
    }
}
