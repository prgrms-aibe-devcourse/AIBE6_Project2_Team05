package com.wedge.backend.domain.recruit.entity;

import com.wedge.backend.domain.category.entity.Category;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "recruit_posts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecruitPost extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column
    private Integer budget;

    @Column(name = "wedding_date", nullable = false)
    private LocalDate weddingDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecruitStatus status = RecruitStatus.OPEN;

    @Column(length = 100)
    private String region;

    public static RecruitPost create(Member member, String title, String content,
                                     Category category, Integer budget,
                                     LocalDate weddingDate, String region) {
        RecruitPost post = new RecruitPost();
        post.member = member;
        post.title = title;
        post.content = content;
        post.category = category;
        post.budget = budget;
        post.weddingDate = weddingDate;
        post.region = region;
        return post;
    }

    public void update(String title, String content, Category category,
                       Integer budget, LocalDate weddingDate, String region) {
        if (title != null) this.title = title;
        if (content != null) this.content = content;
        if (category != null) this.category = category;
        this.budget = budget;
        if (weddingDate != null) this.weddingDate = weddingDate;
        this.region = region;
    }

    public void changeStatus(RecruitStatus status) {
        this.status = status;
    }
}
