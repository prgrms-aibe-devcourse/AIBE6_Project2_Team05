package com.wedge.backend.global.websocket;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 회원 접속 상태 관리 서비스
 *
 * 누가 지금 WebSocket에 접속 중인지 실시간으로 추적
 *
 * 동작 방식:
 * - 접속하면 (SessionConnectEvent) → 회원 ID별로 세션 ID 저장
 * - 접속 종료하면 (SessionDisconnectEvent) → 세션 ID 제거
 * - 한 회원이 여러 기기로 접속해도 모두 추적 가능
 *
 * 사용 예시:
 * - 메시지 전송 전에 상대방이 접속 중인지 확인
 * - 접속 중이면 실시간 전송, 아니면 푸시 알림 발송
 */

@Service
public class ChatOnlineStatusService {

    private final ConcurrentHashMap<Long, Set<String>> sessionsByMemberId = new ConcurrentHashMap<>();


     //해당 회원이 현재 접속 중인지 확인
    public boolean isOnline(Long memberId) {
        Set<String> sessions = sessionsByMemberId.get(memberId);
        return sessions != null && !sessions.isEmpty();
    }

    //웹소켓 연결될 때 실행 - 접속 정보 저장
    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = accessor.getUser();
        if (user == null || accessor.getSessionId() == null) {
            return;
        }

        Long memberId = Long.valueOf(user.getName());
        Set<String> sessions = sessionsByMemberId.get(memberId);
        if (sessions == null) {
            return;
        }

        sessions.remove(accessor.getSessionId());
        if (sessions.isEmpty()) {
            sessionsByMemberId.remove(memberId);
        }
    }

    // 웹소켓 연결 종료될 때 실행 - 접속 정보 제거
    @EventListener
    public void handleConnect(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = accessor.getUser();
        if (user == null || accessor.getSessionId() == null) {
            return;
        }

        Long memberId = Long.valueOf(user.getName());
        sessionsByMemberId.computeIfAbsent(memberId, ignored -> ConcurrentHashMap.newKeySet())
                .add(accessor.getSessionId());
    }
}
