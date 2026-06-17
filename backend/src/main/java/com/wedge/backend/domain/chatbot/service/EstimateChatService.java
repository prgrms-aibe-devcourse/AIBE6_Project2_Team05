package com.wedge.backend.domain.chatbot.service;

import com.wedge.backend.domain.chatbot.dto.ChatRequest;
import com.wedge.backend.domain.chatbot.dto.ChatResponse;
import com.wedge.backend.domain.chatbot.dto.MessageHistory;
import com.wedge.backend.global.exception.AiGenerationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class EstimateChatService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final EstimatePromptProvider promptProvider;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String CHAT_KEY_PREFIX = "chatbot:estimate:";
    private static final long TTL_MINUTES = 30L;

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.url}")
    private String geminiUrl;

    public ChatResponse chat(ChatRequest request) {

        String sessionId = resolveSessionId(request);
        String redisKey = CHAT_KEY_PREFIX + sessionId;

        List<MessageHistory> history = getHistory(redisKey);

        List<Map<String, Object>> contents = buildContents(history, request.getUserMessage());

        String rawResponse = callGeminiApi(Map.of("contents", contents));
        String aiMessage = parseResponse(rawResponse);

        saveHistory(redisKey, request.getUserMessage(), aiMessage);

        if (request.getTurn() == 3) {
            redisTemplate.delete(redisKey);
            return parseEstimateResult(aiMessage, sessionId);
        }

        return ChatResponse.builder()
                .sessionId(sessionId)
                .message(aiMessage)
                .isDone(false)
                .build();
    }

    private String resolveSessionId(ChatRequest request) {
        if (request.getTurn() == 1 || request.getSessionId() == null) {
            return UUID.randomUUID().toString();
        }
        return request.getSessionId();
    }

    @SuppressWarnings("unchecked")
    private List<MessageHistory> getHistory(String redisKey) {
        Object stored = redisTemplate.opsForValue().get(redisKey);
        if (stored == null) return new ArrayList<>();

        List<LinkedHashMap<String, String>> rawList = (List<LinkedHashMap<String, String>>) stored;
        return rawList.stream()
                .map(map -> new MessageHistory(map.get("role"), map.get("content")))
                .collect(java.util.stream.Collectors.toList());
    }

    private void saveHistory(String redisKey, String userMessage, String aiMessage) {
        List<MessageHistory> history = getHistory(redisKey);
        history.add(new MessageHistory("user", userMessage));
        history.add(new MessageHistory("model", aiMessage));
        redisTemplate.opsForValue().set(redisKey, history, TTL_MINUTES, TimeUnit.MINUTES);
    }

    private List<Map<String, Object>> buildContents(
            List<MessageHistory> history, String currentUserMessage) {

        List<Map<String, Object>> contents = new ArrayList<>();

        contents.add(makeContent("user", promptProvider.buildSystemPrompt()));
        contents.add(makeContent("model",
                "안녕하세요! Wedge 견적 챗봇입니다 💍 " +
                        "원하시는 웨딩 서비스를 선택해 주세요! " +
                        "(스튜디오 촬영 / 드레스 대여 / 헤어메이크업 / 부케 / 영상 촬영)"));

        for (MessageHistory h : history) {
            contents.add(makeContent(h.getRole(), h.getContent()));
        }

        contents.add(makeContent("user", currentUserMessage));

        return contents;
    }

    private Map<String, Object> makeContent(String role, String text) {
        return Map.of(
                "role", role,
                "parts", List.of(Map.of("text", text))
        );
    }

    private String callGeminiApi(Map<String, Object> requestBody) {
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
                throw new AiGenerationException("챗봇 응답이 비어있습니다. 다시 시도해 주세요.");
            }
            return text;

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Gemini 응답 파싱 실패: {}", e.getMessage());
            throw new AiGenerationException("챗봇 응답 처리에 실패했습니다.");
        }
    }

    private ChatResponse parseEstimateResult(String aiMessage, String sessionId) {
        try {
            String cleaned = aiMessage
                    .replaceAll("(?s)```json\\s*", "")
                    .replaceAll("```", "")
                    .trim();

            JsonNode node = objectMapper.readTree(cleaned);

            List<String> services = new ArrayList<>();
            node.path("selectedServices").forEach(s -> services.add(s.asText()));

            return ChatResponse.builder()
                    .sessionId(sessionId)
                    .message(node.path("message").asText())
                    .isDone(true)
                    .estimate(ChatResponse.EstimateResult.builder()
                            .selectedServices(services)
                            .priceRange(node.path("priceRange").asText())
                            .summary(node.path("summary").asText())
                            .build())
                    .build();

        } catch (Exception e) {
            log.error("견적 결과 파싱 실패, 폴백 처리: {}", e.getMessage());
            return ChatResponse.builder()
                    .sessionId(sessionId)
                    .message(aiMessage)
                    .isDone(true)
                    .build();
        }
    }
}