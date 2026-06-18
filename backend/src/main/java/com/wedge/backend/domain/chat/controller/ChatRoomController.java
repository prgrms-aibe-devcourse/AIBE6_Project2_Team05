package com.wedge.backend.domain.chat.controller;

import com.wedge.backend.domain.chat.dto.ChatMessageResponse;
import com.wedge.backend.domain.chat.dto.ChatReadResponse;
import com.wedge.backend.domain.chat.dto.ChatRoomCreateRequest;
import com.wedge.backend.domain.chat.dto.ChatRoomResponse;
import com.wedge.backend.domain.chat.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chat/rooms")
public class ChatRoomController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatRoomResponse> createRoom(
            Authentication authentication,
            @Valid @RequestBody ChatRoomCreateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(chatService.createOrGetRoom(request.getReservationId(), getMemberId(authentication)));
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<ChatRoomResponse> getRoom(
            Authentication authentication,
            @PathVariable Long roomId
    ) {
        return ResponseEntity.ok(chatService.getRoom(roomId, getMemberId(authentication)));
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<Page<ChatMessageResponse>> getMessages(
            Authentication authentication,
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(chatService.getMessages(roomId, getMemberId(authentication), page, size));
    }

    @PutMapping("/{roomId}/read")
    public ResponseEntity<ChatReadResponse> markRead(
            Authentication authentication,
            @PathVariable Long roomId
    ) {
        chatService.markRead(roomId, getMemberId(authentication));
        return ResponseEntity.ok(new ChatReadResponse(true));
    }
    // JWT 인증 필터에서 Principal을 memberId(Long)로 저장
    private Long getMemberId(Authentication authentication) {
        return (Long) authentication.getPrincipal();
    }
}
