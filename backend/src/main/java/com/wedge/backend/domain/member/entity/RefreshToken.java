package com.wedge.backend.domain.member.entity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@RedisHash(value = "refreshToken", timeToLive = 604800) // 7일
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class RefreshToken {

    @Id
    private Long memberId;

    @Indexed
    private String token;

    public void updateToken(String newToken) {
        this.token = newToken;
    }
}
