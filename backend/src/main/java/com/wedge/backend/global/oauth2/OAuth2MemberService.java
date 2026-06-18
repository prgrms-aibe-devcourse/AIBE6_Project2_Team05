package com.wedge.backend.global.oauth2;

import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.member.entity.Provider;
import com.wedge.backend.domain.member.entity.Role;
import com.wedge.backend.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OAuth2MemberService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauthUser = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oauthUser.getAttributes();

        String providerId;
        String email;
        String name;
        Provider provider;

        if ("google".equals(registrationId)) {
            providerId = (String) attributes.get("sub");
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
            provider = Provider.GOOGLE;
        } else if ("kakao".equals(registrationId)) {
            providerId = String.valueOf(attributes.get("id"));
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            Map<String, Object> profile = kakaoAccount == null
                    ? null
                    : (Map<String, Object>) kakaoAccount.get("profile");

            name = profile != null ? (String) profile.get("nickname") : null;
            email = kakaoAccount != null ? (String) kakaoAccount.get("email") : null;

            if (name == null || name.isBlank()) {
                Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
                name = properties != null ? (String) properties.get("nickname") : null;
            }
            provider = Provider.KAKAO;
        } else {
            throw new OAuth2AuthenticationException("지원하지 않는 소셜 로그인입니다.");
        }

        final String resolvedEmail = email;
        final String resolvedName = name;

        var existing = memberRepository.findByProviderAndProviderId(provider, providerId);
        boolean isNew = existing.isEmpty();

        Member member = existing.orElseGet(() -> memberRepository.save(
                Member.builder()
                        .email(resolvedEmail)
                        .name(resolvedName)
                        .role(Role.CLIENT)
                        .provider(provider)
                        .providerId(providerId)
                        .build()
        ));

        return new MemberPrincipal(member, attributes, isNew);
    }
}
