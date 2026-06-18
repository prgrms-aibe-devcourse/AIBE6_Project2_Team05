package com.wedge.backend.domain.chat.dto;

import com.wedge.backend.domain.chat.entity.ChatMessage;

import java.time.LocalDateTime;

public record ChatMessageResponse(
        Long id,
        Long roomId,
        Long senderId,
        Long receiverId,
        String content,
        LocalDateTime readAt,
        LocalDateTime createdAt
) {

    public static ChatMessageResponse from(ChatMessage message) {
        return new ChatMessageResponse(
                message.getId(),
                message.getRoomId(),
                message.getSenderId(),
                message.getReceiverId(),
                message.getContent(),
                message.getReadAt(),
                message.getCreatedAt()
        );
    }
}
