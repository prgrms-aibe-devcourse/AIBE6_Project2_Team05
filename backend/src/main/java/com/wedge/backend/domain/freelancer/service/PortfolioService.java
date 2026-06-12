package com.wedge.backend.domain.freelancer.service;

import com.wedge.backend.domain.freelancer.dto.PortfolioResponseDto;
import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import com.wedge.backend.domain.freelancer.entity.Portfolio;
import com.wedge.backend.domain.freelancer.repository.FreelancerProfileRepository;
import com.wedge.backend.domain.freelancer.repository.PortfolioRepository;
import com.wedge.backend.domain.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;

    // 포트폴리오 목록 조회
    @Transactional(readOnly = true)
    public List<PortfolioResponseDto> getPortfolios(Long profileId) {
        return portfolioRepository.findByFreelancerProfileIdOrderBySortOrder(profileId)
                .stream()
                .map(PortfolioResponseDto::new)
                .collect(Collectors.toList());
    }

    // 포트폴리오 등록 (이미지 URL은 R2 업로드 후 전달)
    @Transactional
    public PortfolioResponseDto createPortfolio(Member member, Long profileId,
                                                String imageUrl, String description, int sortOrder) {
        FreelancerProfile profile = freelancerProfileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("프로필을 찾을 수 없습니다."));
        if (!profile.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("등록 권한이 없습니다.");
        }
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
        portfolioRepository.delete(portfolio);
    }
}