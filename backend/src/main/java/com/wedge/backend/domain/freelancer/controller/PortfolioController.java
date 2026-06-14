package com.wedge.backend.domain.freelancer.controller;

import com.wedge.backend.domain.freelancer.dto.PortfolioResponseDto;
import com.wedge.backend.domain.freelancer.service.PortfolioService;
import com.wedge.backend.global.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/freelancers/{profileId}/portfolios")
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final AuthUtil authUtil;

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
        return ResponseEntity.ok(portfolioService.createPortfolio(authUtil.getCurrentMember(), profileId, image, description, sortOrder));
    }

    @DeleteMapping("/{portfolioId}")
    public ResponseEntity<Void> deletePortfolio(
            @PathVariable Long profileId,
            @PathVariable Long portfolioId) {
        portfolioService.deletePortfolio(authUtil.getCurrentMember(), portfolioId);
        return ResponseEntity.noContent().build();
    }
}