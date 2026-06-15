package com.wedge.backend.domain.bookmark.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CheckBookmarkResponse {
    private final boolean bookmarked;
}