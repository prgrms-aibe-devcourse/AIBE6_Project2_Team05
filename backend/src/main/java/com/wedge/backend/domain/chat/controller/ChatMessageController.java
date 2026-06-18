package com.wedge.backend.domain.chat.controller;

import com.wedge.backend.domain.chat.dto.ChatErrorResponse;
import com.wedge.backend.domain.chat.dto.ChatMessageRequest;
import com.wedge.backend.domain.chat.dto.ChatMessageResponse;
import com.wedge.backend.domain.chat.dto.ChatTypingRequest;
import com.wedge.backend.domain.chat.dto.ChatTypingResponse;
import com.wedge.backend.domain.chat.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatMessageController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(@Valid @Payload ChatMessageRequest request, Principal principal) {
        Long senderId = getMemberId(principal);
        ChatMessageResponse response = chatService.sendMessage(request.getRoomId(), senderId, request.getContent());

        // 채팅방의 수신자에게 메시지 전달
        messagingTemplate.convertAndSendToUser(
                String.valueOf(response.receiverId()),
                "/queue/messages",
                response
        );
        // 발신자 화면에도 즉시 반영하기 위해 동일 메시지 전달
        messagingTemplate.convertAndSendToUser(
                String.valueOf(response.senderId()),
                "/queue/messages",
                response
        );
    }

    @MessageMapping("/chat.typing")
    public void sendTyping(@Valid @Payload ChatTypingRequest request, Principal principal) {
        Long senderId = getMemberId(principal);
        chatService.validateRoomParticipant(request.getRoomId(), senderId);

        // 채팅방 상대한테 입력중 메시지 뜨게 함
        messagingTemplate.convertAndSend(
                "/sub/chat/typing/" + request.getRoomId(),
                new ChatTypingResponse(request.getRoomId(), senderId, request.isTyping())
        );
    }

    @MessageExceptionHandler
    @SendToUser("/queue/errors")
    public ChatErrorResponse handleException(Exception exception) {
        return new ChatErrorResponse(exception.getMessage());
    }

    private Long getMemberId(Principal principal) {
        if (principal == null) {
            throw new IllegalArgumentException("인증 정보가 필요합니다.");
        }
        // WebSocket 인증 과정에서 Principal.name 에 memberId 저장
        return Long.valueOf(principal.getName());
    }
}
