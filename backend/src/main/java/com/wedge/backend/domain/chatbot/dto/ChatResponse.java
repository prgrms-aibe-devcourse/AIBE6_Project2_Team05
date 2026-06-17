package com.wedge.backend.domain.chatbot.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ChatResponse {

    private String sessionId;
    private String message;
    private boolean isDone;
    private EstimateResult estimate;

    @Getter
    @Builder
    public static class EstimateResult {
        private List<String> selectedServices;
        private String priceRange;
        private String summary;
    }
}