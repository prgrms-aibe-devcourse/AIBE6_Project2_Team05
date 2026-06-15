package com.wedge.backend.global.oauth2;

import com.wedge.backend.domain.member.entity.RefreshToken;
import com.wedge.backend.domain.member.repository.RefreshTokenRepository;
import com.wedge.backend.global.jwt.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        MemberPrincipal memberPrincipal = (MemberPrincipal) authentication.getPrincipal();

        Long memberId = memberPrincipal.getMember().getId();
        String role = memberPrincipal.getMember().getRole().name();

        String accessToken = jwtUtil.generateAccessToken(memberId, role);
        String refreshToken = jwtUtil.generateRefreshToken(memberId, role);

        // Refresh Token 저장 또는 업데이트
        LocalDateTime expiryDate = LocalDateTime.now().plusSeconds(refreshExpiration / 1000);
        RefreshToken tokenEntity = refreshTokenRepository.findByMemberId(memberId)
                .map(token -> {
                    token.updateToken(refreshToken, expiryDate);
                    return token;
                })
                .orElseGet(() -> RefreshToken.builder()
                        .memberId(memberId)
                        .token(refreshToken)
                        .expiryDate(expiryDate)
                        .build());

        refreshTokenRepository.save(tokenEntity);

        // 리프레시 토큰은 HttpOnly 쿠키로 구워서 응답에 추가
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7일
                .sameSite("None")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // 프론트엔드로 액세스 토큰만 전달 (쿼리파라미터)
        String redirectUrl = frontendUrl + "/oauth2/callback"
                + "?accessToken=" + accessToken;

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
