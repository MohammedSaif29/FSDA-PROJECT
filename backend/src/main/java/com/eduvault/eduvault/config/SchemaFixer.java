package com.eduvault.eduvault.config;

import org.springframework.beans.factory.annotation.Value;
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
    private final boolean seedAdminAccount;
    private final String defaultAdminUsername;
    private final String defaultAdminEmail;
    private final String defaultAdminPassword;

    public SchemaFixer(JdbcTemplate jdbcTemplate,
                       PasswordEncoder passwordEncoder,
                       @Value("${app.seed-admin-account:false}") boolean seedAdminAccount,
                       @Value("${app.default-admin.username:admin}") String defaultAdminUsername,
                       @Value("${app.default-admin.email:admin@eduvault.com}") String defaultAdminEmail,
                       @Value("${app.default-admin.password:}") String defaultAdminPassword) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
        this.seedAdminAccount = seedAdminAccount;
        this.defaultAdminUsername = defaultAdminUsername;
        this.defaultAdminEmail = defaultAdminEmail;
        this.defaultAdminPassword = defaultAdminPassword;
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

        if (!seedAdminAccount || defaultAdminPassword == null || defaultAdminPassword.isBlank()) {
            return;
        }

        try {
            String passwordHash = passwordEncoder.encode(defaultAdminPassword);

            String insertSql = "INSERT INTO users (username, email, password, role, auth_provider, created_at) " +
                    "SELECT ?, ?, ?, 'ADMIN', 'LOCAL', NOW() " +
                    "FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = ? OR email = ?)";
            jdbcTemplate.update(insertSql, defaultAdminUsername, defaultAdminEmail, passwordHash, defaultAdminUsername, defaultAdminEmail);

            jdbcTemplate.update(
                    "UPDATE users SET email = ?, password = ?, role = 'ADMIN', auth_provider = 'LOCAL' " +
                            "WHERE username = ?",
                    defaultAdminEmail,
                    passwordHash,
                    defaultAdminUsername
            );

            logger.info("Ensured configured admin account {} exists with ADMIN privileges.", defaultAdminEmail);
        } catch (Exception e) {
            logger.warn("Could not ensure configured admin account: {}", e.getMessage());
        }
    }
}
