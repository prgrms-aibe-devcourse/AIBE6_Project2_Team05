package com.wedge.backend.domain.chat.service;

import com.wedge.backend.domain.chat.entity.ChatRoom;
import com.wedge.backend.domain.chat.repository.ChatRoomRepository;
import com.wedge.backend.domain.reservations.entity.Reservation;
import com.wedge.backend.domain.reservations.entity.ReservationStatus;
import com.wedge.backend.domain.reservations.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ReservationRepository reservationRepository;

    @Transactional
    public ChatRoom createOrGetRoom(Long reservationId, Long currentMemberId) {
        Reservation reservation = findReservation(reservationId);
        validateReservationParticipant(reservation, currentMemberId);

        return chatRoomRepository.findByReservationId(reservationId)
                .orElseGet(() -> chatRoomRepository.save(ChatRoom.create(
                        reservation,
                        reservation.getClient(),
                        reservation.getFreelancerProfile().getMember(),
                        reservation.getStatus() != ReservationStatus.CANCELED
                )));
    }

    @Transactional(readOnly = true)
    public ChatRoom getRoom(Long roomId, Long currentMemberId) {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));
        validateRoomParticipant(room, currentMemberId);
        return room;
    }

    private Reservation findReservation(Long reservationId) {
        return reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));
    }

    private void validateReservationParticipant(Reservation reservation, Long memberId) {
        boolean isClient = reservation.getClient().getId().equals(memberId);
        boolean isFreelancer = reservation.getFreelancerProfile().getMember().getId().equals(memberId);
        if (!isClient && !isFreelancer) {
            throw new IllegalStateException("예약 참여자만 채팅방을 사용할 수 있습니다.");
        }
        if (reservation.getClient().getId().equals(reservation.getFreelancerProfile().getMember().getId())) {
            throw new IllegalArgumentException("본인과의 채팅은 생성할 수 없습니다.");
        }
    }

    private void validateRoomParticipant(ChatRoom room, Long memberId) {
        if (!room.hasParticipant(memberId)) {
            throw new IllegalStateException("채팅방 접근 권한이 없습니다.");
        }
    }
}
