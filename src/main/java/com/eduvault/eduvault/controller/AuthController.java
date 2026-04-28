package com.eduvault.eduvault.controller;

import com.eduvault.eduvault.config.JwtUtil;
import com.eduvault.eduvault.dto.AuthResponse;
import com.eduvault.eduvault.dto.LoginRequest;
import com.eduvault.eduvault.dto.RegisterRequest;
import com.eduvault.eduvault.dto.UserProfileResponse;
import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret:}")
    private String googleClientSecret;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user;
            if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
                user = userService.registerUser(
                        request.getUsername(),
                        request.getEmail(),
                        request.getPassword(),
                        User.Role.valueOf(request.getRole().toUpperCase().trim())
                );
            } else {
                user = userService.registerUser(
                        request.getUsername(),
                        request.getEmail(),
                        request.getPassword()
                );
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(buildAuthResponse(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String loginId = request.getIdentifier();
        return userService.findByIdentifier(loginId)
                .map(user -> {
                    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                                .body(Map.of("error", "Invalid username/email or password"));
                    }

                    return ResponseEntity.ok(buildAuthResponse(user));
                }).orElseGet(() -> {
                    return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                            .body(Map.of("error", "Invalid username/email or password"));
                });
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().toSecurityRole(),
                user.getAuthProvider().name(),
                user.getFullName(),
                user.getAvatarUrl()
        ));
    }

    @GetMapping("/google/status")
    public ResponseEntity<Map<String, Object>> getGoogleStatus() {
        boolean configured = isRealGoogleOauthValue(googleClientId)
                && isRealGoogleOauthValue(googleClientSecret);

        return ResponseEntity.ok(Map.of(
                "configured", configured,
                "authorizationUrl", configured ? "/oauth2/authorization/google" : "",
                "message", configured
                        ? "Google authentication is configured."
                        : "Google authentication is not configured on the backend."
        ));
    }

    private boolean isRealGoogleOauthValue(String value) {
        if (value == null) {
            return false;
        }

        String normalized = value.trim();
        if (normalized.isBlank()) {
            return false;
        }

        String lowerCaseValue = normalized.toLowerCase();
        return !lowerCaseValue.contains("your-google-client-id")
                && !lowerCaseValue.contains("your_full_secret_here")
                && !lowerCaseValue.contains("your-google-client-secret")
                && !lowerCaseValue.contains("replace-me");
    }

    private AuthResponse buildAuthResponse(User user) {
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole().toSecurityRole())
                .build();

        return new AuthResponse(
                jwtUtil.generateToken(userDetails),
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().toSecurityRole()
        );
    }
}
