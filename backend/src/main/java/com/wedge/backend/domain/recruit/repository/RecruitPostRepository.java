package com.wedge.backend.domain.recruit.repository;

import com.wedge.backend.domain.recruit.entity.RecruitPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecruitPostRepository extends JpaRepository<RecruitPost, Long> {
}
