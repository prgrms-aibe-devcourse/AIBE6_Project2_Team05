package com.wedge.backend.domain.freelancer.service;

import com.wedge.backend.domain.category.entity.Category;
import com.wedge.backend.domain.category.repository.CategoryRepository;
import com.wedge.backend.domain.freelancer.dto.FreelancerProfileRequestDto;
import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import com.wedge.backend.domain.freelancer.dto.FreelancerProfileResponseDto;
import com.wedge.backend.domain.freelancer.repository.FreelancerProfileRepository;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.global.exception.FreelancerNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FreelancerProfileService {

    private final FreelancerProfileRepository freelancerProfileRepository;
    private final CategoryRepository categoryRepository;

    // 프로필 등록
    @Transactional
    public FreelancerProfileResponseDto createProfile(Member member, FreelancerProfileRequestDto request) {
        if (freelancerProfileRepository.existsByMemberId(member.getId())) {
            throw new IllegalStateException("이미 프로필이 존재합니다.");
        }
        Category category = findCategoryById(request.getCategoryId());

        FreelancerProfile profile = FreelancerProfile.builder()
                .member(member)
                .category(category)
                .title(request.getTitle())
                .introduction(request.getIntroduction())
                .keywords(request.getKeywords())
                .region(request.getRegion())
                .price(request.getPrice())
                .careerYears(request.getCareerYears())
                .build();
        return new FreelancerProfileResponseDto(freelancerProfileRepository.save(profile));
    }

    // 프로필 조회
    @Transactional(readOnly = true)
    public FreelancerProfileResponseDto getProfile(Long profileId) {
        FreelancerProfile profile = freelancerProfileRepository.findById(profileId)
                .orElseThrow(() -> new FreelancerNotFoundException("프로필을 찾을 수 없습니다."));
        return new FreelancerProfileResponseDto(profile);
    }

    // 프로필 수정
    @Transactional
    public FreelancerProfileResponseDto updateProfile(Long profileId, Member member, FreelancerProfileRequestDto request) {
        FreelancerProfile profile = freelancerProfileRepository.findById(profileId)
                .orElseThrow(() -> new FreelancerNotFoundException("프로필을 찾을 수 없습니다."));
        if (!profile.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("수정 권한이 없습니다.");
        }
        Category category = findCategoryById(request.getCategoryId());

        profile.update(category, request.getTitle(), request.getIntroduction(),
                request.getKeywords(),
                request.getRegion(), request.getPrice(), request.getCareerYears());
        return new FreelancerProfileResponseDto(profile);
    }

    // 프로필 삭제
    @Transactional
    public void deleteProfile(Long profileId, Member member) {
        FreelancerProfile profile = freelancerProfileRepository.findById(profileId)
                .orElseThrow(() -> new FreelancerNotFoundException("프로필을 찾을 수 없습니다."));
        if (!profile.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }
        freelancerProfileRepository.delete(profile);
    }

    // 카테고리 조회 공통 메서드
    private Category findCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));
    }
}