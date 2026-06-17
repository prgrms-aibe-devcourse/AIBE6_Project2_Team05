package com.wedge.backend.domain.freelancer.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioRequestDto {
    private String description;
    private int sortOrder;
    private String startDate;
    private String endDate;
    private String client;
    private String industry;
    private String purpose;
}