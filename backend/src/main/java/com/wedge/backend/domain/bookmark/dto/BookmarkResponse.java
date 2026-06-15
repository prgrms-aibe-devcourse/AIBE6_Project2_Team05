package com.wedge.backend.domain.bookmark.dto;

import com.wedge.backend.domain.bookmark.entity.Bookmark;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BookmarkResponse {

    private final Long id;
    private final Long freelancerProfileId;
    private final String memberName;
    private final String title;
    private final String region;
    private final Integer price;
    private final LocalDateTime createdAt;

    private BookmarkResponse(Bookmark bookmark) {
        this.id = bookmark.getId();
        this.freelancerProfileId = bookmark.getFreelancerProfile().getId();
        this.memberName = bookmark.getFreelancerProfile().getMember().getName();
        this.title = bookmark.getFreelancerProfile().getTitle();
        this.region = bookmark.getFreelancerProfile().getRegion();
        this.price = bookmark.getFreelancerProfile().getPrice();
        this.createdAt = bookmark.getCreatedAt();
    }

    public static BookmarkResponse from(Bookmark bookmark) {
        return new BookmarkResponse(bookmark);
    }
}