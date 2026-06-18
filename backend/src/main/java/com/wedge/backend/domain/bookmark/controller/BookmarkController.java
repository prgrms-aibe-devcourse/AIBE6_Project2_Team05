package com.wedge.backend.domain.bookmark.controller;

import com.wedge.backend.domain.bookmark.dto.BookmarkResponse;
import com.wedge.backend.domain.bookmark.dto.CheckBookmarkResponse;
import com.wedge.backend.domain.bookmark.dto.ToggleBookmarkResponse;
import com.wedge.backend.domain.bookmark.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @PostMapping("/{freelancerProfileId}")
    public ResponseEntity<ToggleBookmarkResponse> toggleBookmark(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long freelancerProfileId) {

        boolean isBookmarked = bookmarkService.toggleBookmark(memberId, freelancerProfileId);

        return ResponseEntity.ok(new ToggleBookmarkResponse(
                isBookmarked,
                isBookmarked ? "찜하기 완료" : "찜 해제 완료"
        ));
    }

    @GetMapping("/{freelancerProfileId}")
    public ResponseEntity<CheckBookmarkResponse> checkBookmark(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long freelancerProfileId) {

        boolean isBookmarked = bookmarkService.isBookmarked(memberId, freelancerProfileId);

        return ResponseEntity.ok(new CheckBookmarkResponse(isBookmarked));
    }

    @GetMapping
    public ResponseEntity<List<BookmarkResponse>> getBookmarks(
            @AuthenticationPrincipal Long memberId) {

        List<BookmarkResponse> bookmarks = bookmarkService.getBookmarks(memberId);
        return ResponseEntity.ok(bookmarks);
    }
}