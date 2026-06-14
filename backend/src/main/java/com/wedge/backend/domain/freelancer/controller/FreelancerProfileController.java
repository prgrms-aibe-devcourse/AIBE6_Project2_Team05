package com.wedge.backend.domain.freelancer.controller;

import com.wedge.backend.domain.freelancer.dto.FreelancerProfileRequestDto;
import com.wedge.backend.domain.freelancer.dto.FreelancerProfileResponseDto;
import com.wedge.backend.domain.freelancer.service.FreelancerProfileService;
import com.wedge.backend.global.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/freelancers")
public class FreelancerProfileController {

    private final FreelancerProfileService freelancerProfileService;
    private final AuthUtil authUtil;

    @PostMapping("/profile")
    public ResponseEntity<FreelancerProfileResponseDto> createProfile(
            @RequestBody FreelancerProfileRequestDto request) {
        return ResponseEntity.ok(freelancerProfileService.createProfile(authUtil.getCurrentMember(), request));
    }

    @GetMapping("/{profileId}")
    public ResponseEntity<FreelancerProfileResponseDto> getProfile(
            @PathVariable Long profileId) {
        return ResponseEntity.ok(freelancerProfileService.getProfile(profileId));
    }

    @DeleteMapping("/{profileId}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long profileId) {
        freelancerProfileService.deleteProfile(profileId, authUtil.getCurrentMember());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{profileId}")
    public ResponseEntity<FreelancerProfileResponseDto> updateProfile(
            @PathVariable Long profileId,
            @RequestBody FreelancerProfileRequestDto request) {
        return ResponseEntity.ok(freelancerProfileService.updateProfile(profileId, authUtil.getCurrentMember(), request));
    }
}