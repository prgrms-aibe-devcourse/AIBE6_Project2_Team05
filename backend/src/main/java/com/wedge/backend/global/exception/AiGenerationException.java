package com.wedge.backend.global.exception;

import org.springframework.http.HttpStatus;
import lombok.Getter;

@Getter
public class AiGenerationException extends RuntimeException {
    private final HttpStatus status;

    public AiGenerationException(String message) {
        super(message);
        this.status = HttpStatus.INTERNAL_SERVER_ERROR; // 기본값 500
    }

    public AiGenerationException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
}