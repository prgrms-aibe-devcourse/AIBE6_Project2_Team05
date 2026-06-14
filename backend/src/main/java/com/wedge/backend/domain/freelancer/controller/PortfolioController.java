package com.wedge.backend.domain.freelancer.controller;

import com.wedge.backend.domain.freelancer.dto.PortfolioResponseDto;
import com.wedge.backend.domain.freelancer.service.PortfolioService;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/freelancers/{profileId}/portfolios")
public class PortfolioController {

    private final PortfolioService portfolioService;
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

    @GetMapping
    public ResponseEntity<List<PortfolioResponseDto>> getPortfolios(
            @PathVariable Long profileId) {
        return ResponseEntity.ok(portfolioService.getPortfolios(profileId));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<PortfolioResponseDto> createPortfolio(
            @PathVariable Long profileId,
            @RequestParam MultipartFile image,
            @RequestParam(required = false) String description,
            @RequestParam(defaultValue = "0") int sortOrder) throws IOException {
        return ResponseEntity.ok(portfolioService.createPortfolio(getCurrentMember(), profileId, image, description, sortOrder));
    }

    @DeleteMapping("/{portfolioId}")
    public ResponseEntity<Void> deletePortfolio(
            @PathVariable Long profileId,
            @PathVariable Long portfolioId) {
        portfolioService.deletePortfolio(getCurrentMember(), portfolioId);
        return ResponseEntity.noContent().build();
    }
}