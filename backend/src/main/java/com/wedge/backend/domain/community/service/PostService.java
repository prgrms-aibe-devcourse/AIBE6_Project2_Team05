package com.wedge.backend.domain.community.service;

import com.wedge.backend.domain.community.dto.PostRequest;
import com.wedge.backend.domain.community.dto.PostResponse;
import com.wedge.backend.domain.community.entity.Post;
import com.wedge.backend.domain.community.entity.PostType;
import com.wedge.backend.domain.community.repository.PostRepository;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.global.storage.R2FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final R2FileUploadService r2FileUploadService;

    @Transactional
    public Long createPost(Member member, String title, String content, PostType type, List<MultipartFile> images) throws IOException {
        String imageUrl = null;
        if (images != null && !images.isEmpty()) {
            List<String> uploadedUrls = new ArrayList<>();
            for (MultipartFile image : images) {
                if (image != null && !image.isEmpty()) {
                    uploadedUrls.add(r2FileUploadService.upload(image, "posts"));
                }
            }
            if (!uploadedUrls.isEmpty()) {
                imageUrl = String.join(",", uploadedUrls);
            }
        }
        Post post = Post.create(member, title, content, type, imageUrl);
        return postRepository.save(post).getId();
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getPosts(PostType type, Pageable pageable) {
        if (type != null) {
            return postRepository.findAllByTypeAndIsDeletedFalseOrderByCreatedAtDesc(type, pageable)
                    .map(PostResponse::new);
        }
        return postRepository.findAllByIsDeletedFalseOrderByCreatedAtDesc(pageable)
                .map(PostResponse::new);
    }

    @Transactional(readOnly = true)
    public PostResponse getPost(Long postId) {
        Post post = postRepository.findByIdAndIsDeletedFalse(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));
        return new PostResponse(post);
    }

    @Transactional
    public PostResponse updatePost(Long postId, Member member, PostRequest request) {
        Post post = findMyPost(postId, member);
        post.update(request.getTitle(), request.getContent());
        return new PostResponse(post);
    }

    @Transactional
    public void deletePost(Long postId, Member member) {
        Post post = findMyPost(postId, member);
        post.delete();
    }

    private Post findMyPost(Long postId, Member member) {
        Post post = postRepository.findByIdAndIsDeletedFalse(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));
        if (!post.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("수정/삭제 권한이 없습니다.");
        }
        return post;
    }
}
