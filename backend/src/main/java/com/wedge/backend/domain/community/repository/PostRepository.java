package com.wedge.backend.domain.community.repository;

import com.wedge.backend.domain.community.entity.Post;
import com.wedge.backend.domain.community.entity.PostType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findAllByIsDeletedFalseOrderByCreatedAtDesc(Pageable pageable);

    Page<Post> findAllByTypeAndIsDeletedFalseOrderByCreatedAtDesc(PostType type, Pageable pageable);

    Optional<Post> findByIdAndIsDeletedFalse(Long id);
}
