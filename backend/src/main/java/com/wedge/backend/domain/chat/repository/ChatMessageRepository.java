package com.wedge.backend.domain.chat.repository;

import com.wedge.backend.domain.chat.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    Page<ChatMessage> findByRoom_Id(Long roomId, Pageable pageable);

    List<ChatMessage> findByRoom_IdAndReceiver_IdAndReadAtIsNull(Long roomId, Long receiverId);
}
