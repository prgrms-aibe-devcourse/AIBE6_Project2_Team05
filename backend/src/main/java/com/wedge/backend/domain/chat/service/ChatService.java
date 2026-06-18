package com.wedge.backend.domain.chat.service;

import com.wedge.backend.domain.chat.dto.ChatMessageResponse;
import com.wedge.backend.domain.chat.dto.ChatOpponentResponse;
import com.wedge.backend.domain.chat.dto.ChatRoomResponse;
import com.wedge.backend.domain.chat.entity.ChatMessage;
import com.wedge.backend.domain.chat.entity.ChatRoom;
import com.wedge.backend.domain.chat.exception.ChatForbiddenException;
import com.wedge.backend.domain.chat.exception.ChatNotFoundException;
import com.wedge.backend.domain.chat.repository.ChatMessageRepository;
import com.wedge.backend.domain.chat.repository.ChatRoomRepository;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.repository.MemberRepository;
import com.wedge.backend.domain.reservations.entity.Reservation;
import com.wedge.backend.domain.reservations.entity.ReservationStatus;
import com.wedge.backend.domain.reservations.repository.ReservationRepository;
import com.wedge.backend.global.websocket.ChatOnlineStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatService {

    private static final int MAX_MESSAGE_LENGTH = 1000;

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ReservationRepository reservationRepository;
    private final MemberRepository memberRepository;
    private final ChatOnlineStatusService chatOnlineStatusService;


    @Transactional
    public ChatRoomResponse createOrGetRoom(Long reservationId, Long currentMemberId) {
        Reservation reservation = findReservation(reservationId);
        validateReservationParticipant(reservation, currentMemberId);

        // 예약 1건당 채팅방은 1개만 유지하므로, 기존 방이 있으면 재사용하고 없으면 생성
        ChatRoom room = chatRoomRepository.findByReservation_Id(reservationId)
                .orElseGet(() -> chatRoomRepository.save(ChatRoom.create(
                        reservation,
                        reservation.getClient(),
                        reservation.getFreelancerProfile().getMember(),
                        reservation.getStatus() != ReservationStatus.CANCELED
                )));

        return toRoomResponse(room, currentMemberId);
    }

    @Transactional(readOnly = true)
    public ChatRoomResponse getRoom(Long roomId, Long currentMemberId) {
        ChatRoom room = findRoom(roomId);
        validateParticipant(room, currentMemberId);
        return toRoomResponse(room, currentMemberId);
    }

    @Transactional(readOnly = true)
    public Page<ChatMessageResponse> getMessages(Long roomId, Long currentMemberId, int page, int size) {
        ChatRoom room = findRoom(roomId);
        validateParticipant(room, currentMemberId);

        // 채팅 내역은 오래된 메시지부터 순서대로 보여주기 위해 생성일과 id 기준으로 오름차순 정렬
        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.min(Math.max(size, 1), 100),
                Sort.by(Sort.Order.asc("createdAt"), Sort.Order.asc("id"))
        );

        return chatMessageRepository.findByRoom_Id(roomId, pageable)
                .map(ChatMessageResponse::from);
    }

    @Transactional
    public ChatMessageResponse sendMessage(Long roomId, Long senderId, String content) {
        ChatRoom room = findRoom(roomId);
        validateParticipant(room, senderId);
        validateActive(room);
        String normalizedContent = normalizeContent(content);

        Long receiverId = room.getOpponentId(senderId);
        Member sender = findMember(senderId);
        Member receiver = findMember(receiverId);
        ChatMessage message = ChatMessage.create(room, sender, receiver, normalizedContent);
        ChatMessage savedMessage = chatMessageRepository.save(message);

        // 채팅방 목록에서 최근 대화 순으로 정렬하기 위해 마지막 메시지 시간을 갱신
        room.touchLastMessageAt(savedMessage.getCreatedAt());

        return ChatMessageResponse.from(savedMessage);
    }

    @Transactional
    public void markRead(Long roomId, Long currentMemberId) {
        ChatRoom room = findRoom(roomId);
        validateParticipant(room, currentMemberId);
        LocalDateTime readAt = LocalDateTime.now();

        // 현재 사용자가 받은 메시지 중 아직 읽지 않은 메시지만 읽음 처리
        chatMessageRepository.findByRoom_IdAndReceiver_IdAndReadAtIsNull(roomId, currentMemberId)
                .forEach(message -> message.markRead(readAt));
    }

    @Transactional
    public void deactivateRoomByReservationId(Long reservationId) {
        chatRoomRepository.findByReservation_Id(reservationId)
                .ifPresent(ChatRoom::deactivate);
    }

    @Transactional(readOnly = true)
    public void validateRoomParticipant(Long roomId, Long currentMemberId) {
        ChatRoom room = findRoom(roomId);
        validateParticipant(room, currentMemberId);
    }

    @Transactional(readOnly = true)
    public Long getOpponentId(Long roomId, Long currentMemberId) {
        ChatRoom room = findRoom(roomId);
        validateParticipant(room, currentMemberId);
        return room.getOpponentId(currentMemberId);
    }

    private ChatRoomResponse toRoomResponse(ChatRoom room, Long currentMemberId) {
        Long opponentId = room.getOpponentId(currentMemberId);
        Member opponent = findMember(opponentId);

        ChatOpponentResponse opponentResponse = ChatOpponentResponse.from(
                opponent,
                chatOnlineStatusService.isOnline(opponentId)
        );
        return ChatRoomResponse.from(room, opponentResponse);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new ChatNotFoundException("회원을 찾을 수 없습니다."));
    }

    private Reservation findReservation(Long reservationId) {
        return reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ChatNotFoundException("예약을 찾을 수 없습니다."));
    }

    private ChatRoom findRoom(Long roomId) {
        return chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new ChatNotFoundException("채팅방을 찾을 수 없습니다."));
    }

    private void validateReservationParticipant(Reservation reservation, Long memberId) {
        boolean isClient = reservation.getClient().getId().equals(memberId);
        boolean isFreelancer = reservation.getFreelancerProfile().getMember().getId().equals(memberId);
        if (!isClient && !isFreelancer) {
            throw new ChatForbiddenException("예약 참여자만 채팅방을 사용할 수 있습니다.");
        }
        if (reservation.getClient().getId().equals(reservation.getFreelancerProfile().getMember().getId())) {
            throw new IllegalArgumentException("본인과의 채팅은 생성할 수 없습니다.");
        }
    }

    private void validateParticipant(ChatRoom room, Long memberId) {
        if (!room.hasParticipant(memberId)) {
            throw new ChatForbiddenException("채팅방 접근 권한이 없습니다.");
        }
    }

    private void validateActive(ChatRoom room) {
        Reservation reservation = findReservation(room.getReservationId());
        // 예약이 취소되었거나 채팅방이 비활성화된 경우 메시지 전송 차단
        if (!room.isActive() || reservation.getStatus() == ReservationStatus.CANCELED) {
            throw new IllegalStateException("취소된 예약은 더 이상 채팅할 수 없습니다.");
        }
    }

    private String normalizeContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("메시지를 입력해주세요.");
        }

        String normalizedContent = content.trim();
        if (normalizedContent.length() > MAX_MESSAGE_LENGTH) {
            throw new IllegalArgumentException("메시지는 1000자 이하로 입력해주세요.");
        }

        return normalizedContent;
    }
}
