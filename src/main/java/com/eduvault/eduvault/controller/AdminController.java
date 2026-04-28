package com.eduvault.eduvault.controller;

import com.eduvault.eduvault.dto.AdminStatsResponse;
import com.eduvault.eduvault.dto.AdminSavedResourceResponse;
import com.eduvault.eduvault.dto.CategoryStatResponse;
import com.eduvault.eduvault.dto.DownloadsTrendPoint;
import com.eduvault.eduvault.dto.RecentActivityResponse;
import com.eduvault.eduvault.dto.AdminUserResponse;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.service.AdminAnalyticsService;
import com.eduvault.eduvault.service.AdminSavedResourceService;
import com.eduvault.eduvault.service.FileStorageService;
import com.eduvault.eduvault.service.ResourceService;
import com.eduvault.eduvault.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")

public class AdminController {

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private AdminAnalyticsService adminAnalyticsService;

    @Autowired
    private UserService userService;

    @Autowired
    private AdminSavedResourceService adminSavedResourceService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(adminAnalyticsService.getStats());
    }

    @GetMapping("/downloads-trend")
    public ResponseEntity<List<DownloadsTrendPoint>> getDownloadsTrend() {
        return ResponseEntity.ok(adminAnalyticsService.getDownloadsTrend());
    }

    @GetMapping("/category-stats")
    public ResponseEntity<List<CategoryStatResponse>> getCategoryStats() {
        return ResponseEntity.ok(adminAnalyticsService.getCategoryStats());
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<List<RecentActivityResponse>> getRecentActivity() {
        return ResponseEntity.ok(adminAnalyticsService.getRecentActivity());
    }

    @GetMapping("/saved-resources")
    public ResponseEntity<List<AdminSavedResourceResponse>> getSavedResources() {
        return ResponseEntity.ok(adminSavedResourceService.getSavedResourceSummaries());
    }

    @GetMapping("/pending-resources")
    public ResponseEntity<List<Resource>> getPendingResources() {
        return ResponseEntity.ok(resourceService.getPendingResources());
    }

    @GetMapping("/resources")
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @PostMapping("/resources/{id}/approve")
    public ResponseEntity<?> approveResource(@PathVariable Long id) {
        try {
            Resource resource = resourceService.approveResource(id);
            return ResponseEntity.ok(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<?> deleteResource(@PathVariable Long id) {
        try {
            resourceService.deleteResource(id);
            return ResponseEntity.ok(Map.of("message", "Resource deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping(value = "/resources/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateResource(@PathVariable Long id,
                                            @RequestParam("title") String title,
                                            @RequestParam("description") String description,
                                            @RequestParam("category") String category,
                                            @RequestParam("author") String author,
                                            @RequestParam("type") String type,
                                            @RequestParam(value = "file", required = false) MultipartFile file,
                                            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
                                            @RequestParam(value = "removeThumbnail", defaultValue = "false") boolean removeThumbnail) {
        try {
            String trimmedTitle = title.trim();
            String trimmedDescription = description.trim();
            String trimmedCategory = category.trim();
            String trimmedAuthor = author.trim();
            String typeValue = type.trim();

            if (trimmedTitle.isBlank() || trimmedDescription.isBlank() || trimmedCategory.isBlank() || trimmedAuthor.isBlank() || typeValue.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "All resource fields are required"));
            }

            String nextFileUrl = null;
            Long nextFileSize = null;
            String nextFileMime = null;
            if (file != null && !file.isEmpty()) {
                String resourceContentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ENGLISH);
                boolean isPdf = resourceContentType.contains("pdf")
                        || (file.getOriginalFilename() != null && file.getOriginalFilename().toLowerCase(Locale.ENGLISH).endsWith(".pdf"));
                if (!isPdf) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Resource file must be a PDF"));
                }
                nextFileUrl = fileStorageService.store(file, "resources");
                nextFileSize = file.getSize();
                nextFileMime = fileStorageService.detectContentType(nextFileUrl);
            }

            String nextImageUrl = null;
            Long nextImageSize = null;
            String nextImageMime = null;
            if (thumbnail != null && !thumbnail.isEmpty()) {
                String thumbnailType = thumbnail.getContentType() == null ? "" : thumbnail.getContentType().toLowerCase(Locale.ENGLISH);
                boolean isImage = thumbnailType.startsWith("image/")
                        || (thumbnail.getOriginalFilename() != null && thumbnail.getOriginalFilename().toLowerCase(Locale.ENGLISH).matches(".*\\.(jpe?g|png|webp)$"));
                if (!isImage) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Thumbnail must be an image (jpg, png, webp)"));
                }
                nextImageUrl = fileStorageService.store(thumbnail, "thumbnails");
                nextImageSize = thumbnail.getSize();
                nextImageMime = fileStorageService.detectContentType(nextImageUrl);
            }

            Resource.ResourceType resourceType = Resource.ResourceType.valueOf(typeValue.toUpperCase(Locale.ENGLISH));
            Resource resource = resourceService.updateResource(
                    id,
                    trimmedTitle,
                    trimmedDescription,
                    trimmedCategory,
                    trimmedAuthor,
                    resourceType,
                    nextFileUrl,
                    nextImageUrl,
                    nextFileSize,
                    nextFileMime,
                    nextImageSize,
                    nextImageMime,
                    removeThumbnail
            );
            return ResponseEntity.ok(resource);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid resource type"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers().stream().map(this::toAdminUserResponse).toList());
    }

    @PostMapping("/users/admin")
    public ResponseEntity<?> createAdminUser(@RequestBody Map<String, String> request) {
        try {
            String username = request.getOrDefault("username", "").trim();
            String email = request.getOrDefault("email", "").trim();
            String password = request.getOrDefault("password", "").trim();

            if (username.isBlank() || email.isBlank() || password.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username, email, and password are required"));
            }

            User user = userService.registerUser(username, email, password, User.Role.ADMIN);
            return ResponseEntity.ok(toAdminUserResponse(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String roleValue = request.getOrDefault("role", "").trim();
            if (roleValue.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Role is required"));
            }

            User.Role role = User.Role.valueOf(roleValue.toUpperCase(Locale.ENGLISH));
            User user = userService.updateUserRole(id, role);
            return ResponseEntity.ok(toAdminUserResponse(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid role"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private AdminUserResponse toAdminUserResponse(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().toSecurityRole(),
                user.getAuthProvider().name(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getCreatedAt()
        );
    }
}
