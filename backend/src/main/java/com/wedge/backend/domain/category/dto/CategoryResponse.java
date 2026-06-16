package com.wedge.backend.domain.category.dto;

import com.wedge.backend.domain.category.entity.Category;
import lombok.Getter;

@Getter
public class CategoryResponse {

    private Long id;
    private String name;

    public static CategoryResponse from(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.id = category.getId();
        response.name = category.getName();
        return response;
    }
}