package com.wedge.backend.domain.freelancer.dto;

import com.wedge.backend.domain.freelancer.entity.Portfolio;
import com.wedge.backend.domain.freelancer.entity.PortfolioImage;
import lombok.Getter;

import java.util.List;

@Getter
public class PortfolioResponseDto {
    private Long id;
    private Long freelancerProfileId;
    private String imageUrl;
    private String description;
    private int sortOrder;
    private String startDate;
    private String endDate;
    private String client;
    private String industry;
    private String purpose;
    private List<ImageDto> images;

    @Getter
    public static class ImageDto {
        private Long id;
        private String imageUrl;

        public ImageDto(PortfolioImage image) {
            this.id = image.getId();
            this.imageUrl = image.getImageUrl();
        }
    }

    public PortfolioResponseDto(Portfolio portfolio) {
        this.id = portfolio.getId();
        this.freelancerProfileId = portfolio.getFreelancerProfile().getId();
        this.imageUrl = portfolio.getImageUrl();
        this.description = portfolio.getDescription();
        this.sortOrder = portfolio.getSortOrder();
        this.startDate = portfolio.getStartDate();
        this.endDate = portfolio.getEndDate();
        this.client = portfolio.getClient();
        this.industry = portfolio.getIndustry();
        this.purpose = portfolio.getPurpose();
        this.images = portfolio.getImages().stream()
                .map(ImageDto::new)
                .toList();
    }
}