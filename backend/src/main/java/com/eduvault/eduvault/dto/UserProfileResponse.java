package com.eduvault.eduvault.dto;

public record UserProfileResponse(
        Long id,
        String username,
        String email,
        String role,
        String authProvider,
        String fullName,
        String avatarUrl
) {
}
