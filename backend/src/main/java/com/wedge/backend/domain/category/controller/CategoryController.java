package com.wedge.backend.domain.category.controller;

import com.wedge.backend.domain.category.dto.CategoryResponse;
import com.wedge.backend.domain.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getCategories() {
        return ResponseEntity.ok(
                categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "id"))
                        .stream()
                        .map(CategoryResponse::from)
                        .toList()
        );
    }
}