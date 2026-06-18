package com.wedge.backend.domain.proposal.repository;

import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import com.wedge.backend.domain.proposal.entity.Proposal;
import com.wedge.backend.domain.proposal.entity.ProposalStatus;
import com.wedge.backend.domain.recruit.entity.RecruitPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProposalRepository extends JpaRepository<Proposal, Long> {

    List<Proposal> findByRecruitPost(RecruitPost recruitPost);

    List<Proposal> findByFreelancerProfile(FreelancerProfile freelancerProfile);

    boolean existsByRecruitPostAndFreelancerProfile(RecruitPost recruitPost, FreelancerProfile freelancerProfile);

    long countByFreelancerProfileAndStatus(FreelancerProfile freelancerProfile, ProposalStatus status);
}
