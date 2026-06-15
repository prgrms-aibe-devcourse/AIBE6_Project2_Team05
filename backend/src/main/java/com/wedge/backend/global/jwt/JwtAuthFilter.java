package com.wedge.backend.global.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        // 헤더에서 토큰 추출
        String token = resolveToken(request); 

        if (token != null) {
            try {
                jwtUtil.validateTokenOrThrow(token);
                Long memberId = jwtUtil.getMemberId(token);
                String role = jwtUtil.getRole(token);

                // SecurityContext에 인증 정보 저장
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        memberId, null, List.of(new SimpleGrantedAuthority("ROLE_" + role))
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (io.jsonwebtoken.ExpiredJwtException e) {
                request.setAttribute("exception", "EXPIRED_TOKEN");
            } catch (io.jsonwebtoken.security.SignatureException e) {
                request.setAttribute("exception", "INVALID_SIGNATURE");
            } catch (io.jsonwebtoken.MalformedJwtException e) {
                request.setAttribute("exception", "MALFORMED_TOKEN");
            } catch (Exception e) {
                request.setAttribute("exception", "INVALID_TOKEN");
            }
        }

        filterChain.doFilter(request, response);
    }

    // Authorization: Bearer <token> 에서 토큰 파싱
    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}
