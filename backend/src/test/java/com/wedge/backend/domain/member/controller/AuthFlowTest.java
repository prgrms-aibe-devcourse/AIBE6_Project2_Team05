package com.wedge.backend.domain.member.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wedge.backend.domain.member.repository.MemberRepository;
import com.wedge.backend.domain.member.repository.RefreshTokenRepository;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
@Transactional
class AuthFlowTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    private static final String PASSWORD = "password1234";

    @Test
    @DisplayName("회원가입 -> 로그인 -> refresh(RTR) -> logout -> 토큰 재사용은 모두 실패한다")
    void signupLoginRefreshLogoutFlow() throws Exception {
        String email = "authflow_" + System.nanoTime() + "@test.com";

        // 1. 회원가입
        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signUpJson(email)))
                .andExpect(status().isOk());

        // 2. 로그인
        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson(email)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(cookie().exists("refreshToken"))
                .andReturn();

        String accessToken1 = extractAccessToken(loginResult);
        String refreshToken1 = loginResult.getResponse().getCookie("refreshToken").getValue();

        // 3. refresh: RTR로 새 토큰 쌍 발급
        MvcResult refreshResult = mockMvc.perform(post("/api/v1/auth/refresh")
                        .cookie(new Cookie("refreshToken", refreshToken1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(cookie().exists("refreshToken"))
                .andReturn();

        String accessToken2 = extractAccessToken(refreshResult);
        String refreshToken2 = refreshResult.getResponse().getCookie("refreshToken").getValue();

        assertThat(accessToken2).isNotEqualTo(accessToken1);
        assertThat(refreshToken2).isNotEqualTo(refreshToken1);

        // 4. RTR 검증: 회전 전(이전) refresh token을 재사용하면 실패한다
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .cookie(new Cookie("refreshToken", refreshToken1)))
                .andExpect(status().isUnauthorized());

        // 5. 로그아웃
        mockMvc.perform(post("/api/v1/auth/logout")
                        .header("Authorization", "Bearer " + accessToken2))
                .andExpect(status().isOk())
                .andExpect(cookie().maxAge("refreshToken", 0));

        Long memberId = memberRepository.findByEmail(email).orElseThrow().getId();
        assertThat(refreshTokenRepository.findByMemberId(memberId)).isEmpty();

        // 6. 로그아웃 이후에는 최신(회전된) refresh token도 더 이상 사용할 수 없다
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .cookie(new Cookie("refreshToken", refreshToken2)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("access token 없이도 refresh token 쿠키만으로 logout하면 refresh token이 무효화된다")
    void logoutWithoutAccessTokenStillInvalidatesRefreshToken() throws Exception {
        String email = "logoutfallback_" + System.nanoTime() + "@test.com";

        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signUpJson(email)))
                .andExpect(status().isOk());

        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson(email)))
                .andExpect(status().isOk())
                .andReturn();

        String refreshToken = loginResult.getResponse().getCookie("refreshToken").getValue();
        Long memberId = memberRepository.findByEmail(email).orElseThrow().getId();
        assertThat(refreshTokenRepository.findByMemberId(memberId)).isPresent();

        // Authorization 헤더 없이 (access token 만료/누락 상황 가정), refresh token 쿠키만으로 logout
        mockMvc.perform(post("/api/v1/auth/logout")
                        .cookie(new Cookie("refreshToken", refreshToken)))
                .andExpect(status().isOk())
                .andExpect(cookie().maxAge("refreshToken", 0));

        assertThat(refreshTokenRepository.findByMemberId(memberId)).isEmpty();
    }

    private String signUpJson(String email) {
        return """
                {"email":"%s","password":"%s","name":"인증플로우테스트","phone":"010-0000-0000","role":"CLIENT"}
                """.formatted(email, PASSWORD);
    }

    private String loginJson(String email) {
        return """
                {"email":"%s","password":"%s"}
                """.formatted(email, PASSWORD);
    }

    private String extractAccessToken(MvcResult result) throws Exception {
        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("accessToken").asText();
    }
}
