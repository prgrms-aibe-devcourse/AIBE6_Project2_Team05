package com.wedge.backend.domain.freelancer.service;

import com.wedge.backend.domain.freelancer.dto.IntroductionGenerateRequest;
import com.wedge.backend.domain.freelancer.dto.IntroductionGenerateResponse;
import com.wedge.backend.global.exception.AiGenerationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.client.ChatClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiIntroductionServiceTest {

    @Mock
    private ChatClient chatClient;

    @Mock
    private ChatClient.Builder chatClientBuilder;

    @InjectMocks
    private AiIntroductionService aiIntroductionService;

    @Test
    @DisplayName("정상적인 요청 시 소개글이 생성된다")
    void generateIntroduction_success() {
        // given
        IntroductionGenerateRequest request = createRequest("웨딩 촬영", "자연스러운,따뜻한,감성적");

        ChatClient.ChatClientRequestSpec requestSpec = org.mockito.Mockito.mock(ChatClient.ChatClientRequestSpec.class);
        ChatClient.CallResponseSpec callResponseSpec = org.mockito.Mockito.mock(ChatClient.CallResponseSpec.class);

        when(chatClient.prompt()).thenReturn(requestSpec);
        when(requestSpec.user(any(String.class))).thenReturn(requestSpec);
        when(requestSpec.call()).thenReturn(callResponseSpec);
        when(callResponseSpec.content()).thenReturn("저는 웨딩 촬영 전문가입니다.");

        // when
        IntroductionGenerateResponse response = aiIntroductionService.generateIntroduction(request);

        // then
        assertThat(response.getIntroduction()).isEqualTo("저는 웨딩 촬영 전문가입니다.");
    }

    @Test
    @DisplayName("Gemini 응답이 비어있으면 AiGenerationException이 발생한다")
    void generateIntroduction_emptyResponse() {
        // given
        IntroductionGenerateRequest request = createRequest("웨딩 촬영", "자연스러운");

        ChatClient.ChatClientRequestSpec requestSpec = org.mockito.Mockito.mock(ChatClient.ChatClientRequestSpec.class);
        ChatClient.CallResponseSpec callResponseSpec = org.mockito.Mockito.mock(ChatClient.CallResponseSpec.class);

        when(chatClient.prompt()).thenReturn(requestSpec);
        when(requestSpec.user(any(String.class))).thenReturn(requestSpec);
        when(requestSpec.call()).thenReturn(callResponseSpec);
        when(callResponseSpec.content()).thenReturn("");

        // when & then
        assertThatThrownBy(() -> aiIntroductionService.generateIntroduction(request))
                .isInstanceOf(AiGenerationException.class)
                .hasMessage("소개글 생성에 실패했습니다. 다시 시도해 주세요.");
    }

    @Test
    @DisplayName("Gemini API 호출 실패 시 AiGenerationException이 발생한다")
    void generateIntroduction_apiCallFailed() {
        // given
        IntroductionGenerateRequest request = createRequest("웨딩 촬영", "자연스러운");

        ChatClient.ChatClientRequestSpec requestSpec = org.mockito.Mockito.mock(ChatClient.ChatClientRequestSpec.class);

        when(chatClient.prompt()).thenReturn(requestSpec);
        when(requestSpec.user(any(String.class))).thenReturn(requestSpec);
        when(requestSpec.call()).thenThrow(new RuntimeException("API 호출 실패"));

        // when & then
        assertThatThrownBy(() -> aiIntroductionService.generateIntroduction(request))
                .isInstanceOf(AiGenerationException.class)
                .hasMessage("AI 서비스 호출에 실패했습니다. 다시 시도해 주세요.");
    }

    private IntroductionGenerateRequest createRequest(String categoryName, String keywords) {
        IntroductionGenerateRequest request = new IntroductionGenerateRequest();
        setField(request, "categoryName", categoryName);
        setField(request, "keywords", keywords);
        return request;
    }

    private void setField(Object target, String fieldName, String value) {
        try {
            var field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}