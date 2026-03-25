package com.eduvault.eduvault.controller;

import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.service.DownloadService;
import com.eduvault.eduvault.service.ResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/download")
@CrossOrigin(origins = "*")
public class DownloadController {

    private final DownloadService downloadService;
    private final ResourceService resourceService;

    public DownloadController(DownloadService downloadService, ResourceService resourceService) {
        this.downloadService = downloadService;
        this.resourceService = resourceService;
    }

    @PostMapping("/{resourceId}")
    public ResponseEntity<?> download(@PathVariable Long resourceId, Authentication authentication) {
        try {
            User user = resourceService.getUserFromUsername(authentication.getName());
            Resource resource = resourceService.getResourceById(resourceId);
            downloadService.recordDownload(user, resource);
            return ResponseEntity.ok(Map.of("fileUrl", resource.getFileUrl()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
