package com.wedge.backend.domain.freelancer.service;

import com.wedge.backend.domain.freelancer.dto.IntroductionGenerateRequest;
import com.wedge.backend.domain.freelancer.dto.IntroductionGenerateResponse;
import com.wedge.backend.global.exception.AiGenerationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

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

    private final ChatClient chatClient;

    public IntroductionGenerateResponse generateIntroduction(IntroductionGenerateRequest request) {
        try {
            String result = chatClient.prompt()
                    .user(buildPrompt(request))
                    .call()
                    .content();

            if (result == null || result.isBlank()) {
                throw new AiGenerationException("소개글 생성에 실패했습니다. 다시 시도해 주세요.");
            }

            return IntroductionGenerateResponse.from(result);

        } catch (AiGenerationException e) {
            throw e;
        } catch (Exception e) {
            log.error("ChatGPT API 호출 실패: {}", e.getMessage());
            throw new AiGenerationException("AI 서비스 호출에 실패했습니다. 다시 시도해 주세요.");
        }
    }

    private String buildPrompt(IntroductionGenerateRequest request) {
        return PROMPT_TEMPLATE.formatted(request.getCategoryName(), request.getKeywords());
    }
}