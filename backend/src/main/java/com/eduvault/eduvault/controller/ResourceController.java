package com.eduvault.eduvault.controller;

import com.eduvault.eduvault.dto.FeedbackRequest;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.service.DownloadService;
import com.eduvault.eduvault.service.FeedbackService;
import com.eduvault.eduvault.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private DownloadService downloadService;

    @Autowired
    private FeedbackService feedbackService;

    private final String uploadDir = "uploads/";

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
    public ResponseEntity<Resource> getResource(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @PostMapping
    public ResponseEntity<?> uploadResource(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("type") String type,
            @RequestParam("category") String category,
            @RequestParam("author") String author,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Authentication authentication) {

        try {
            String username = authentication.getName();
            User uploadedBy = resourceService.getUserFromUsername(username);

            String fileUrl = saveFile(file, "files");
            String imageUrl = image != null ? saveFile(image, "images") : null;

            Resource resource = resourceService.createResource(title, description,
                    Resource.ResourceType.valueOf(type.toUpperCase()), category, author,
                    fileUrl, imageUrl, uploadedBy);

            return ResponseEntity.ok(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/download")
    public ResponseEntity<?> downloadResource(@PathVariable Long id, Authentication authentication) {
        try {
            Resource resource = resourceService.getResourceById(id);
            User user = getUserFromAuthentication(authentication);
            downloadService.recordDownload(user, resource);
            return ResponseEntity.ok(Map.of("fileUrl", resource.getFileUrl()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
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

    private String saveFile(MultipartFile file, String subDir) throws Exception {
        Path uploadPath = Paths.get(uploadDir + subDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        return "/uploads/" + subDir + "/" + fileName;
    }

    private User getUserFromAuthentication(Authentication authentication) {
        String username = authentication.getName();
        return resourceService.getUserFromUsername(username);
    }
}
