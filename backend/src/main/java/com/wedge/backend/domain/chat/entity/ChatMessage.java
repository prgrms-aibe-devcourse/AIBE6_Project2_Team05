package com.wedge.backend.domain.chat.entity;

import com.wedge.backend.domain.member.entity.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "chat_messages")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private ChatRoom room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private Member sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private Member receiver;

    @Column(nullable = false, length = 1000)
    private String content;

    private LocalDateTime readAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public static ChatMessage create(ChatRoom room, Member sender, Member receiver, String content) {
        ChatMessage message = new ChatMessage();
        message.room = room;
        message.sender = sender;
        message.receiver = receiver;
        message.content = content;
        return message;
    }

    public Long getRoomId() {
        return room.getId();
    }

    public Long getSenderId() {
        return sender.getId();
    }

    public Long getReceiverId() {
        return receiver.getId();
    }

    public void markRead(LocalDateTime readAt) {
        if (this.readAt == null) {
            this.readAt = readAt;
        }
    }

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
