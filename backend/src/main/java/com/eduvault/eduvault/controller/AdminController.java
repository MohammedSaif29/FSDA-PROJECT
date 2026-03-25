package com.eduvault.eduvault.controller;

import com.eduvault.eduvault.dto.AdminStatsResponse;
import com.eduvault.eduvault.dto.AdminSavedResourceResponse;
import com.eduvault.eduvault.dto.CategoryStatResponse;
import com.eduvault.eduvault.dto.DownloadsTrendPoint;
import com.eduvault.eduvault.dto.RecentActivityResponse;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.service.AdminAnalyticsService;
import com.eduvault.eduvault.service.AdminSavedResourceService;
import com.eduvault.eduvault.service.ResourceService;
import com.eduvault.eduvault.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private AdminAnalyticsService adminAnalyticsService;

    @Autowired
    private UserService userService;

    @Autowired
    private AdminSavedResourceService adminSavedResourceService;

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

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
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
}
