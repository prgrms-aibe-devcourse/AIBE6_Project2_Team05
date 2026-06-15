package com.wedge.backend.domain.freelancer.service;

import com.wedge.backend.domain.freelancer.dto.PortfolioResponseDto;
import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import com.wedge.backend.domain.freelancer.entity.Portfolio;
import com.wedge.backend.domain.freelancer.repository.FreelancerProfileRepository;
import com.wedge.backend.domain.freelancer.repository.PortfolioRepository;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.global.storage.R2FileUploadService;
import com.wedge.backend.global.util.FileValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final R2FileUploadService r2FileUploadService;

    // 포트폴리오 목록 조회
    @Transactional(readOnly = true)
    public List<PortfolioResponseDto> getPortfolios(Long profileId, boolean isLoggedIn) {
        List<PortfolioResponseDto> portfolios = portfolioRepository.findByFreelancerProfileIdOrderBySortOrder(profileId)
                .stream()
                .map(PortfolioResponseDto::new)
                .collect(Collectors.toList());

        // 비로그인 시 3장만 노출
        if (!isLoggedIn && portfolios.size() > 3) {
            return portfolios.subList(0, 3);
        }
        return portfolios;
    }

    // 포트폴리오 등록
    @Transactional
    public PortfolioResponseDto createPortfolio(Member member, Long profileId,
                                                MultipartFile image, String description, int sortOrder) throws IOException {
        FreelancerProfile profile = freelancerProfileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("프로필을 찾을 수 없습니다."));
        if (!profile.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("등록 권한이 없습니다.");
        }

        FileValidator.validate(image);

        String imageUrl = r2FileUploadService.upload(image, "portfolios");

        Portfolio portfolio = Portfolio.builder()
                .freelancerProfile(profile)
                .imageUrl(imageUrl)
                .description(description)
                .sortOrder(sortOrder)
                .build();
        return new PortfolioResponseDto(portfolioRepository.save(portfolio));
    }

    // 포트폴리오 삭제
    @Transactional
    public void deletePortfolio(Member member, Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new IllegalArgumentException("포트폴리오를 찾을 수 없습니다."));
        if (!portfolio.getFreelancerProfile().getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }
        r2FileUploadService.delete(portfolio.getImageUrl());
        portfolioRepository.delete(portfolio);
    }
}