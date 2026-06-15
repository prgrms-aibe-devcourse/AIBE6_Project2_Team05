package com.wedge.backend.domain.bookmark.entity;

import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "bookmarks",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"member_id", "freelancer_profile_id"})
        }
)
public class Bookmark extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_profile_id", nullable = false)
    private FreelancerProfile freelancerProfile;

    @Builder
    public Bookmark(Member member, FreelancerProfile freelancerProfile) {
        this.member = member;
        this.freelancerProfile = freelancerProfile;
    }
}