package com.wedge.backend.domain.member.service;

import com.wedge.backend.domain.member.dto.LoginRequest;
import com.wedge.backend.domain.member.dto.SignUpRequest;
import com.wedge.backend.domain.member.dto.TokenDto;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.entity.MemberStatus;
import com.wedge.backend.domain.member.entity.Provider;
import com.wedge.backend.domain.member.entity.RefreshToken;
import com.wedge.backend.domain.member.repository.MemberRepository;
import com.wedge.backend.domain.member.repository.RefreshTokenRepository;
import com.wedge.backend.global.exception.LoginFailedException;
import com.wedge.backend.global.exception.MemberNotFoundException;
import com.wedge.backend.global.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public void signUp(SignUpRequest request) {
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        Member member = Member.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phone(request.getPhone())
                .role(request.getRole())
                .provider(Provider.LOCAL)
                .build();

        memberRepository.save(member);
    }

    @Transactional
    public TokenDto login(LoginRequest request) {
        Member member = memberRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new MemberNotFoundException("존재하지 않는 회원입니다."));

        if (member.getStatus() == MemberStatus.DELETED) {
            throw new IllegalStateException("탈퇴한 회원입니다.");
        }

        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new LoginFailedException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        String accessToken = jwtUtil.generateAccessToken(member.getId(), member.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(member.getId(), member.getRole().name());

        // memberId를 키로 저장 — 이미 존재하면 덮어씀 (upsert)
        refreshTokenRepository.save(RefreshToken.builder()
                .memberId(member.getId())
                .token(refreshToken)
                .build());

        return new TokenDto(accessToken, refreshToken);
    }

    @Transactional
    public TokenDto reissue(String refreshToken) {
        // 1. 토큰 자체 유효성 검증
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new LoginFailedException("유효하지 않은 리프레시 토큰입니다.");
        }

        // 2. Redis에서 토큰 조회 — 존재하지 않으면 만료되었거나 무효화된 것
        RefreshToken tokenEntity = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new LoginFailedException("존재하지 않거나 만료된 리프레시 토큰입니다."));

        // 3. 회원 조회
        Long memberId = tokenEntity.getMemberId();
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberNotFoundException("존재하지 않는 회원입니다."));

        // 탈퇴한 회원 방어 로직
        if (member.getStatus() == MemberStatus.DELETED) {
            refreshTokenRepository.deleteById(memberId);
            throw new IllegalStateException("탈퇴한 회원입니다.");
        }

        // 4. 새로운 토큰 쌍 생성 (RTR - Refresh Token Rotation)
        String newAccessToken = jwtUtil.generateAccessToken(memberId, member.getRole().name());
        String newRefreshToken = jwtUtil.generateRefreshToken(memberId, member.getRole().name());

        // 5. Redis 갱신 (upsert)
        refreshTokenRepository.save(RefreshToken.builder()
                .memberId(memberId)
                .token(newRefreshToken)
                .build());

        return new TokenDto(newAccessToken, newRefreshToken);
    }

    @Transactional
    public void logout(Long memberId) {
        refreshTokenRepository.deleteByMemberId(memberId);
    }

    // access token이 만료/누락되어 memberId를 알 수 없는 경우, refresh token 값으로 무효화
    @Transactional
    public void logoutByRefreshToken(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken)
                .ifPresent(token -> refreshTokenRepository.deleteById(token.getMemberId()));
    }
}
