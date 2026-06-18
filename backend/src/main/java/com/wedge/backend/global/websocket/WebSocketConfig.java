package com.wedge.backend.global.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket + STOMP 설정 클래스
 *
 * 실시간 1:1 채팅을 위한 WebSocket 엔드포인트와 메시지 브로커를 구성합니다.
 *
 * - WebSocket 연결 엔드포인트: /ws
 * - 발행(Publish) prefix: /pub
 * - 구독(Subscribe) prefix: /sub
 * - 개인 메시지 수신: /user/queue/messages
 * - JWT 인증: StompAuthChannelInterceptor에서 처리
 */





@Configuration
@RequiredArgsConstructor
@EnableWebSocketMessageBroker // STOMP over WebSocket 활성화

public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompAuthChannelInterceptor stompAuthChannelInterceptor;

    @Value("${app.frontend-url}")
    private String frontendUrl;


    /**
     * 메시지 발행/구독과 관련된 prefix(접두사)를 설정합니다.
     *
     * - /pub : 클라이언트가 메시지를 보낼 때 (발행, Publish)
     * - /sub : 클라이언트가 특정 채널(주제)을 구독하여 메시지를 받을 때 (Subscribe)
     *          (예: /sub/chat/typing/{roomId} → 특정 방의 타이핑 상태만 수신)
     *
     * - /queue : 개인 메시지 저장용 prefix (개인 우체통)
     * - /user : 특정 사용자를 지칭할 때 prefix (예: /user/{userId}/queue/messages)
     */

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/sub", "/queue");
        registry.setApplicationDestinationPrefixes("/pub");
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins(frontendUrl);
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompAuthChannelInterceptor);
    }
}
