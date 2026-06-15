package com.wedge.backend.domain.bookmark.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ToggleBookmarkResponse {
    private final boolean bookmarked;
    private final String message;
}