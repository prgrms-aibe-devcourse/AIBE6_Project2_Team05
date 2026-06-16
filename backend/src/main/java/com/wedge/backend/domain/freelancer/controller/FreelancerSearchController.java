package com.wedge.backend.domain.freelancer.controller;

import com.wedge.backend.domain.freelancer.dto.AiRecommendationResponse;
import com.wedge.backend.domain.freelancer.dto.FreelancerProfileResponse;
import com.wedge.backend.domain.freelancer.dto.SortType;
import com.wedge.backend.domain.freelancer.service.AiRecommendationService;
import com.wedge.backend.domain.freelancer.service.FreelancerSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/freelancers")
public class FreelancerSearchController {

    private final FreelancerSearchService freelancerSearchService;
    private final AiRecommendationService aiRecommendationService;

    @GetMapping
    public ResponseEntity<Page<FreelancerProfileResponse>> getFreelancers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(defaultValue = "ALL") SortType sortType,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {

        return ResponseEntity.ok(
                freelancerSearchService.getFreelancers(
                        keyword, categoryId, region, minPrice, maxPrice, sortType, pageable));
    }

    @GetMapping("/ai-recommendations")
    public ResponseEntity<List<AiRecommendationResponse>> getAiRecommendations() {
        return ResponseEntity.ok(aiRecommendationService.getRecommendations());
    }
}