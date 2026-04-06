package com.eduvault.eduvault.service;

import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.repository.DownloadRepository;
import com.eduvault.eduvault.repository.FeedbackRepository;
import com.eduvault.eduvault.repository.ResourceRepository;
import com.eduvault.eduvault.repository.ResourceViewRepository;
import com.eduvault.eduvault.repository.SavedResourceRepository;
import com.eduvault.eduvault.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SavedResourceRepository savedResourceRepository;

    @Autowired
    private DownloadRepository downloadRepository;

    @Autowired
    private ResourceViewRepository resourceViewRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Value("${app.admin.emails:admin@eduvault.com,admin@gmail.com}")
    private String adminEmailsConfig;

    public User registerUser(String username, String email, String password) {
        return registerUser(username, email, password, User.Role.USER);
    }

    public User registerUser(String username, String email, String password, User.Role role) {
        if (userRepository.existsByUsername(username) || userRepository.existsByEmail(email)) {
            throw new RuntimeException("Username or email already exists");
        }
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role == null || role == User.Role.STUDENT ? User.Role.USER : role);
        user.setAuthProvider(User.AuthProvider.LOCAL);
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public Optional<User> upsertGoogleUser(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Google account email is required");
        }

        String googleId = oauth2User.getName();
        String fullName = oauth2User.getAttribute("name");
        String avatarUrl = oauth2User.getAttribute("picture");
        String preferredUsername = deriveUsername(email, fullName);

        User user = findByEmail(email)
                .or(() -> userRepository.findByUsername(preferredUsername))
                .orElseGet(User::new);

        if (user.getId() == null) {
            user.setCreatedAt(LocalDateTime.now());
            user.setRole(resolveRoleForEmail(email));
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        } else if (isAdminEmail(email)) {
            user.setRole(User.Role.ADMIN);
        } else if (user.getRole() == null) {
            user.setRole(User.Role.USER);
        }

        user.setEmail(email);
        user.setUsername(resolveUniqueUsername(user, preferredUsername));
        user.setGoogleId(googleId);
        user.setFullName(fullName);
        user.setAvatarUrl(avatarUrl);
        user.setAuthProvider(User.AuthProvider.GOOGLE);

        return Optional.of(userRepository.save(user));
    }

    public Optional<User> findByIdentifier(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            return Optional.empty();
        }

        return findByUsername(identifier.trim())
                .or(() -> findByEmail(identifier.trim()));
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserRole(Long id, User.Role role) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role == null || role == User.Role.STUDENT ? User.Role.USER : role);
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        savedResourceRepository.deleteByUser(user);
        downloadRepository.deleteByUser(user);
        resourceViewRepository.deleteByUser(user);
        feedbackRepository.deleteByUser(user);

        for (Resource resource : resourceRepository.findByUploadedBy(user)) {
            savedResourceRepository.deleteByResourceId(resource.getId());
            downloadRepository.deleteByResourceId(resource.getId());
            resourceViewRepository.deleteByResourceId(resource.getId());
            feedbackRepository.deleteByResourceId(resource.getId());
            resourceRepository.delete(resource);
        }

        userRepository.delete(user);
    }

    private User.Role resolveRoleForEmail(String email) {
        return isAdminEmail(email) ? User.Role.ADMIN : User.Role.USER;
    }

    private boolean isAdminEmail(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }

        return getAdminEmails().contains(email.trim().toLowerCase());
    }

    private Set<String> getAdminEmails() {
        return Arrays.stream(adminEmailsConfig.split(","))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }

    private String deriveUsername(String email, String fullName) {
        if (fullName != null && !fullName.isBlank()) {
            String normalized = fullName.trim().toLowerCase()
                    .replaceAll("[^a-z0-9]+", ".")
                    .replaceAll("(^\\.|\\.$)", "");
            if (!normalized.isBlank()) {
                return normalized;
            }
        }

        return email.substring(0, email.indexOf('@'))
                .replaceAll("[^a-zA-Z0-9._-]", "")
                .toLowerCase();
    }

    private String resolveUniqueUsername(User existingUser, String candidate) {
        String base = (candidate == null || candidate.isBlank()) ? "user" : candidate;
        String normalizedBase = base.toLowerCase();
        String resolved = normalizedBase;
        int suffix = 1;

        while (userRepository.findByUsername(resolved)
                .filter(user -> !user.getId().equals(existingUser.getId()))
                .isPresent()) {
            resolved = normalizedBase + suffix++;
        }

        return resolved;
    }
}
