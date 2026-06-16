package com.wedge.backend.domain.bookmark.service;

import com.wedge.backend.domain.bookmark.dto.BookmarkResponse;
import com.wedge.backend.domain.bookmark.entity.Bookmark;
import com.wedge.backend.domain.bookmark.repository.BookmarkRepository;
import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import com.wedge.backend.domain.freelancer.repository.FreelancerProfileRepository;
import com.wedge.backend.domain.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;


    @Transactional
    public boolean toggleBookmark(Member member, Long freelancerProfileId) {

        FreelancerProfile freelancerProfile = freelancerProfileRepository
                .findById(freelancerProfileId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 프리랜서입니다."));

        Optional<Bookmark> existing = bookmarkRepository
                .findByMemberIdAndFreelancerProfileId(member.getId(), freelancerProfileId);

        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            freelancerProfile.decreaseBookmarkCount();
            return false;
        }

        Bookmark bookmark = Bookmark.builder()
                .member(member)
                .freelancerProfile(freelancerProfile)
                .build();
        bookmarkRepository.save(bookmark);
        freelancerProfile.increaseBookmarkCount();
        return true;
    }

    @Transactional(readOnly = true)
    public boolean isBookmarked(Long memberId, Long freelancerProfileId) {
        return bookmarkRepository.existsByMemberIdAndFreelancerProfileId(
                memberId, freelancerProfileId);
    }

    @Transactional(readOnly = true)
    public List<BookmarkResponse> getBookmarks(Long memberId) {
        return bookmarkRepository.findAllByMemberIdWithProfile(memberId)
                .stream()
                .map(BookmarkResponse::from)
                .toList();
    }
}