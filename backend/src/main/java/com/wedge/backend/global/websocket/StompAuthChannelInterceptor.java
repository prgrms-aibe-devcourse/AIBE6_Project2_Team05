package com.wedge.backend.global.websocket;

import com.wedge.backend.domain.chat.service.ChatService;
import com.wedge.backend.global.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.List;

/**
 * STOMP 메시지 검문소
 *
 * 클라이언트가 보낸 모든 STOMP 메시지를 가로채서 검사하는 곳
 *
 * 하는 일:
 * 1. 처음 연결할 때(CONNECT) - JWT 토큰 검사해서 누군지 확인
 * 2. 구독할 때(SUBSCRIBE) - 그 방에 들어갈 자격이 있는지 확인
 */

@Component
@RequiredArgsConstructor
public class StompAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;
    private final ChatService chatService;

    /**
     * 클라이언트가 보낸 메시지가 서버에 도착하면 제일 먼저 실행되는 메서드
     *
     * @param message 클라이언트가 보낸 메시지 (헤더 + 내용)
     * @param channel 메시지가 지나가는 통로 (서버 내부의 컨베이어 벨트)
     * @return 검사 통과한 메시지 (문제 있으면 예외 발생)
     */
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null) {
            return message;
        }

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            authenticate(accessor);
        }

        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            validateSubscription(accessor);
        }

        return message;
    }

    /**
     * 연결(CONNECT) 요청 처리 - 신분증 검사
     *
     * 클라이언트가 WebSocket에 연결하려고 할 때 실행
     *
     *
     * 순서:
     * 1. 클라이언트가 보낸 JWT 토큰을 꺼냄 (Authorization 헤더)
     * 2. 토큰이 유효한지 검사 (위조/만료 확인)
     * 3. 토큰에서 회원 ID와 권한(role) 추출
     * 4. "이 사람은 회원 ID가 123인 홍길동입니다" 라고 기록
     * 5. 기록해둔 정보를 세션에 저장 (나중에 컨트롤러에서 사용)
     *
     * @param accessor 메시지 헤더 접근 도구
     * @throws IllegalArgumentException 토큰이 없거나 잘못된 경우
     */
    private void authenticate(StompHeaderAccessor accessor) {
        String token = resolveBearerToken(accessor.getFirstNativeHeader("Authorization"));
        if (token == null) {
            throw new IllegalArgumentException("인증 토큰이 필요합니다.");
        }

        jwtUtil.validateTokenOrThrow(token);
        Long memberId = jwtUtil.getMemberId(token);
        String role = jwtUtil.getRole(token);

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                memberId,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_" + role))
        );
        accessor.setUser(new StompMemberPrincipal(memberId));
        accessor.setHeader("simpAuthentication", authentication);
    }

    /**
     * 구독(SUBSCRIBE) 요청 처리 - 방문 자격 확인
     *
     * 클라이언트가 특정 경로를 구독하려고 할 때 실행
     *
     * 현재는 타이핑 상태 구독(/sub/chat/typing/방번호)만 검사하지만,
     * 필요하면 다른 구독 경로도 검사할 수 있어요.
     *
     * @param accessor 메시지 헤더 접근 도구
     * @throws IllegalArgumentException 해당 방의 참여자가 아닌 경우
     */
    private void validateSubscription(StompHeaderAccessor accessor) {
        Principal user = accessor.getUser();
        String destination = accessor.getDestination();
        if (user == null || destination == null || !destination.startsWith("/sub/chat/typing/")) {
            return;
        }

        Long roomId = Long.valueOf(destination.substring("/sub/chat/typing/".length()));
        chatService.validateRoomParticipant(roomId, Long.valueOf(user.getName()));
    }

    /**
     * "Bearer 토큰"에서 실제 토큰만 추출
     *
     * 여기서 "Bearer " 부분을 제거하고 순수한 토큰만 반환해요.
     *
     * @param authorization Authorization 헤더 값
     * @return 순수 JWT 토큰 (Bearer 제거), 없으면 null
     */
    private String resolveBearerToken(String authorization) {
        if (authorization != null && authorization.startsWith("Bearer ")) {
            return authorization.substring(7);
        }
        return null;
    }
}
