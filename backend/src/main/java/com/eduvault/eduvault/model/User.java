package com.eduvault.eduvault.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider authProvider = AuthProvider.LOCAL;

    @Column(unique = true)
    private String googleId;

    private String fullName;

    private String avatarUrl;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public enum Role {
        ADMIN, USER, STUDENT;

        public String toSecurityRole() {
            return this == STUDENT ? USER.name() : name();
        }
    }

    public enum AuthProvider {
        LOCAL, GOOGLE
    }
}
