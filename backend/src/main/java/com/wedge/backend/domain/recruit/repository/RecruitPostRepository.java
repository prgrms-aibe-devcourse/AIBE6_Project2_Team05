package com.wedge.backend.domain.recruit.repository;

import com.wedge.backend.domain.recruit.entity.RecruitPost;
import com.wedge.backend.domain.recruit.entity.RecruitStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecruitPostRepository extends JpaRepository<RecruitPost, Long> {

    @Query("SELECT r FROM RecruitPost r " +
           "WHERE (:categoryId IS NULL OR r.category.id = :categoryId) " +
           "AND (:region IS NULL OR r.region = :region) " +
           "AND (:status IS NULL OR r.status = :status)")
    Page<RecruitPost> findByFilters(
            @Param("categoryId") Long categoryId,
            @Param("region") String region,
            @Param("status") RecruitStatus status,
            Pageable pageable);

    List<RecruitPost> findByMemberIdOrderByCreatedAtDesc(Long memberId);
}
