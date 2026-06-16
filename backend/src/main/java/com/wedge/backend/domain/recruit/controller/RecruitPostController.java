package com.wedge.backend.domain.recruit.controller;

import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.service.MemberService;
import com.wedge.backend.domain.recruit.dto.RecruitPostRequest;
import com.wedge.backend.domain.recruit.dto.RecruitPostResponse;
import com.wedge.backend.domain.recruit.entity.RecruitStatus;
import com.wedge.backend.domain.recruit.service.RecruitPostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/jobs")
@Tag(name = "구인글 (RecruitPost)", description = "구인글 등록 / 수정 / 삭제 / 상태변경 API")
public class RecruitPostController {

    private final RecruitPostService recruitPostService;
    private final MemberService memberService;

    @PostMapping
    @Operation(summary = "구인글 등록", description = "로그인한 회원이 구인글을 등록합니다.")
    public ResponseEntity<Map<String, Long>> createRecruitPost(
            Authentication authentication,
            @RequestBody @Valid RecruitPostRequest request) {
        Long postId = recruitPostService.createRecruitPost(getAuthenticatedMember(authentication), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("postId", postId));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "구인글 수정", description = "작성자 본인만 수정할 수 있습니다.")
    public ResponseEntity<RecruitPostResponse> updateRecruitPost(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody @Valid RecruitPostRequest request) {
        return ResponseEntity.ok(recruitPostService.updateRecruitPost(id, getAuthenticatedMember(authentication), request));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "구인글 상태 변경", description = "작성자 본인이 OPEN / CLOSED 상태를 변경합니다.")
    public ResponseEntity<RecruitPostResponse> changeStatus(
            @PathVariable Long id,
            Authentication authentication,
            @RequestParam RecruitStatus status) {
        return ResponseEntity.ok(recruitPostService.changeStatus(id, getAuthenticatedMember(authentication), status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "구인글 삭제", description = "작성자 본인만 삭제할 수 있습니다.")
    public ResponseEntity<Void> deleteRecruitPost(
            @PathVariable Long id,
            Authentication authentication) {
        recruitPostService.deleteRecruitPost(id, getAuthenticatedMember(authentication));
        return ResponseEntity.noContent().build();
    }

    private Member getAuthenticatedMember(Authentication authentication) {
        return memberService.getMember((Long) authentication.getPrincipal());
    }
}
