package com.wedge.backend.domain.member.repository;

import com.wedge.backend.domain.member.entity.RefreshToken;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    default void deleteByMemberId(Long memberId) {
        deleteById(memberId);
    }
}
