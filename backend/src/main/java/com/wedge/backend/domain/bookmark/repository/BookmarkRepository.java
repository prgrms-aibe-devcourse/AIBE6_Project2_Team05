package com.wedge.backend.domain.bookmark.repository;

import com.wedge.backend.domain.bookmark.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    boolean existsByMemberIdAndFreelancerProfileId(Long memberId, Long freelancerProfileId);

    Optional<Bookmark> findByMemberIdAndFreelancerProfileId(Long memberId, Long freelancerProfileId);

    void deleteAllByMemberId(Long memberId);
    List<Bookmark> findAllByMemberId(Long memberId);
    @Query("SELECT b FROM Bookmark b " +
            "JOIN FETCH b.freelancerProfile fp " +
            "JOIN FETCH fp.member " +
            "WHERE b.member.id = :memberId")
    List<Bookmark> findAllByMemberIdWithProfile(@Param("memberId") Long memberId);
}