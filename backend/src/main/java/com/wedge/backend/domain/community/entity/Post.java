package com.wedge.backend.domain.community.entity;

import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "posts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post extends BaseTimeEntity {

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostType type;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    public static Post create(Member member, String title, String content, PostType type, String imageUrl) {
        Post post = new Post();
        post.member = member;
        post.title = title;
        post.content = content;
        post.type = type;
        post.imageUrl = imageUrl;
        return post;
    }

    public void update(String title, String content) {
        if (title != null) this.title = title;
        if (content != null) this.content = content;
    }

    public void delete() {
        this.isDeleted = true;
    }
}
