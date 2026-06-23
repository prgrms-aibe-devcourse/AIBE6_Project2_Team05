package com.wedge.backend.domain.community.controller;

import com.wedge.backend.domain.community.dto.PostRequest;
import com.wedge.backend.domain.community.dto.PostResponse;
import com.wedge.backend.domain.community.entity.PostType;
import com.wedge.backend.domain.community.service.PostService;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/posts")
@Tag(name = "커뮤니티 게시판 (Post)", description = "웨딩 후기 / 꿀팁 / 게시판 / 재능기부 게시글 CRUD API")
public class PostController {

    private final PostService postService;
    private final MemberService memberService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "게시글 등록", description = "로그인한 회원이 게시글을 등록합니다. 이미지는 최대 4장까지 첨부 가능합니다. (WEDDING_REVIEW / TIP / BOARD / TALENT)")
    public ResponseEntity<Map<String, Long>> createPost(
            Authentication authentication,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam PostType type,
            @RequestParam(required = false) List<MultipartFile> images) throws IOException {
        Long postId = postService.createPost(getAuthenticatedMember(authentication), title, content, type, images);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("postId", postId));
    }

    @GetMapping
    @Operation(summary = "게시글 목록 조회", description = "타입 필터(선택)와 페이지네이션으로 게시글 목록을 조회합니다.")
    public ResponseEntity<Page<PostResponse>> getPosts(
            @RequestParam(required = false) PostType type,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(postService.getPosts(type, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "게시글 단건 조회", description = "게시글 ID로 단건 조회합니다.")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPost(id));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "게시글 수정", description = "작성자 본인만 수정할 수 있습니다.")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody PostRequest request) {
        return ResponseEntity.ok(postService.updatePost(id, getAuthenticatedMember(authentication), request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "게시글 삭제", description = "작성자 본인만 삭제할 수 있습니다.") // 소프트 삭제
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            Authentication authentication) {
        postService.deletePost(id, getAuthenticatedMember(authentication));
        return ResponseEntity.noContent().build();
    }

    private Member getAuthenticatedMember(Authentication authentication) {
        return memberService.getMember((Long) authentication.getPrincipal());
    }
}
