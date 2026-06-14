package com.wedge.backend.domain.freelancer.controller;

import com.wedge.backend.domain.freelancer.dto.FreelancerProfileRequestDto;
import com.wedge.backend.domain.freelancer.dto.FreelancerProfileResponseDto;
import com.wedge.backend.domain.freelancer.service.FreelancerProfileService;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/freelancers")
public class FreelancerProfileController {

    private final FreelancerProfileService freelancerProfileService;
    private final MemberRepository memberRepository;

    private Member getCurrentMember() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            throw new IllegalArgumentException("인증이 필요합니다.");
        }
        Long memberId = Long.parseLong(authentication.getName());
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
    }

    @PostMapping("/profile")
    public ResponseEntity<FreelancerProfileResponseDto> createProfile(
            @RequestBody FreelancerProfileRequestDto request) {
        return ResponseEntity.ok(freelancerProfileService.createProfile(getCurrentMember(), request));
    }

    @GetMapping("/{profileId}")
    public ResponseEntity<FreelancerProfileResponseDto> getProfile(
            @PathVariable Long profileId) {
        return ResponseEntity.ok(freelancerProfileService.getProfile(profileId));
    }

    @PutMapping("/{profileId}")
    public ResponseEntity<FreelancerProfileResponseDto> updateProfile(
            @PathVariable Long profileId,
            @RequestBody FreelancerProfileRequestDto request) {
        return ResponseEntity.ok(freelancerProfileService.updateProfile(profileId, getCurrentMember(), request));
    }
}