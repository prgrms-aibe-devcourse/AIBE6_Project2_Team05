package com.wedge.backend.domain.recruit.service;

import com.wedge.backend.domain.category.entity.Category;
import com.wedge.backend.domain.category.repository.CategoryRepository;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.proposal.repository.ProposalRepository;
import com.wedge.backend.domain.recruit.dto.RecruitPostRequest;
import com.wedge.backend.domain.recruit.dto.RecruitPostResponse;
import com.wedge.backend.domain.recruit.entity.RecruitPost;
import com.wedge.backend.domain.recruit.entity.RecruitStatus;
import com.wedge.backend.domain.recruit.repository.RecruitPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecruitPostService {

    private final RecruitPostRepository recruitPostRepository;
    private final CategoryRepository categoryRepository;
    private final ProposalRepository proposalRepository;

    @Transactional(readOnly = true)
    public Page<RecruitPostResponse> getRecruitPosts(Long categoryId, String region,
                                                     RecruitStatus status, Pageable pageable) {
        return recruitPostRepository.findByFilters(categoryId, region, status, pageable)
                .map(RecruitPostResponse::new);
    }

    @Transactional(readOnly = true)
    public RecruitPostResponse getRecruitPost(Long postId) {
        RecruitPost post = recruitPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 구인글입니다."));
        return new RecruitPostResponse(post);
    }

    @Transactional(readOnly = true)
    public List<RecruitPostResponse> getMyRecruitPosts(Long memberId) {
        return recruitPostRepository.findByMemberIdOrderByCreatedAtDesc(memberId).stream()
                .map(RecruitPostResponse::new)
                .toList();
    }

    @Transactional
    public Long createRecruitPost(Member member, RecruitPostRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));
        RecruitPost post = RecruitPost.create(
                member, request.getTitle(), request.getContent(),
                category, request.getBudget(), request.getWeddingDate(), request.getRegion()
        );
        return recruitPostRepository.save(post).getId();
    }

    @Transactional
    public RecruitPostResponse updateRecruitPost(Long postId, Member member, RecruitPostRequest request) {
        RecruitPost post = findMyPost(postId, member);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));
        post.update(request.getTitle(), request.getContent(), category,
                request.getBudget(), request.getWeddingDate(), request.getRegion());
        return new RecruitPostResponse(post);
    }

    @Transactional
    public void deleteRecruitPost(Long postId, Member member) {
        RecruitPost post = findMyPost(postId, member);
        proposalRepository.deleteAll(proposalRepository.findByRecruitPost(post));
        recruitPostRepository.delete(post);
    }

    @Transactional
    public RecruitPostResponse changeStatus(Long postId, Member member, RecruitStatus status) {
        RecruitPost post = findMyPost(postId, member);
        post.changeStatus(status);
        return new RecruitPostResponse(post);
    }

    private RecruitPost findMyPost(Long postId, Member member) {
        RecruitPost post = recruitPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 구인글입니다."));
        if (!post.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("수정/삭제 권한이 없습니다.");
        }
        return post;
    }
}