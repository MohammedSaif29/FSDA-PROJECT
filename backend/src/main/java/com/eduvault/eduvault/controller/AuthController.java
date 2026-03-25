package com.eduvault.eduvault.controller;

import com.eduvault.eduvault.config.JwtUtil;
import com.eduvault.eduvault.dto.LoginRequest;
import com.eduvault.eduvault.dto.RegisterRequest;
import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User.Role role = request.getRole() != null ? User.Role.valueOf(request.getRole().toUpperCase())
                    : User.Role.STUDENT;
            User user = userService.registerUser(request.getUsername(), request.getEmail(),
                    request.getPassword(), role);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", user.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("========== LOGIN DEBUG ==========");
        System.out.println("Attempting login with identification: " + request.getUsername());

        String loginId = request.getUsername().trim();
        return userService.findByUsername(loginId)
                .or(() -> userService.findByEmail(loginId))
                .map(user -> {
                    System.out.println("Stored hashed password: " + user.getPassword());
                    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        System.out.println("Password mismatch for user: " + user.getUsername());
                        return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                                .body(Map.of("error", "Invalid username/email or password"));
                    }

                    org.springframework.security.core.userdetails.UserDetails userDetails =
                            org.springframework.security.core.userdetails.User.builder()
                                    .username(user.getUsername())
                                    .password(user.getPassword())
                                    .roles(user.getRole().name())
                                    .build();

                    String token = jwtUtil.generateToken(userDetails);
                    Map<String, Object> response = new HashMap<>();
                    response.put("token", token);
                    response.put("userId", user.getId());
                    response.put("username", user.getUsername());
                    response.put("role", user.getRole().name());

                    return ResponseEntity.ok(response);
                }).orElseGet(() -> {
                    System.out.println("User not found for identifier: " + loginId);
                    return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                            .body(Map.of("error", "Invalid username/email or password"));
                });
    }
}
