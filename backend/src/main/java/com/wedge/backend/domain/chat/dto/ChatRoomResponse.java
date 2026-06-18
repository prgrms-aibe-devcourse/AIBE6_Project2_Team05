package com.wedge.backend.domain.chat.dto;

import com.wedge.backend.domain.chat.entity.ChatRoom;

import java.time.LocalDateTime;

public record ChatRoomResponse(
        Long id,
        Long reservationId,
        ChatOpponentResponse opponent,
        LocalDateTime lastMessageAt,
        boolean isActive
) {

    public static ChatRoomResponse from(ChatRoom room, ChatOpponentResponse opponent) {
        return new ChatRoomResponse(
                room.getId(),
                room.getReservationId(),
                opponent,
                room.getLastMessageAt(),
                room.isActive()
        );
    }
}
