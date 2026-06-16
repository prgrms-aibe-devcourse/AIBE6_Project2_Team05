package com.wedge.backend.domain.review.entity;

import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.reservations.entity.Reservation;
import com.wedge.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "reviews")
public class Review extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_profile_id", nullable = false)
    private FreelancerProfile freelancerProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @Column(nullable = false)
    private int rating;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Builder
    public Review(Member member, FreelancerProfile freelancerProfile, Reservation reservation, int rating, String content) {
        this.member = member;
        this.freelancerProfile = freelancerProfile;
        this.reservation = reservation;
        this.rating = rating;
        this.content = content;
    }

    public void update(int rating, String content) {
        this.rating = rating;
        this.content = content;
    }
}
