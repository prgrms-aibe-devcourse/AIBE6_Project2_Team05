package com.wedge.backend.domain.member.service;

import com.wedge.backend.domain.member.dto.MemberMeResponse;
import com.wedge.backend.domain.member.dto.MemberUpdateRequest;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.repository.MemberRepository;
import com.wedge.backend.domain.member.repository.RefreshTokenRepository;
import com.wedge.backend.global.exception.MemberNotFoundException;
import com.wedge.backend.global.storage.R2FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final R2FileUploadService r2FileUploadService;

    public MemberMeResponse getMyInfo(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberNotFoundException("회원 정보를 찾을 수 없습니다."));

        return MemberMeResponse.from(member);
    }

    @Transactional
    public MemberMeResponse updateMyInfo(Long memberId, MemberUpdateRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberNotFoundException("회원 정보를 찾을 수 없습니다."));

        member.updateProfile(request.getName(), request.getPhone());

        return MemberMeResponse.from(member);
    }

    @Transactional
    public MemberMeResponse updateProfileImage(Long memberId, MultipartFile image) throws IOException {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberNotFoundException("회원 정보를 찾을 수 없습니다."));
        String imageUrl = r2FileUploadService.upload(image, "profiles");
        member.updateProfileImage(imageUrl);
        return MemberMeResponse.from(member);
    }

    @Transactional
    public void withdrawMyAccount(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberNotFoundException("회원 정보를 찾을 수 없습니다."));

        member.withdraw();
        // 탈퇴 즉시 refresh token을 무효화하여, 만료(7일) 전까지 재발급으로 서비스를 계속 이용하는 것을 방지
        refreshTokenRepository.deleteByMemberId(memberId);
    }
        //내부 개발용 회원 조회 메서드 정보, 프론트에서 사용X
        public Member getMember (Long memberId){
            return memberRepository.findById(memberId)
                    .orElseThrow(() -> new MemberNotFoundException("회원 정보를 찾을 수 없습니다."));
        }


}
