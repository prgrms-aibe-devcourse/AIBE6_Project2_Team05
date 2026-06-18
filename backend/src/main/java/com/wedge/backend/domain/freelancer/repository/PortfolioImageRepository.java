package com.wedge.backend.domain.freelancer.repository;

import com.wedge.backend.domain.freelancer.entity.PortfolioImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortfolioImageRepository extends JpaRepository<PortfolioImage, Long> {
    List<PortfolioImage> findByPortfolioIdOrderBySortOrder(Long portfolioId);
    void deleteByPortfolioId(Long portfolioId);
}