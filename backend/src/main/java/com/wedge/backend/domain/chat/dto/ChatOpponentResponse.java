package com.wedge.backend.domain.chat.dto;

import com.wedge.backend.domain.member.entity.Member;

public record ChatOpponentResponse(
        Long id,
        String name,
        String profileImageUrl,
        boolean isOnline
) {

    public static ChatOpponentResponse from(Member member, boolean online) {
        return new ChatOpponentResponse(member.getId(), member.getName(), null, online);
    }
}
