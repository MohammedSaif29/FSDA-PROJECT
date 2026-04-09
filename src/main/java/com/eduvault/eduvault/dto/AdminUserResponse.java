package com.eduvault.eduvault.dto;

import java.time.LocalDateTime;

public record AdminUserResponse(
        Long id,
        String username,
        String email,
        String role,
        String authProvider,
        String fullName,
        String avatarUrl,
        LocalDateTime createdAt
) {
}
