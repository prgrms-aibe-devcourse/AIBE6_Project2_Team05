package com.wedge.backend.domain.category.entity;

import java.util.Arrays;

public enum CategoryType {
    WEDDING_PHOTO(1L, "웨딩 사진작가"),
    WEDDING_VIDEO(2L, "웨딩 영상"),
    HAIR_MAKEUP(3L, "헤어·메이크업"),
    FLORIST(4L, "웨딩 플로리스트"),
    PLANNER(5L, "웨딩 플래너"),
    OFFICIANT(6L, "주례·혼례사"),
    BAND(7L, "연주·밴드"),
    SONG(8L, "축가"),
    HOST(9L, "사회자"),
    ETC(10L, "기타");

    private final Long id;
    private final String name;

    CategoryType(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() { return id; }
    public String getName() { return name; }

    public static CategoryType fromId(Long id) {
        return Arrays.stream(values())
                .filter(c -> c.id.equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));
    }

    public static CategoryType fromName(String name) {
        return Arrays.stream(values())
                .filter(c -> c.name.equals(name))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));
    }
}