package com.wedge.backend.domain.proposal.dto;

import com.wedge.backend.domain.proposal.entity.Proposal;
import com.wedge.backend.domain.proposal.entity.ProposalStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ProposalResponse {

    private final Long id;
    private final Long freelancerProfileId;
    private final String freelancerName;
    private final String content;
    private final Integer price;
    private final String region;
    private final ProposalStatus status;
    private final LocalDateTime createdAt;

    public ProposalResponse(Proposal proposal) {
        this.id = proposal.getId();
        this.freelancerProfileId = proposal.getFreelancerProfile().getId();
        this.freelancerName = proposal.getFreelancerProfile().getMember().getName();
        this.content = proposal.getContent();
        this.price = proposal.getPrice();
        this.region = proposal.getRegion();
        this.status = proposal.getStatus();
        this.createdAt = proposal.getCreatedAt();
    }
}
