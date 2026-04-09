package com.eduvault.eduvault.controller;

import com.eduvault.eduvault.dto.FeedbackRequest;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.service.DownloadService;
import com.eduvault.eduvault.service.FileStorageService;
import com.eduvault.eduvault.service.FeedbackService;
import com.eduvault.eduvault.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {
    private static final Pattern NON_FILENAME_CHARS = Pattern.compile("[^a-zA-Z0-9._-]+");

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private DownloadService downloadService;

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<List<Resource>> getResources() {
        return ResponseEntity.ok(resourceService.getApprovedResources());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllApprovedResources());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Resource>> searchResources(@RequestParam String query) {
        return ResponseEntity.ok(resourceService.searchResources(query));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Resource>> filterResources(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type) {
        Resource.ResourceType resourceType = type != null ? Resource.ResourceType.valueOf(type.toUpperCase()) : null;
        return ResponseEntity.ok(resourceService.filterResources(category, resourceType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResource(@PathVariable Long id, Authentication authentication) {
        User user = authentication != null ? getUserFromAuthentication(authentication) : null;
        return ResponseEntity.ok(resourceService.getAccessibleResourceById(id, user));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResource(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "author", required = false) String author,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            Authentication authentication) {
        try {
            // Server-side validations
            final long MAX_RESOURCE_BYTES = 50L * 1024L * 1024L; // 50MB
            final long MAX_THUMBNAIL_BYTES = 5L * 1024L * 1024L; // 5MB
            final String resourceContentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase();
            if (!(resourceContentType.contains("pdf") || (file.getOriginalFilename() != null && file.getOriginalFilename().toLowerCase().endsWith(".pdf")))) {
                return ResponseEntity.badRequest().body(Map.of("error", "Resource file must be a PDF"));
            }
            if (file.getSize() > MAX_RESOURCE_BYTES) {
                return ResponseEntity.badRequest().body(Map.of("error", "Resource file is too large (max 50MB)"));
            }

            if (thumbnail != null && !thumbnail.isEmpty()) {
                String thumbType = thumbnail.getContentType() == null ? "" : thumbnail.getContentType().toLowerCase();
                if (!thumbType.startsWith("image/") && !(thumbnail.getOriginalFilename() != null && thumbnail.getOriginalFilename().toLowerCase().matches(".*\\.(jpe?g|png|webp)$"))) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Thumbnail must be an image (jpg, png, webp)"));
                }
                if (thumbnail.getSize() > MAX_THUMBNAIL_BYTES) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Thumbnail is too large (max 5MB)"));
                }
            }
            String username = authentication.getName();
            User uploadedBy = resourceService.getUserFromUsername(username);

            String fileUrl = fileStorageService.store(file, "resources");
            String imageUrl = thumbnail != null && !thumbnail.isEmpty()
                    ? fileStorageService.store(thumbnail, "thumbnails")
                    : (fileStorageService.isImage(file) ? fileUrl : null);

            Resource.ResourceType resourceType = resolveResourceType(type, file);

                // detect content types and sizes
                Long fileSize = file.getSize();
                String fileMime = fileStorageService.detectContentType(fileUrl);
                Long imageSize = null;
                String imageMime = null;
                if (imageUrl != null) {
                // only detect if thumbnail was stored separately
                imageSize = (thumbnail != null && !thumbnail.isEmpty()) ? thumbnail.getSize() : null;
                imageMime = (imageUrl != null) ? fileStorageService.detectContentType(imageUrl) : null;
                }

                Resource resource = resourceService.createResource(title, description,
                    resourceType,
                    category,
                    (author == null || author.isBlank()) ? uploadedBy.getUsername() : author,
                    fileUrl,
                    imageUrl,
                    uploadedBy,
                    true,
                    0.0,
                    0,
                    java.time.LocalDateTime.now(),
                    fileSize,
                    fileMime,
                    imageSize,
                    imageMime);

            return ResponseEntity.status(HttpStatus.CREATED).body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadResource(@PathVariable Long id, Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            Resource resource = resourceService.getAccessibleResourceById(id, user);
            downloadService.recordDownload(user, resource);

            if (resource.getFileUrl() != null && resource.getFileUrl().matches("^https?://.*")) {
                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(URI.create(resource.getFileUrl()))
                        .build();
            }

            org.springframework.core.io.Resource fileResource = fileStorageService.loadAsResource(resource.getFileUrl());
            String contentType = fileStorageService.detectContentType(resource.getFileUrl());
            String fileName = buildDownloadFileName(resource);

            return ResponseEntity.ok()
                    .contentType(contentType == null ? MediaType.APPLICATION_OCTET_STREAM : MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName).build().toString())
                    .body(fileResource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<?> addFeedback(@PathVariable Long id, @RequestBody FeedbackRequest request,
                                         Authentication authentication) {
        try {
            Resource resource = resourceService.getResourceById(id);
            User user = getUserFromAuthentication(authentication);
            feedbackService.addFeedback(user, resource, request.getRating(), request.getComment());
            return ResponseEntity.ok(Map.of("message", "Feedback added successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/feedback")
    public ResponseEntity<?> getFeedback(@PathVariable Long id) {
        Resource resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(feedbackService.getResourceFeedback(resource));
    }

    private User getUserFromAuthentication(Authentication authentication) {
        String username = authentication.getName();
        return resourceService.getUserFromUsername(username);
    }

    private Resource.ResourceType resolveResourceType(String type, MultipartFile file) {
        if (type != null && !type.isBlank()) {
            return Resource.ResourceType.valueOf(type.toUpperCase(Locale.ENGLISH));
        }

        String originalName = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase(Locale.ENGLISH);
        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ENGLISH);

        if (contentType.contains("pdf") || originalName.endsWith(".pdf")) {
            return Resource.ResourceType.PAPER;
        }
        if (contentType.startsWith("image/")) {
            return Resource.ResourceType.GUIDE;
        }
        return Resource.ResourceType.TEXTBOOK;
    }

    private String buildDownloadFileName(Resource resource) {
        String extension = ".pdf";
        String fileUrl = resource.getFileUrl();

        if (fileUrl != null) {
            int extensionIndex = fileUrl.lastIndexOf('.');
            if (extensionIndex >= 0) {
                extension = fileUrl.substring(extensionIndex);
            }
        }

        String baseName = resource.getTitle() == null ? "resource" : resource.getTitle().trim().toLowerCase(Locale.ENGLISH);
        baseName = NON_FILENAME_CHARS.matcher(baseName).replaceAll("-").replaceAll("-{2,}", "-").replaceAll("(^-|-$)", "");

        if (baseName.isBlank()) {
            baseName = "resource";
        }

        return baseName + extension;
    }
}
