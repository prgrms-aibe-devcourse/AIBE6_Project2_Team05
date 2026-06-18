package com.wedge.backend.domain.freelancer.service;

import com.wedge.backend.domain.category.entity.Category;
import com.wedge.backend.domain.freelancer.dto.PortfolioRequestDto;
import com.wedge.backend.domain.freelancer.dto.PortfolioResponseDto;
import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import com.wedge.backend.domain.freelancer.entity.Portfolio;
import com.wedge.backend.domain.freelancer.repository.FreelancerProfileRepository;
import com.wedge.backend.domain.freelancer.repository.PortfolioImageRepository;
import com.wedge.backend.domain.freelancer.repository.PortfolioRepository;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.entity.Provider;
import com.wedge.backend.domain.member.entity.Role;
import com.wedge.backend.global.storage.R2FileUploadService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class PortfolioServiceTest {

    @Mock
    private PortfolioRepository portfolioRepository;

    @Mock
    private FreelancerProfileRepository freelancerProfileRepository;

    @Mock
    private PortfolioImageRepository portfolioImageRepository;

    @Mock
    private R2FileUploadService r2FileUploadService;

    @InjectMocks
    private PortfolioService portfolioService;

    private Member member;
    private Member otherMember;
    private FreelancerProfile profile;
    private Portfolio portfolio;
    private PortfolioRequestDto requestDto;

    @BeforeEach
    void setUp() {
        member = Member.builder()
                .email("test@test.com")
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

        Category category = Category.builder().name("헤어/메이크업").build();

        profile = FreelancerProfile.builder()
                .member(member)
                .category(category)
                .title("테스트 타이틀")
                .introduction("소개글")
                .region("서울")
                .price(100000)
                .careerYears(3)
                .build();

        portfolio = Portfolio.builder()
                .freelancerProfile(profile)
                .imageUrl("https://example.com/test.png")
                .description("테스트 포트폴리오")
                .sortOrder(1)
                .build();

        requestDto = new PortfolioRequestDto("테스트 포트폴리오", 1, null, null, null, null, null);
    }

    // ===== 포트폴리오 목록 조회 =====

    @Test
    @DisplayName("포트폴리오 목록 조회 성공")
    void getPortfolios_success() {
        given(portfolioRepository.findByFreelancerProfileIdOrderBySortOrder(1L))
                .willReturn(List.of(portfolio));

        List<PortfolioResponseDto> result = portfolioService.getPortfolios(1L, true);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getDescription()).isEqualTo("테스트 포트폴리오");
    }

    @Test
    @DisplayName("포트폴리오 목록 조회 - 빈 목록")
    void getPortfolios_empty() {
        given(portfolioRepository.findByFreelancerProfileIdOrderBySortOrder(1L))
                .willReturn(List.of());

        List<PortfolioResponseDto> result = portfolioService.getPortfolios(1L, true);

        assertThat(result).isEmpty();
    }

    // ===== 포트폴리오 등록 =====

    @Test
    @DisplayName("포트폴리오 등록 성공")
    void createPortfolio_success() throws IOException {
        MockMultipartFile image = new MockMultipartFile(
                "image", "test.png", "image/png", new byte[100]);
        given(freelancerProfileRepository.findById(1L)).willReturn(Optional.of(profile));
        given(r2FileUploadService.upload(any(), anyString())).willReturn("https://example.com/test.png");
        given(portfolioRepository.save(any())).willReturn(portfolio);

        PortfolioResponseDto result = portfolioService.createPortfolio(member, 1L, image, requestDto);

        assertThat(result).isNotNull();
        assertThat(result.getImageUrl()).isEqualTo("https://example.com/test.png");
        verify(portfolioRepository).save(any());
    }

    @Test
    @DisplayName("포트폴리오 등록 실패 - 빈 파일")
    void createPortfolio_fail_emptyFile() {
        MockMultipartFile emptyImage = new MockMultipartFile(
                "image", "test.png", "image/png", new byte[0]);
        given(freelancerProfileRepository.findById(1L)).willReturn(Optional.of(profile));

        assertThatThrownBy(() -> portfolioService.createPortfolio(member, 1L, emptyImage, requestDto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("파일이 비어있습니다.");
    }

    @Test
    @DisplayName("포트폴리오 등록 실패 - 10MB 초과")
    void createPortfolio_fail_fileTooLarge() {
        MockMultipartFile largeImage = new MockMultipartFile(
                "image", "test.png", "image/png", new byte[11 * 1024 * 1024]);
        given(freelancerProfileRepository.findById(1L)).willReturn(Optional.of(profile));

        assertThatThrownBy(() -> portfolioService.createPortfolio(member, 1L, largeImage, requestDto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("파일 크기는 10MB 이하여야 합니다.");
    }

    @Test
    @DisplayName("포트폴리오 등록 실패 - 권한 없음")
    void createPortfolio_fail_noPermission() {
        MockMultipartFile image = new MockMultipartFile(
                "image", "test.png", "image/png", new byte[100]);
        given(freelancerProfileRepository.findById(1L)).willReturn(Optional.of(profile));

        assertThatThrownBy(() -> portfolioService.createPortfolio(otherMember, 1L, image, requestDto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("등록 권한이 없습니다.");
    }

    // ===== 포트폴리오 삭제 =====

    @Test
    @DisplayName("포트폴리오 삭제 성공")
    void deletePortfolio_success() {
        given(portfolioRepository.findById(1L)).willReturn(Optional.of(portfolio));

        portfolioService.deletePortfolio(member, 1L);

        verify(portfolioRepository).delete(portfolio);
    }

    @Test
    @DisplayName("포트폴리오 삭제 실패 - 포트폴리오 없음")
    void deletePortfolio_fail_notFound() {
        given(portfolioRepository.findById(999L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> portfolioService.deletePortfolio(member, 999L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("포트폴리오를 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("포트폴리오 삭제 실패 - 권한 없음")
    void deletePortfolio_fail_noPermission() {
        given(portfolioRepository.findById(1L)).willReturn(Optional.of(portfolio));

        assertThatThrownBy(() -> portfolioService.deletePortfolio(otherMember, 1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("삭제 권한이 없습니다.");
    }

    // ===== 열람 권한 처리 =====

    @Test
    @DisplayName("포트폴리오 목록 조회 - 비로그인 시 3장만 노출")
    void getPortfolios_notLoggedIn_limit3() {
        List<Portfolio> portfolios = List.of(
                Portfolio.builder().freelancerProfile(profile).imageUrl("url1").description("1").sortOrder(1).build(),
                Portfolio.builder().freelancerProfile(profile).imageUrl("url2").description("2").sortOrder(2).build(),
                Portfolio.builder().freelancerProfile(profile).imageUrl("url3").description("3").sortOrder(3).build(),
                Portfolio.builder().freelancerProfile(profile).imageUrl("url4").description("4").sortOrder(4).build()
        );
        given(portfolioRepository.findByFreelancerProfileIdOrderBySortOrder(1L)).willReturn(portfolios);

        List<PortfolioResponseDto> result = portfolioService.getPortfolios(1L, false);

        assertThat(result).hasSize(3);
    }

    @Test
    @DisplayName("포트폴리오 목록 조회 - 로그인 시 전체 노출")
    void getPortfolios_loggedIn_showAll() {
        List<Portfolio> portfolios = List.of(
                Portfolio.builder().freelancerProfile(profile).imageUrl("url1").description("1").sortOrder(1).build(),
                Portfolio.builder().freelancerProfile(profile).imageUrl("url2").description("2").sortOrder(2).build(),
                Portfolio.builder().freelancerProfile(profile).imageUrl("url3").description("3").sortOrder(3).build(),
                Portfolio.builder().freelancerProfile(profile).imageUrl("url4").description("4").sortOrder(4).build()
        );
        given(portfolioRepository.findByFreelancerProfileIdOrderBySortOrder(1L)).willReturn(portfolios);

        List<PortfolioResponseDto> result = portfolioService.getPortfolios(1L, true);

        assertThat(result).hasSize(4);
    }

    // ===== 포트폴리오 수정 =====

    @Test
    @DisplayName("포트폴리오 수정 성공")
    void updatePortfolio_success() throws IOException {
        given(portfolioRepository.findById(1L)).willReturn(Optional.of(portfolio));

        PortfolioResponseDto result = portfolioService.updatePortfolio(member, 1L, null, requestDto);

        assertThat(result).isNotNull();
        assertThat(result.getDescription()).isEqualTo("테스트 포트폴리오");
    }

    @Test
    @DisplayName("포트폴리오 수정 실패 - 포트폴리오 없음")
    void updatePortfolio_fail_notFound() {
        MockMultipartFile image = new MockMultipartFile(
                "image", "test.png", "image/png", new byte[100]);
        given(portfolioRepository.findById(999L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> portfolioService.updatePortfolio(member, 999L, image, requestDto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("포트폴리오를 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("포트폴리오 수정 실패 - 권한 없음")
    void updatePortfolio_fail_noPermission() {
        MockMultipartFile image = new MockMultipartFile(
                "image", "test.png", "image/png", new byte[100]);
        given(portfolioRepository.findById(1L)).willReturn(Optional.of(portfolio));

        assertThatThrownBy(() -> portfolioService.updatePortfolio(otherMember, 1L, image, requestDto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("수정 권한이 없습니다.");
    }
}