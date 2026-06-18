package com.wedge.backend.domain.freelancer.service;

import com.wedge.backend.domain.freelancer.dto.AiRecommendationResponse;
import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import com.wedge.backend.domain.freelancer.repository.FreelancerProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AiRecommendationService {

    private final FreelancerProfileRepository freelancerProfileRepository;
    private final ObjectMapper objectMapper;
    private final ChatClient chatClient;

    public List<AiRecommendationResponse> getRecommendations() {

        List<FreelancerProfile> profiles = freelancerProfileRepository.findAll();
        if (profiles.isEmpty()) {
            return List.of();
        }

        Collections.shuffle(profiles);
        List<FreelancerProfile> candidates = profiles.stream().limit(30).toList();

        String profileText = candidates.stream()
                .map(p -> "id:%d, 제목:%s, 지역:%s, 가격:%d원, 경력:%d년"
                        .formatted(p.getId(), p.getTitle(), p.getRegion(),
                                p.getPrice() != null ? p.getPrice() : 0,
                                p.getCareerYears()))
                .collect(Collectors.joining("\n"));

        String prompt = """
                아래는 프리랜서 목록입니다.
                이 중에서 다양성을 고려해 6명을 추천하고, 각각 추천 이유를 한 문장으로 작성해 주세요.
                
                반드시 아래 JSON 배열 형식으로만 응답하세요. 다른 텍스트나 마크다운은 절대 포함하지 마세요.
                [
                  {"id": 1, "reason": "추천 이유"},
                  {"id": 2, "reason": "추천 이유"}
                ]
                
                프리랜서 목록:
                %s
                """.formatted(profileText);

        try {
            String response = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();

            return parseResponse(response, candidates);

        } catch (Exception e) {
            log.error("ChatGPT API 호출 실패: {}", e.getMessage());
            return List.of();
        }
    }

    private List<AiRecommendationResponse> parseResponse(
            String response, List<FreelancerProfile> candidates) {
        try {
            // JSON 배열 추출
            int start = response.indexOf("[");
            int end = response.lastIndexOf("]") + 1;
            if (start == -1 || end == 0) {
                log.warn("응답에서 JSON 배열을 찾을 수 없습니다.");
                return List.of();
            }
            String json = response.substring(start, end);

            JsonNode recommendations = objectMapper.readTree(json);

            Map<Long, FreelancerProfile> profileMap = candidates.stream()
                    .collect(Collectors.toMap(FreelancerProfile::getId, p -> p));

            List<AiRecommendationResponse> result = new ArrayList<>();
            for (JsonNode item : recommendations) {
                Long id = item.path("id").asLong();
                String reason = item.path("reason").asText();
                FreelancerProfile profile = profileMap.get(id);
                if (profile != null) {
                    result.add(AiRecommendationResponse.of(profile, reason));
                }
            }
            return result;

        } catch (Exception e) {
            log.error("응답 파싱 실패: {}", e.getMessage());
            return List.of();
        }
    }
}