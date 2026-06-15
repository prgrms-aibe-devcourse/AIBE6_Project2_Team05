package com.wedge.backend.global.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wedge.backend.global.exception.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        String exception = (String) request.getAttribute("exception");

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        HttpStatus status = HttpStatus.UNAUTHORIZED;
        String message = "인증에 실패했습니다.";

        if (exception != null) {
            switch (exception) {
                case "EXPIRED_TOKEN":
                    message = "만료된 JWT 토큰입니다.";
                    break;
                case "INVALID_SIGNATURE":
                    message = "유효하지 않은 JWT 서명입니다.";
                    break;
                case "MALFORMED_TOKEN":
                    message = "올바르지 않은 형식의 JWT 토큰입니다.";
                    break;
                case "INVALID_TOKEN":
                    message = "유효하지 않은 JWT 토큰입니다.";
                    break;
            }
        }

        response.setStatus(status.value());
        ErrorResponse errorResponse = new ErrorResponse(status.value(), message);
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
