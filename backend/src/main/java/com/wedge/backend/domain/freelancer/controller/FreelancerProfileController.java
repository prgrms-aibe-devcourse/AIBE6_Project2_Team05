package com.wedge.backend.domain.freelancer.controller;

import com.wedge.backend.domain.freelancer.dto.FreelancerProfileRequestDto;
import com.wedge.backend.domain.freelancer.service.FreelancerProfileService;
import com.wedge.backend.domain.freelancer.dto.FreelancerProfileResponseDto;
import com.wedge.backend.domain.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/freelancers")
public class FreelancerProfileController {

    private final FreelancerProfileService freelancerProfileService;

    // 프로필 등록
    @PostMapping("/profile")
    public ResponseEntity<FreelancerProfileResponseDto> createProfile(
            @AuthenticationPrincipal Member member,
            @RequestBody FreelancerProfileRequestDto request) {
        return ResponseEntity.ok(freelancerProfileService.createProfile(member, request));
    }

    // 프로필 조회
    @GetMapping("/{profileId}")
    public ResponseEntity<FreelancerProfileResponseDto> getProfile(
            @PathVariable Long profileId) {
        return ResponseEntity.ok(freelancerProfileService.getProfile(profileId));
    }

    // 프로필 수정
    @PutMapping("/{profileId}")
    public ResponseEntity<FreelancerProfileResponseDto> updateProfile(
            @PathVariable Long profileId,
            @AuthenticationPrincipal Member member,
            @RequestBody FreelancerProfileRequestDto request) {
        return ResponseEntity.ok(freelancerProfileService.updateProfile(profileId, member, request));
    }
}