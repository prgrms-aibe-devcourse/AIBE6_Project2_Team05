package com.wedge.backend.domain.freelancer.controller;

import com.wedge.backend.domain.freelancer.dto.FreelancerProfileRequestDto;
import com.wedge.backend.domain.freelancer.dto.FreelancerProfileResponseDto;
import com.wedge.backend.domain.freelancer.dto.IntroductionGenerateRequest;
import com.wedge.backend.domain.freelancer.dto.IntroductionGenerateResponse;
import com.wedge.backend.domain.freelancer.service.AiIntroductionService;
import com.wedge.backend.domain.freelancer.service.FreelancerProfileService;
import com.wedge.backend.global.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "프리랜서 프로필", description = "프리랜서 프로필 등록/수정/삭제/조회 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/freelancers")
public class FreelancerProfileController {

    private final FreelancerProfileService freelancerProfileService;
    private final AiIntroductionService aiIntroductionService;
    private final AuthUtil authUtil;

    @Operation(summary = "프리랜서 프로필 등록", description = "로그인한 프리랜서가 프로필을 등록합니다. 프리랜서당 1개만 생성 가능합니다.")
    @PostMapping("/profile")
    public ResponseEntity<FreelancerProfileResponseDto> createProfile(
            @RequestBody FreelancerProfileRequestDto request) {
        return ResponseEntity.ok(freelancerProfileService.createProfile(authUtil.getCurrentMember(), request));
    }

    @Operation(summary = "프리랜서 프로필 조회", description = "profileId로 프리랜서 프로필을 조회합니다. 비로그인 사용자도 조회 가능합니다.")
    @GetMapping("/{profileId}")
    public ResponseEntity<FreelancerProfileResponseDto> getProfile(
            @PathVariable Long profileId) {
        return ResponseEntity.ok(freelancerProfileService.getProfile(profileId));
    }

    @Operation(summary = "프리랜서 프로필 삭제", description = "본인 프로필만 삭제 가능합니다.")
    @DeleteMapping("/{profileId}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long profileId) {
        freelancerProfileService.deleteProfile(profileId, authUtil.getCurrentMember());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "프리랜서 프로필 수정", description = "본인 프로필만 수정 가능합니다.")
    @PutMapping("/{profileId}")
    public ResponseEntity<FreelancerProfileResponseDto> updateProfile(
            @PathVariable Long profileId,
            @RequestBody FreelancerProfileRequestDto request) {
        return ResponseEntity.ok(freelancerProfileService.updateProfile(profileId, authUtil.getCurrentMember(), request));
    }

    @Operation(summary = "AI 소개글 생성", description = "카테고리와 키워드를 기반으로 AI 소개글 초안을 생성합니다.")
    @PostMapping("/introduction/generate")
    public ResponseEntity<IntroductionGenerateResponse> generateIntroduction(
            @Valid @RequestBody IntroductionGenerateRequest request) {
        return ResponseEntity.ok(aiIntroductionService.generateIntroduction(request));
    }
}