package com.wedge.backend.domain.review.repository;

import com.wedge.backend.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByFreelancerProfileId(Long freelancerProfileId);
    List<Review> findByMemberId(Long memberId);


}