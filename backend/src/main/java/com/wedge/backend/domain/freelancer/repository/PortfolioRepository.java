package com.wedge.backend.domain.freelancer.repository;

import com.wedge.backend.domain.freelancer.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findByFreelancerProfileIdOrderBySortOrder(Long freelancerProfileId);
    Optional<Portfolio> findFirstByFreelancerProfileIdOrderBySortOrderAscIdAsc(Long freelancerProfileId);
    void deleteByFreelancerProfileId(Long freelancerProfileId);
}