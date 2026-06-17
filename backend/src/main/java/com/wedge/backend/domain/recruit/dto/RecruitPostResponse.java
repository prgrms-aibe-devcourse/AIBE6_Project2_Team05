package com.wedge.backend.domain.recruit.dto;

import com.wedge.backend.domain.recruit.entity.RecruitPost;
import com.wedge.backend.domain.recruit.entity.RecruitStatus;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class RecruitPostResponse {

    private final Long id;
    private final Long memberId;
    private final String memberName;
    private final String title;
    private final String content;
    private final Long categoryId;
    private final String categoryName;
    private final Integer budget;
    private final LocalDate weddingDate;
    private final RecruitStatus status;
    private final String region;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public RecruitPostResponse(RecruitPost post) {
        this.id = post.getId();
        this.memberId = post.getMember().getId();
        this.memberName = post.getMember().getName();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.categoryId = post.getCategory().getId();
        this.categoryName = post.getCategory().getName();
        this.budget = post.getBudget();
        this.weddingDate = post.getWeddingDate();
        this.status = post.getStatus();
        this.region = post.getRegion();
        this.createdAt = post.getCreatedAt();
        this.updatedAt = post.getUpdatedAt();
    }
}
