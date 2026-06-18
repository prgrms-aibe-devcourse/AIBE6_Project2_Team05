package com.wedge.backend.domain.chat.exception;

public class ChatForbiddenException extends RuntimeException {

    public ChatForbiddenException(String message) {
        super(message);
    }
}
