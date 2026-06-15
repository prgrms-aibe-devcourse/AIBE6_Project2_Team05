package com.wedge.backend.domain.member.repository;

import com.wedge.backend.domain.member.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByMemberId(Long memberId);
    Optional<RefreshToken> findByToken(String token);
    void deleteByMemberId(Long memberId);
}
