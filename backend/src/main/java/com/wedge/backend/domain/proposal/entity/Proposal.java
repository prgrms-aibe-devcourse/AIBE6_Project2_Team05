package com.wedge.backend.domain.proposal.entity;

import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import com.wedge.backend.domain.recruit.entity.RecruitPost;
import com.wedge.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "proposals", uniqueConstraints = {
        @UniqueConstraint(name = "uq_proposal", columnNames = {"recruit_post_id", "freelancer_profile_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Proposal extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruit_post_id", nullable = false)
    private RecruitPost recruitPost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_profile_id", nullable = false)
    private FreelancerProfile freelancerProfile;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column
    private Integer price;

    @Column(length = 100)
    private String region;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProposalStatus status = ProposalStatus.SUBMITTED;

    public static Proposal create(RecruitPost recruitPost, FreelancerProfile freelancerProfile,
                                  String content, Integer price, String region) {
        Proposal proposal = new Proposal();
        proposal.recruitPost = recruitPost;
        proposal.freelancerProfile = freelancerProfile;
        proposal.content = content;
        proposal.price = price;
        proposal.region = region;
        return proposal;
    }

    public void accept() {
        this.status = ProposalStatus.ACCEPTED;
    }

    public void reject() {
        this.status = ProposalStatus.REJECTED;
    }
}
