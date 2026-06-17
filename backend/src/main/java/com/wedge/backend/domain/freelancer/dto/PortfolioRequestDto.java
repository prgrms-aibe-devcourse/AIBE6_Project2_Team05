package com.wedge.backend.domain.freelancer.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PortfolioRequestDto {
    private String description;
    private int sortOrder;

}