package com.wedge.backend.domain.freelancer.service;

import com.wedge.backend.domain.category.entity.Category;
import com.wedge.backend.domain.category.repository.CategoryRepository;
import com.wedge.backend.domain.freelancer.dto.FreelancerProfileRequestDto;
import com.wedge.backend.domain.freelancer.dto.FreelancerProfileResponseDto;
import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import com.wedge.backend.domain.freelancer.repository.FreelancerProfileRepository;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.entity.Provider;
import com.wedge.backend.domain.member.entity.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class FreelancerProfileServiceTest {

    @Mock
    private FreelancerProfileRepository freelancerProfileRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private FreelancerProfileService freelancerProfileService;

    private Member member;
    private Member otherMember;
    private Category category;
    private FreelancerProfile profile;
    private FreelancerProfileRequestDto requestDto;

    @BeforeEach
    void setUp() {
        member = Member.builder()
                .email("test@test.com")
                .password("encoded_password")
                .name("테스트유저")
                .role(Role.FREELANCER)
                .provider(Provider.LOCAL)
                .build();

        otherMember = Member.builder()
                .email("other@test.com")
                .name("다른유저")
                .role(Role.FREELANCER)
                .provider(Provider.LOCAL)
                .build();

        ReflectionTestUtils.setField(member, "id", 1L);
        ReflectionTestUtils.setField(otherMember, "id", 2L);

        category = Category.builder()
                .name("헤어/메이크업")
                .build();

        profile = FreelancerProfile.builder()
                .member(member)
                .category(category)
                .title("테스트 타이틀")
                .introduction("소개글")
                .region("서울")
                .price(100000)
                .careerYears(3)
                .build();

        requestDto = new FreelancerProfileRequestDto();
    }

    // ===== 프로필 등록 =====

    @Test
    @DisplayName("프로필 등록 성공")
    void createProfile_success() {
        given(freelancerProfileRepository.existsByMemberId(any())).willReturn(false);
        given(categoryRepository.findById(any())).willReturn(Optional.of(category));
        given(freelancerProfileRepository.save(any())).willReturn(profile);

        FreelancerProfileResponseDto result = freelancerProfileService.createProfile(member, requestDto);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("테스트 타이틀");
        verify(freelancerProfileRepository).save(any());
    }

    @Test
    @DisplayName("프로필 등록 실패 - 이미 프로필 존재")
    void createProfile_fail_alreadyExists() {
        given(freelancerProfileRepository.existsByMemberId(any())).willReturn(true);

        assertThatThrownBy(() -> freelancerProfileService.createProfile(member, requestDto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("이미 프로필이 존재합니다.");
    }

    @Test
    @DisplayName("프로필 등록 실패 - 카테고리 없음")
    void createProfile_fail_categoryNotFound() {
        given(freelancerProfileRepository.existsByMemberId(any())).willReturn(false);
        given(categoryRepository.findById(any())).willReturn(Optional.empty());

        assertThatThrownBy(() -> freelancerProfileService.createProfile(member, requestDto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("카테고리를 찾을 수 없습니다.");
    }

    // ===== 프로필 조회 =====

    @Test
    @DisplayName("프로필 조회 성공")
    void getProfile_success() {
        given(freelancerProfileRepository.findById(1L)).willReturn(Optional.of(profile));

        FreelancerProfileResponseDto result = freelancerProfileService.getProfile(1L);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("테스트 타이틀");
        assertThat(result.getRegion()).isEqualTo("서울");
    }

    @Test
    @DisplayName("프로필 조회 실패 - 존재하지 않는 프로필")
    void getProfile_fail_notFound() {
        given(freelancerProfileRepository.findById(999L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> freelancerProfileService.getProfile(999L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("프로필을 찾을 수 없습니다.");
    }

    // ===== 프로필 수정 =====

    @Test
    @DisplayName("프로필 수정 성공")
    void updateProfile_success() {
        given(freelancerProfileRepository.findById(1L)).willReturn(Optional.of(profile));
        given(categoryRepository.findById(any())).willReturn(Optional.of(category));

        FreelancerProfileResponseDto result = freelancerProfileService.updateProfile(1L, member, requestDto);

        assertThat(result).isNotNull();
    }

    @Test
    @DisplayName("프로필 수정 실패 - 권한 없음 (다른 회원)")
    void updateProfile_fail_noPermission() {
        given(freelancerProfileRepository.findById(1L)).willReturn(Optional.of(profile));
        // given(categoryRepository.findById(any())).willReturn(Optional.of(category)); ← 이 줄 삭제

        assertThatThrownBy(() -> freelancerProfileService.updateProfile(1L, otherMember, requestDto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("수정 권한이 없습니다.");
    }

    // ===== 프로필 삭제 =====

    @Test
    @DisplayName("프로필 삭제 성공")
    void deleteProfile_success() {
        given(freelancerProfileRepository.findById(1L)).willReturn(Optional.of(profile));

        freelancerProfileService.deleteProfile(1L, member);

        verify(freelancerProfileRepository).delete(profile);
    }

    @Test
    @DisplayName("프로필 삭제 실패 - 존재하지 않는 프로필")
    void deleteProfile_fail_notFound() {
        given(freelancerProfileRepository.findById(999L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> freelancerProfileService.deleteProfile(999L, member))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("프로필을 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("프로필 삭제 실패 - 권한 없음")
    void deleteProfile_fail_noPermission() {
        given(freelancerProfileRepository.findById(1L)).willReturn(Optional.of(profile));

        assertThatThrownBy(() -> freelancerProfileService.deleteProfile(1L, otherMember))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("삭제 권한이 없습니다.");
    }

    // ===== 내 프로필 조회 =====

    @Test
    @DisplayName("내 프로필 조회 성공")
    void getMyProfile_success() {
        given(freelancerProfileRepository.findByMemberId(1L)).willReturn(Optional.of(profile));

        FreelancerProfileResponseDto result = freelancerProfileService.getMyProfile(member);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("테스트 타이틀");
        assertThat(result.getRegion()).isEqualTo("서울");
    }

    @Test
    @DisplayName("내 프로필 조회 실패 - 프로필 없음")
    void getMyProfile_fail_notFound() {
        given(freelancerProfileRepository.findByMemberId(1L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> freelancerProfileService.getMyProfile(member))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("프로필이 없습니다.");
    }
}
