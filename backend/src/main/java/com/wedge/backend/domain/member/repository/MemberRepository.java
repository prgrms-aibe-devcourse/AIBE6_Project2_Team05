package com.wedge.backend.domain.member.repository;

import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);

    Optional<Member> findByProviderAndProviderId(Provider provider, String providerId);

    boolean existsByEmail(String email);
}
