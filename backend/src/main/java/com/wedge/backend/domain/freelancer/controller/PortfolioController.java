package com.wedge.backend.domain.freelancer.controller;

import com.wedge.backend.domain.freelancer.dto.PortfolioResponseDto;
import com.wedge.backend.domain.freelancer.service.PortfolioService;
import com.wedge.backend.global.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @Operation(summary = "포트폴리오 목록 조회", description = "프리랜서의 포트폴리오 목록을 sortOrder 순으로 조회합니다. 비로그인 사용자도 조회 가능합니다.")
    @GetMapping
    public ResponseEntity<List<PortfolioResponseDto>> getPortfolios(
            @PathVariable Long profileId) {
        return ResponseEntity.ok(portfolioService.getPortfolios(profileId));
    }

    @Operation(summary = "포트폴리오 등록", description = "이미지를 Cloudflare R2에 업로드하고 포트폴리오를 등록합니다. 본인 프로필에만 등록 가능합니다. 파일 크기 10MB 이하.")
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<PortfolioResponseDto> createPortfolio(
            @PathVariable Long profileId,
            @RequestParam MultipartFile image,
            @RequestParam(required = false) String description,
            @RequestParam(defaultValue = "0") int sortOrder) throws IOException {
        return ResponseEntity.ok(portfolioService.createPortfolio(authUtil.getCurrentMember(), profileId, image, description, sortOrder));
    }

    @Operation(summary = "포트폴리오 삭제", description = "포트폴리오와 R2 이미지를 함께 삭제합니다. 본인 포트폴리오만 삭제 가능합니다.")
    @DeleteMapping("/{portfolioId}")
    public ResponseEntity<Void> deletePortfolio(
            @PathVariable Long profileId,
            @PathVariable Long portfolioId) {
        portfolioService.deletePortfolio(authUtil.getCurrentMember(), portfolioId);
        return ResponseEntity.noContent().build();
    }
}