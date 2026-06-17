package com.wedge.backend.domain.chatbot.controller;

import com.wedge.backend.domain.chatbot.dto.ChatRequest;
import com.wedge.backend.domain.chatbot.dto.ChatResponse;
import com.wedge.backend.domain.chatbot.service.EstimateChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final EstimateChatService estimateChatService;

    @PostMapping("/estimate")
    public ResponseEntity<ChatResponse> estimate(@RequestBody @Valid ChatRequest request) {
        return ResponseEntity.ok(estimateChatService.chat(request));
    }
}