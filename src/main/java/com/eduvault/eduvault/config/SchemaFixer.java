package com.eduvault.eduvault.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class SchemaFixer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(SchemaFixer.class);
    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    public SchemaFixer(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL");
            logger.info("Fixed MySQL strict enum schema: users.role is now VARCHAR");
        } catch (Exception e) {
            logger.warn("Could not modify users.role: {}", e.getMessage());
        }
        
        try {
            jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN auth_provider VARCHAR(50) NOT NULL DEFAULT 'LOCAL'");
            logger.info("Fixed MySQL strict enum schema: users.auth_provider is now VARCHAR");
        } catch (Exception e) {}

        try {
            String passwordHash = passwordEncoder.encode("admin123");

            String insertSql = "INSERT INTO users (username, email, password, role, auth_provider, created_at) " +
                    "SELECT 'admin', 'admin@eduvault.com', ?, 'ADMIN', 'LOCAL', NOW() " +
                    "FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin' OR email = 'admin@eduvault.com')";
            jdbcTemplate.update(insertSql, passwordHash);

            jdbcTemplate.update(
                    "UPDATE users SET email = 'admin@eduvault.com', password = ?, role = 'ADMIN', auth_provider = 'LOCAL' " +
                            "WHERE username = 'admin'",
                    passwordHash
            );

            logger.info("Ensured canonical admin account admin@eduvault.com / admin123 exists with ADMIN privileges.");
        } catch (Exception e) {
            logger.warn("Could not promote demo admin: {}", e.getMessage());
        }
    }
}
