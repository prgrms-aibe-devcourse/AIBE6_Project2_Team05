package com.wedge.backend.domain.freelancer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wedge.backend.domain.freelancer.dto.IntroductionGenerateRequest;
import com.wedge.backend.domain.freelancer.dto.IntroductionGenerateResponse;
import com.wedge.backend.global.exception.AiGenerationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiIntroductionService {
    private static final String PROMPT_TEMPLATE = """
            당신은 웨딩 프리랜서 프로필 소개글 작성 전문가입니다.
            아래 정보를 바탕으로 자연스럽고 신뢰감 있는 소개글을 3~4문장으로 작성해 주세요.
            
            - 직종: %s
            - 스타일 키워드: %s
            
            규칙:
            1. 1인칭(저는)으로 작성
            2. 과장 없이 진솔하게
            3. 소개글 텍스트만 반환, 다른 텍스트 절대 포함 금지
            """;

    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.url}")
    private String geminiUrl;

    public IntroductionGenerateResponse generateIntroduction(IntroductionGenerateRequest request) {

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", buildPrompt(request))
                        ))
                )
        );

        String response;
        try {
            response = callGeminiApi(requestBody);
        } catch (Exception e) {
            log.error("Gemini API 호출 실패: {}", e.getMessage());
            throw new AiGenerationException("AI 서비스 호출에 실패했습니다. 다시 시도해 주세요.");
        }

        return IntroductionGenerateResponse.from(parseResponse(response));
    }

    private String buildPrompt(IntroductionGenerateRequest request) {
        return PROMPT_TEMPLATE.formatted(request.getCategoryName(), request.getKeywords());
    }

    protected String callGeminiApi(Map<String, Object> requestBody) {
        return restClient
                .post()
                .uri(geminiUrl + "?key=" + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(String.class);
    }

    private String parseResponse(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);
            String text = root
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text")
                    .asText();

            if (text == null || text.isBlank()) {
                throw new AiGenerationException("소개글 생성에 실패했습니다. 다시 시도해 주세요.");
            }
            return text;

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Gemini 응답 파싱 실패: {}", e.getMessage());
            throw new AiGenerationException("소개글 생성에 실패했습니다. 다시 시도해 주세요.");
        }
    }
}