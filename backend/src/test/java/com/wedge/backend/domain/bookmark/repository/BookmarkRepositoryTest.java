package com.wedge.backend.domain.bookmark.repository;

import com.wedge.backend.domain.bookmark.entity.Bookmark;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@ActiveProfiles("local")
class BookmarkRepositoryTest {

    @Autowired
    BookmarkRepository bookmarkRepository;
    @PersistenceContext
    EntityManager em;

    @Test
    @DisplayName("fetch join으로 N+1 없이 조회된다")
    void fetchJoinTest() {
        // given
        Long memberId = 1L; // 실제 DB에 있는 memberId

        em.flush();
        em.clear(); // 1차 캐시 초기화 (캐시 없이 순수하게 DB 조회)

        // when
        List<Bookmark> bookmarks = bookmarkRepository
                .findAllByMemberIdWithProfile(memberId);

        // then
        // 이 시점에서 추가 쿼리 없이 접근 가능해야 함
        assertThatCode(() -> {
            bookmarks.forEach(b -> {
                b.getFreelancerProfile().getTitle();      // 추가 쿼리 없어야 함
                b.getFreelancerProfile().getMember().getName(); // 추가 쿼리 없어야 함
            });
        }).doesNotThrowAnyException();
    }
}