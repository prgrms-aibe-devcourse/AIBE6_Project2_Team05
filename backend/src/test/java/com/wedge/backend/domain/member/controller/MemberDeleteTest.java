package com.wedge.backend.domain.member.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.entity.MemberStatus;
import com.wedge.backend.domain.member.entity.Provider;
import com.wedge.backend.domain.member.entity.Role;
import com.wedge.backend.domain.member.repository.MemberRepository;
import com.wedge.backend.domain.member.repository.RefreshTokenRepository;
import com.wedge.backend.global.jwt.JwtUtil;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
@Transactional
class MemberDeleteTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("카카오/구글 소셜 로그인 회원도 동일한 탈퇴 API로 소프트 삭제(DELETED) 처리된다")
    void oauthMemberWithdrawWorks() throws Exception {
        Member kakaoMember = memberRepository.save(Member.builder()
                .email("kakao_" + System.nanoTime() + "@test.com")
                .name("카카오유저")
                .role(Role.CLIENT)
                .provider(Provider.KAKAO)
                .providerId("kakao-" + System.nanoTime())
                .build());

        String accessToken = jwtUtil.generateAccessToken(kakaoMember.getId(), Role.CLIENT.name());

        // 탈퇴
        mockMvc.perform(delete("/api/v1/members/me")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isNoContent());

        // 소프트 삭제: row는 유지되고 status만 DELETED로 변경 (추후 복구 가능)
        Member reloaded = memberRepository.findById(kakaoMember.getId()).orElseThrow();
        assertThat(reloaded.getStatus()).isEqualTo(MemberStatus.DELETED);
        assertThat(reloaded.getProvider()).isEqualTo(Provider.KAKAO);
        assertThat(reloaded.getProviderId()).isEqualTo(kakaoMember.getProviderId());
    }

    @Test
    @DisplayName("탈퇴 시 refresh token이 즉시 삭제되어, 탈퇴 후 토큰 재발급(refresh)은 더 이상 불가능하다")
    void withdrawnMemberCannotReissue() throws Exception {
        String email = "withdraw_" + System.nanoTime() + "@test.com";
        String password = "password1234";

        memberRepository.save(Member.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .name("탈퇴테스트")
                .role(Role.CLIENT)
                .build());

        // 로그인하여 refresh token 발급
        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","password":"%s"}
                                """.formatted(email, password)))
                .andExpect(status().isOk())
                .andReturn();

        String accessToken = objectMapper.readTree(loginResult.getResponse().getContentAsString())
                .get("accessToken").asText();
        String refreshToken = loginResult.getResponse().getCookie("refreshToken").getValue();

        Long memberId = memberRepository.findByEmail(email).orElseThrow().getId();
        assertThat(refreshTokenRepository.findById(memberId)).isPresent();

        // 탈퇴
        mockMvc.perform(delete("/api/v1/members/me")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isNoContent());

        // refresh token이 즉시 삭제됨
        assertThat(refreshTokenRepository.findById(memberId)).isEmpty();

        // 탈퇴 후 refresh 시도 -> 더 이상 유효하지 않음 (재발급으로 서비스 계속 이용 불가)
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .cookie(new Cookie("refreshToken", refreshToken)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("[방어 로직] refresh token이 DB에 남아있어도 DELETED 상태 회원의 재발급은 423으로 차단된다")
    void deletedMemberReissueBlockedEvenIfTokenRemains() throws Exception {
        String email = "deleted_" + System.nanoTime() + "@test.com";
        String password = "password1234";

        Member member = memberRepository.save(Member.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .name("탈퇴후토큰잔존")
                .role(Role.CLIENT)
                .build());

        // 로그인하여 refresh token 발급
        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","password":"%s"}
                                """.formatted(email, password)))
                .andExpect(status().isOk())
                .andReturn();

        String refreshToken = loginResult.getResponse().getCookie("refreshToken").getValue();

        // withdrawMyAccount API를 거치지 않고 다른 경로(관리자 등)로 상태만 DELETED가 된 상황을 가정
        member.withdraw();
        memberRepository.save(member);
        assertThat(refreshTokenRepository.findById(member.getId())).isPresent();

        // refresh token이 DB에 남아있더라도 탈퇴 회원의 재발급은 차단된다 (423 Locked)
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .cookie(new Cookie("refreshToken", refreshToken)))
                .andExpect(status().isLocked());

        // 차단과 동시에 잔존 refresh token도 정리된다
        assertThat(refreshTokenRepository.findById(member.getId())).isEmpty();
    }

    @Test
    @DisplayName("[알려진 한계] 탈퇴 전에 발급된 Access Token은 만료 전까지 보호된 API에 그대로 접근 가능하다")
    void withdrawnMemberOldAccessTokenStillAuthenticates() throws Exception {
        Member member = memberRepository.save(Member.builder()
                .email("withdraw_legacy_" + System.nanoTime() + "@test.com")
                .password(passwordEncoder.encode("password1234"))
                .name("탈퇴전토큰테스트")
                .role(Role.CLIENT)
                .build());

        String accessTokenIssuedBeforeWithdrawal =
                jwtUtil.generateAccessToken(member.getId(), Role.CLIENT.name());

        // 탈퇴
        mockMvc.perform(delete("/api/v1/members/me")
                        .header("Authorization", "Bearer " + accessTokenIssuedBeforeWithdrawal))
                .andExpect(status().isNoContent());

        // JwtAuthFilter는 JWT 자체의 서명/만료만 검증하고 DB의 회원 상태를 조회하지 않으므로,
        // 탈퇴 전에 발급된 access token은 만료(기본 1일) 전까지 계속 인증에 성공한다.
        mockMvc.perform(get("/api/v1/members/me")
                        .header("Authorization", "Bearer " + accessTokenIssuedBeforeWithdrawal))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DELETED"));
    }
}
