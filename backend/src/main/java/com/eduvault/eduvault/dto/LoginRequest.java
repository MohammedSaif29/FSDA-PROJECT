package com.eduvault.eduvault.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String identifier;
    private String username;
    private String email;
    private String password;

    public String getIdentifier() {
        if (identifier != null && !identifier.isBlank()) {
            return identifier;
        }
        if (email != null && !email.isBlank()) {
            return email;
        }
        return username;
    }
}
