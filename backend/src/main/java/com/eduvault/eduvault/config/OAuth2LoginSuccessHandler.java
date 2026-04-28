package com.eduvault.eduvault.config;

import com.eduvault.eduvault.dto.AuthResponse;
import com.eduvault.eduvault.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Value("${app.frontend.oauth-success-url}")
    private String frontendSuccessUrl;

    @Value("${app.frontend.login-url}")
    private String frontendLoginUrl;

    public OAuth2LoginSuccessHandler(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        org.springframework.security.core.Authentication authentication) throws IOException, ServletException {
        try {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            OAuth2User oauth2User = oauthToken.getPrincipal();

            AuthResponse authResponse = userService.upsertGoogleUser(oauth2User)
                    .map(this::buildSpringUser)
                    .map(userDetails -> {
                        String token = jwtUtil.generateToken(userDetails);
                        var user = userService.findByUsername(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("User missing after save"));
                        return new AuthResponse(
                                token,
                                user.getId(),
                                user.getUsername(),
                                user.getEmail(),
                                user.getRole().toSecurityRole()
                        );
                    })
                    .orElseThrow(() -> new IllegalStateException("Failed to map Google user"));

            String redirectUrl = UriComponentsBuilder.fromUriString(frontendSuccessUrl)
                    .queryParam("token", authResponse.token())
                    .queryParam("userId", authResponse.userId())
                    .queryParam("username", authResponse.username())
                    .queryParam("email", authResponse.email())
                    .queryParam("role", authResponse.role())
                    .build()
                    .toUriString();

            response.sendRedirect(redirectUrl);
        } catch (Exception e) {
            e.printStackTrace();
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.toString();
            String safeMsg = java.net.URLEncoder.encode("Save Error: " + errorMsg, "UTF-8");
            response.sendRedirect(frontendLoginUrl + "?oauthError=true&errorMsg=" + safeMsg);
        }
    }

    private UserDetails buildSpringUser(com.eduvault.eduvault.model.User user) {
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole().toSecurityRole())
                .build();
    }
}
