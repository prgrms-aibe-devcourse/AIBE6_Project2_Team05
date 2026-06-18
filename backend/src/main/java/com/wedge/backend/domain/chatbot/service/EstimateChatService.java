package com.wedge.backend.domain.chatbot.service;

import com.wedge.backend.domain.chatbot.dto.ChatRequest;
import com.wedge.backend.domain.chatbot.dto.ChatResponse;
import com.wedge.backend.domain.chatbot.dto.MessageHistory;
import com.wedge.backend.global.exception.AiGenerationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class EstimateChatService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;
    private final EstimatePromptProvider promptProvider;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String CHAT_KEY_PREFIX = "chatbot:estimate:";
    private static final long TTL_MINUTES = 30L;

    public ChatResponse chat(ChatRequest request) {

        String sessionId = resolveSessionId(request);
        String redisKey = CHAT_KEY_PREFIX + sessionId;

        List<MessageHistory> history = getHistory(redisKey);
        List<Message> messages = buildMessages(history, request.getUserMessage());

        String aiMessage = callChatApi(messages);

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
        history.add(new MessageHistory("assistant", aiMessage));
        redisTemplate.opsForValue().set(redisKey, history, TTL_MINUTES, TimeUnit.MINUTES);
    }

    private List<Message> buildMessages(List<MessageHistory> history, String currentUserMessage) {
        List<Message> messages = new ArrayList<>();

        // 시스템 프롬프트
        messages.add(new SystemMessage(promptProvider.buildSystemPrompt()));

        // 대화 히스토리
        for (MessageHistory h : history) {
            if ("user".equals(h.getRole())) {
                messages.add(new UserMessage(h.getContent()));
            } else {
                messages.add(new AssistantMessage(h.getContent()));
            }
        }

        // 현재 사용자 메시지
        messages.add(new UserMessage(currentUserMessage));
        if (history.size() >= 4) {
            messages.add(new UserMessage(
                    "이제 세 가지 정보를 모두 받았습니다. " +
                            "반드시 JSON 형식으로만 응답하세요. " +
                            "다른 텍스트는 절대 포함하지 마세요."
            ));
        }
        return messages;
    }

    private String callChatApi(List<Message> messages) {
        try {
            return chatClient.prompt()
                    .messages(messages)
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("ChatGPT API 호출 실패: {}", e.getMessage());
            throw new AiGenerationException(
                    "AI 서비스 호출에 실패했습니다.",
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    private ChatResponse parseEstimateResult(String aiMessage, String sessionId) {
        log.info("AI 원본 응답: {}", aiMessage);
        try {

            int start = aiMessage.indexOf("{");
            int end = aiMessage.lastIndexOf("}") + 1;

            if (start == -1 || end == 0) {
                log.error("JSON을 찾을 수 없음. start={}, end={}", start, end);
                throw new AiGenerationException("견적 결과를 파싱할 수 없습니다.");
            }

            String jsonStr = aiMessage.substring(start, end);
            JsonNode node = objectMapper.readTree(jsonStr);

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