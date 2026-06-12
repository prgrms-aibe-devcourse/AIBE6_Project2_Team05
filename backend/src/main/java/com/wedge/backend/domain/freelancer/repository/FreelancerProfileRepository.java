package com.wedge.backend.domain.freelancer.repository;

import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface FreelancerProfileRepository
        extends JpaRepository<FreelancerProfile, Long>,
        JpaSpecificationExecutor<FreelancerProfile> {

    Optional<FreelancerProfile> findByMemberId(Long memberId);

    boolean existsByMemberId(Long memberId);
}
