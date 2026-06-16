package com.wedge.backend.domain.freelancer.entity;

import com.wedge.backend.domain.category.entity.Category;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.review.entity.Review;
import com.wedge.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "freelancer_profiles")
public class FreelancerProfile extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false, unique = true)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String introduction;

    @Column(length = 255)
    private String keywords;

    @Column(nullable = false, length = 50)
    private String region;

    @Column
    private Integer price;

    @Column(name = "career_years", nullable = false)
    private int careerYears = 0;

    @Column(name = "bookmark_count", nullable = false)
    private int bookmarkCount = 0;

    @OneToMany(mappedBy = "freelancerProfile", fetch = FetchType.LAZY)
    private List<Review> reviews = new ArrayList<>();

    @Builder
    public FreelancerProfile(Member member, Category category, String title,
                             String introduction, String keywords, String region, Integer price, int careerYears) {
        this.member = member;
        this.category = category;
        this.title = title;
        this.introduction = introduction;
        this.keywords = keywords;
        this.region = region;
        this.price = price;
        this.careerYears = careerYears;
    }

    public void update(Category category, String title, String introduction,
                       String keywords, String region, Integer price, int careerYears) {
        this.category = category;
        this.title = title;
        this.introduction = introduction;
        this.keywords = keywords;
        this.region = region;
        this.price = price;
        this.careerYears = careerYears;
    }

    public void increaseBookmarkCount() {
        this.bookmarkCount++;
    }

    public void decreaseBookmarkCount() {
        if (this.bookmarkCount > 0) {
            this.bookmarkCount--;
        }
    }
}