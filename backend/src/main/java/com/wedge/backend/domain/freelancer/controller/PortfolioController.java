package com.wedge.backend.domain.freelancer.controller;

import com.wedge.backend.domain.freelancer.dto.PortfolioRequestDto;
import com.wedge.backend.domain.freelancer.dto.PortfolioResponseDto;
import com.wedge.backend.domain.freelancer.service.PortfolioService;
import com.wedge.backend.global.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Tag(name = "포트폴리오", description = "프리랜서 포트폴리오 등록/삭제/조회 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/freelancers/{profileId}/portfolios")
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final AuthUtil authUtil;

    @Operation(summary = "포트폴리오 목록 조회")
    @GetMapping
    public ResponseEntity<List<PortfolioResponseDto>> getPortfolios(
            @PathVariable Long profileId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isLoggedIn = auth != null && auth.isAuthenticated()
                && !auth.getPrincipal().equals("anonymousUser");
        return ResponseEntity.ok(portfolioService.getPortfolios(profileId, isLoggedIn));
    }

    @Operation(summary = "포트폴리오 등록")
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<PortfolioResponseDto> createPortfolio(
            @PathVariable Long profileId,
            @RequestParam MultipartFile image,
            @ModelAttribute PortfolioRequestDto dto) throws IOException {
        return ResponseEntity.ok(
                portfolioService.createPortfolio(authUtil.getCurrentMember(), profileId, image, dto));
    }

    @Operation(summary = "포트폴리오 추가 이미지 업로드")
    @PostMapping(value = "/{portfolioId}/images", consumes = "multipart/form-data")
    public ResponseEntity<PortfolioResponseDto> addImage(
            @PathVariable Long profileId,
            @PathVariable Long portfolioId,
            @RequestParam MultipartFile image) throws IOException {
        return ResponseEntity.ok(
                portfolioService.addImage(authUtil.getCurrentMember(), portfolioId, image));
    }

    @Operation(summary = "포트폴리오 추가 이미지 삭제")
    @DeleteMapping("/{portfolioId}/images/{imageId}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long profileId,
            @PathVariable Long portfolioId,
            @PathVariable Long imageId) {
        portfolioService.deleteImage(authUtil.getCurrentMember(), portfolioId, imageId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "포트폴리오 수정")
    @PatchMapping(value = "/{portfolioId}", consumes = "multipart/form-data")
    public ResponseEntity<PortfolioResponseDto> updatePortfolio(
            @PathVariable Long profileId,
            @PathVariable Long portfolioId,
            @RequestParam(required = false) MultipartFile image,
            @ModelAttribute PortfolioRequestDto dto) throws IOException {
        return ResponseEntity.ok(
                portfolioService.updatePortfolio(authUtil.getCurrentMember(), portfolioId, image, dto));
    }

    @Operation(summary = "포트폴리오 삭제")
    @DeleteMapping("/{portfolioId}")
    public ResponseEntity<Void> deletePortfolio(
            @PathVariable Long profileId,
            @PathVariable Long portfolioId) {
        portfolioService.deletePortfolio(authUtil.getCurrentMember(), portfolioId);
        return ResponseEntity.noContent().build();
    }
}