package com.wedge.backend.domain.chat.repository;

import com.wedge.backend.domain.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findByReservation_Id(Long reservationId);
}
