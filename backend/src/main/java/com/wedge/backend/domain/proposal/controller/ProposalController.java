package com.wedge.backend.domain.proposal.controller;

import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.service.MemberService;
import com.wedge.backend.domain.proposal.dto.ProposalRequest;
import com.wedge.backend.domain.proposal.dto.ProposalResponse;
import com.wedge.backend.domain.proposal.service.ProposalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "제안서 (Proposal)", description = "구인글 입찰 제안서 API")
public class ProposalController {

    private final ProposalService proposalService;
    private final MemberService memberService;

    @PostMapping("/api/v1/jobs/{id}/proposals")
    @Operation(summary = "제안서 제출", description = "프리랜서가 구인글에 제안서를 제출합니다.")
    public ResponseEntity<ProposalResponse> createProposal(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody @Valid ProposalRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(proposalService.createProposal(id, getAuthenticatedMember(authentication), request));
    }

    @GetMapping("/api/v1/jobs/{id}/proposals")
    @Operation(summary = "구인글별 제안서 목록 조회", description = "구인글 작성자만 해당 구인글의 제안서 목록을 조회합니다.")
    public ResponseEntity<List<ProposalResponse>> getProposals(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(proposalService.getProposalsByRecruitPost(id, getAuthenticatedMember(authentication)));
    }

    @GetMapping("/api/v1/members/me/proposals")
    @Operation(summary = "내 제안서 목록 조회", description = "프리랜서 본인이 제출한 제안서 목록을 조회합니다.")
    public ResponseEntity<List<ProposalResponse>> getMyProposals(Authentication authentication) {
        return ResponseEntity.ok(proposalService.getMyProposals(getAuthenticatedMember(authentication)));
    }

    @PatchMapping("/api/v1/proposals/{id}/accept")
    @Operation(summary = "제안서 수락", description = "구인글 작성자가 제안서를 수락하면 예약이 자동 생성됩니다.")
    public ResponseEntity<ProposalResponse> acceptProposal(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(proposalService.acceptProposal(id, getAuthenticatedMember(authentication)));
    }

    @PatchMapping("/api/v1/proposals/{id}/reject")
    @Operation(summary = "제안서 거절", description = "구인글 작성자가 제안서를 거절합니다.")
    public ResponseEntity<ProposalResponse> rejectProposal(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(proposalService.rejectProposal(id, getAuthenticatedMember(authentication)));
    }

    private Member getAuthenticatedMember(Authentication authentication) {
        return memberService.getMember((Long) authentication.getPrincipal());
    }
}
