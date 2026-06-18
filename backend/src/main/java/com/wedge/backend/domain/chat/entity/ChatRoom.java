package com.wedge.backend.domain.chat.entity;

import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.reservations.entity.Reservation;
import com.wedge.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "chat_rooms")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatRoom extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false, unique = true)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant1_id", nullable = false)
    private Member participant1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant2_id", nullable = false)
    private Member participant2;

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    @Column(nullable = false)
    private boolean active = true;

    public static ChatRoom create(Reservation reservation, Member participant1, Member participant2, boolean active) {
        ChatRoom room = new ChatRoom();
        room.reservation = reservation;
        room.participant1 = participant1;
        room.participant2 = participant2;
        room.active = active;
        return room;
    }

    public Long getReservationId() {
        return reservation.getId();
    }

    public Long getParticipant1Id() {
        return participant1.getId();
    }

    public Long getParticipant2Id() {
        return participant2.getId();
    }

    public boolean hasParticipant(Long memberId) {
        return getParticipant1Id().equals(memberId) || getParticipant2Id().equals(memberId);
    }

    public Long getOpponentId(Long memberId) {
        if (getParticipant1Id().equals(memberId)) {
            return getParticipant2Id();
        }
        if (getParticipant2Id().equals(memberId)) {
            return getParticipant1Id();
        }
        throw new IllegalStateException("채팅방 참여자가 아닙니다.");
    }

    public void touchLastMessageAt(LocalDateTime sentAt) {
        this.lastMessageAt = sentAt;
    }

    public void deactivate() {
        this.active = false;
    }
}
