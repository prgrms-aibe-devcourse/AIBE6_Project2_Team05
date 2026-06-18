package com.wedge.backend.domain.freelancer.entity;

import com.wedge.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "portfolios")
public class Portfolio extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_profile_id", nullable = false)
    private FreelancerProfile freelancerProfile;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @Column(name = "start_date", length = 20)
    private String startDate;

    @Column(name = "end_date", length = 20)
    private String endDate;

    @Column(name = "client", length = 100)
    private String client;

    @Column(name = "industry", length = 100)
    private String industry;

    @Column(name = "purpose", length = 100)
    private String purpose;

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<PortfolioImage> images = new ArrayList<>();

    @Builder
    public Portfolio(FreelancerProfile freelancerProfile, String imageUrl,
                     String description, int sortOrder,
                     String startDate, String endDate,
                     String client, String industry, String purpose) {
        this.freelancerProfile = freelancerProfile;
        this.imageUrl = imageUrl;
        this.description = description;
        this.sortOrder = sortOrder;
        this.startDate = startDate;
        this.endDate = endDate;
        this.client = client;
        this.industry = industry;
        this.purpose = purpose;
    }

    public void update(String imageUrl, String description, int sortOrder,
                       String startDate, String endDate,
                       String client, String industry, String purpose) {
        this.imageUrl = imageUrl;
        this.description = description;
        this.sortOrder = sortOrder;
        this.startDate = startDate;
        this.endDate = endDate;
        this.client = client;
        this.industry = industry;
        this.purpose = purpose;
    }
}