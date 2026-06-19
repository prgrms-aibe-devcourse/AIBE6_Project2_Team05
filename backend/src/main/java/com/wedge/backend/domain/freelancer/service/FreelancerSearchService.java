package com.wedge.backend.domain.freelancer.service;

import com.wedge.backend.domain.freelancer.dto.FreelancerProfileResponse;
import com.wedge.backend.domain.freelancer.dto.SortType;
import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import com.wedge.backend.domain.freelancer.repository.FreelancerProfileRepository;
import com.wedge.backend.domain.freelancer.repository.PortfolioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FreelancerSearchService {

    private final FreelancerProfileRepository freelancerProfileRepository;
    private final PortfolioRepository portfolioRepository;

    public Page<FreelancerProfileResponse> getFreelancers(
            String keyword,
            Long categoryId,
            String region,
            Integer minPrice,
            Integer maxPrice,
            SortType sortType,
            Pageable pageable) {

        Specification<FreelancerProfile> spec = (root, query, cb) -> null;

        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and((root, query, cb) -> {
                var memberJoin = root.join("member", jakarta.persistence.criteria.JoinType.LEFT);
                return cb.or(
                        cb.like(root.get("title"), "%" + keyword + "%"),
                        cb.like(memberJoin.get("name"), "%" + keyword + "%")
                );
            });
        }

        if (categoryId != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("category").get("id"), categoryId));
        }

        if (region != null && !region.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("region"), region));
        }

        if (minPrice != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        }

        if (maxPrice != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        }


        Pageable sortedPageable = switch (sortType) {
            case NEW -> PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.by(Sort.Direction.DESC, "createdAt")
            );
            case POPULAR -> PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.by(Sort.Direction.DESC, "bookmarkCount").and(Sort.by(Sort.Direction.DESC, "createdAt"))
            );
            default -> pageable;
        };

        return freelancerProfileRepository.findAll(spec, sortedPageable)
                .map(profile -> FreelancerProfileResponse.from(
                        profile,
                        portfolioRepository
                                .findFirstByFreelancerProfileIdOrderBySortOrderAscIdAsc(profile.getId())
                                .map(portfolio -> portfolio.getImageUrl())
                                .orElse(null)
                ));
    }
}