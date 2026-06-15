// 예비부부와 프리랜서의 예약 관리 REST API
package com.wedge.backend.domain.reservations.controller;

import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.service.MemberService;
import com.wedge.backend.domain.reservations.dto.ReservationCancelRequest;
import com.wedge.backend.domain.reservations.dto.ReservationCreateRequest;
import com.wedge.backend.domain.reservations.dto.ReservationResponse;
import com.wedge.backend.domain.reservations.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reservations")
@Tag(name = "예약 관리 (Reservation)", description = "예비부부와 프리랜서의 예약 요청·취소·수락·완료 등 상태 관리를 위한 API")
public class ReservationController {

    private final MemberService memberService;
    private final ReservationService reservationService;

    @PostMapping
    @Operation(summary = "예약 요청 생성", description = "로그인한 예비부부가 특정 프리랜서에게 예약을 생성(요청)합니다.")
    public ResponseEntity<ReservationResponse> createReservation(
            Authentication authentication,
            @RequestBody ReservationCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationService.createReservation(getAuthenticatedMember(authentication), request));
    }

    @GetMapping
    @Operation(summary = "예약 목록 조회", description = "로그인한 회원의 역할(예비부부 또는 프리랜서)에 맞는 전체 예약 목록을 조회합니다.")
    public ResponseEntity<List<ReservationResponse>> getReservations(
            Authentication authentication) {
        return ResponseEntity.ok(reservationService.getReservations(getAuthenticatedMember(authentication)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "예약 상세 조회", description = "특정 예약의 상세 정보를 조회합니다.")
    public ResponseEntity<ReservationResponse> getReservation(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(reservationService.getReservation(id, getAuthenticatedMember(authentication)));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "예약 취소", description = "로그인한 예비부부가 자신이 요청했던 예약을 취소합니다. 취소 사유를 선택적으로 입력할 수 있습니다.")
    public ResponseEntity<ReservationResponse> cancelReservation(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody(required = false) ReservationCancelRequest request) {
        String cancelReason = request == null ? null : request.getCancelReason();
        return ResponseEntity.ok(reservationService.cancelReservation(
                id,
                getAuthenticatedMember(authentication),
                cancelReason
        ));
    }


    @PatchMapping("/{id}/accept")
    @Operation(summary = "예약 수락", description = "로그인한 프리랜서가 자신에게 들어온 예약 요청을 수락합니다.")
    public ResponseEntity<ReservationResponse> acceptReservation(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(reservationService.acceptReservation(id, getAuthenticatedMember(authentication)));
    }


    @PatchMapping("/{id}/reject")
    @Operation(summary = "예약 거절", description = "로그인한 프리랜서가 자신에게 들어온 예약 요청을 거절합니다.")
    public ResponseEntity<ReservationResponse> rejectReservation(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(reservationService.rejectReservation(id, getAuthenticatedMember(authentication)));
    }


    @PatchMapping("/{id}/complete")
    @Operation(summary = "예약 완료 처리", description = "로그인한 프리랜서가 수락 및 진행 완료된 예약을 최종 완료 처리합니다.")
    public ResponseEntity<ReservationResponse> completeReservation(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(reservationService.completeReservation(id, getAuthenticatedMember(authentication)));
    }

    private Member getAuthenticatedMember(Authentication authentication) {
        return memberService.getMember((Long) authentication.getPrincipal());
    }
}
