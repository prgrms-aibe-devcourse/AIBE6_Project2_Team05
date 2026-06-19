package com.wedge.backend.domain.community.dto;

import com.wedge.backend.domain.community.entity.Post;
import com.wedge.backend.domain.community.entity.PostType;
import com.wedge.backend.domain.member.entity.Role;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PostResponse {

    private final Long id;
    private final Long memberId;
    private final String memberName;
    private final String memberImageUrl;
    private final Role memberRole;
    private final String title;
    private final String content;
    private final PostType type;
    private final String imageUrl;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public PostResponse(Post post) {
        this.id = post.getId();
        this.memberId = post.getMember().getId();
        this.memberName = post.getMember().getName();
        this.memberImageUrl = post.getMember().getProfileImageUrl();
        this.memberRole = post.getMember().getRole();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.type = post.getType();
        this.imageUrl = post.getImageUrl();
        this.createdAt = post.getCreatedAt();
        this.updatedAt = post.getUpdatedAt();
    }
}