package com.wedge.backend.global.websocket;

import java.security.Principal;

/**
 * JWT 인증 후 추출한 회원 ID를 STOMP 세션에 보관하기 위한 클래스
 */
public class StompMemberPrincipal implements Principal {

    private final Long memberId;

    public StompMemberPrincipal(Long memberId) {
        this.memberId = memberId;
    }

    @Override
    public String getName() {
        return String.valueOf(memberId);
    }

    public Long getMemberId() {
        return memberId;
    }
}
