package com.wedge.backend.domain.freelancer.entity;

import com.wedge.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "portfolio_images")
public class PortfolioImage extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @Builder
    public PortfolioImage(Portfolio portfolio, String imageUrl, int sortOrder) {
        this.portfolio = portfolio;
        this.imageUrl = imageUrl;
        this.sortOrder = sortOrder;
    }
}