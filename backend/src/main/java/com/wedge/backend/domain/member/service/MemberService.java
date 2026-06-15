package com.wedge.backend.domain.member.service;

import com.wedge.backend.domain.member.dto.MemberMeResponse;
import com.wedge.backend.domain.member.dto.MemberUpdateRequest;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberMeResponse getMyInfo(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        return MemberMeResponse.from(member);
    }

    @Transactional
    public MemberMeResponse updateMyInfo(Long memberId, MemberUpdateRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        member.updateProfile(request.getName(), request.getPhone());

        return MemberMeResponse.from(member);
    }

    @Transactional
    public void withdrawMyAccount(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        member.withdraw();
    }
        //내부 개발용 회원 조회 메서드 정보, 프론트에서 사용X
        public Member getMember (Long memberId){
            return memberRepository.findById(memberId)
                    .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));
        }


}
