package com.wedge.backend.domain.member.service;

import com.wedge.backend.domain.member.dto.AuthResponse;
import com.wedge.backend.domain.member.dto.LoginRequest;
import com.wedge.backend.domain.member.dto.SignUpRequest;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.entity.Provider;
import com.wedge.backend.domain.member.repository.MemberRepository;
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

    public AuthResponse login(LoginRequest request) {
        Member member = memberRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        String accessToken = jwtUtil.generateAccessToken(member.getId(), member.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(member.getId(), member.getRole().name());

        return new AuthResponse(accessToken, refreshToken);
    }
}
