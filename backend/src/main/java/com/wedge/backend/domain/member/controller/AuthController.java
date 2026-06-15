package com.wedge.backend.domain.member.controller;

import com.wedge.backend.domain.member.dto.AccessTokenResponse;
import com.wedge.backend.domain.member.dto.LoginRequest;
import com.wedge.backend.domain.member.dto.SignUpRequest;
import com.wedge.backend.domain.member.dto.TokenDto;
import com.wedge.backend.domain.member.service.AuthService;
import com.wedge.backend.global.exception.LoginFailedException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<Void> signUp(@RequestBody @Valid SignUpRequest request) {
        authService.signUp(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AccessTokenResponse> login(@RequestBody @Valid LoginRequest request) {
        TokenDto tokenDto = authService.login(request);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", tokenDto.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7일
                .sameSite("None")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AccessTokenResponse(tokenDto.getAccessToken()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AccessTokenResponse> refresh(
            @CookieValue(name = "refreshToken", required = false) String refreshToken) {

        if (refreshToken == null || refreshToken.isBlank()) {
            throw new LoginFailedException("리프레시 토큰이 누락되었습니다.");
        }

        TokenDto tokenDto = authService.reissue(refreshToken);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", tokenDto.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7일
                .sameSite("None")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AccessTokenResponse(tokenDto.getAccessToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @AuthenticationPrincipal Long memberId,
            @CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (memberId != null) {
            authService.logout(memberId);
        } else if (refreshToken != null && !refreshToken.isBlank()) {
            authService.logoutByRefreshToken(refreshToken);
        }

        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0) // 쿠키를 즉시 만료시켜 브라우저에서 삭제되도록 유도
                .sameSite("None")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }
}
