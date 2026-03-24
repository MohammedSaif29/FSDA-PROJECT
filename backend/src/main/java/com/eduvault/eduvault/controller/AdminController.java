package com.eduvault.eduvault.controller;

import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
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
    private UserService userService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        long totalUsers = userService.getAllUsers().size();
        long totalResources = resourceService.getApprovedResources().size() + resourceService.getPendingResources().size();
        long pendingApprovals = resourceService.getPendingResources().size();
        long totalDownloads = resourceService.getApprovedResources().stream().mapToInt(Resource::getDownloadsCount).sum();

        return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "totalResources", totalResources,
                "pendingApprovals", pendingApprovals,
                "totalDownloads", totalDownloads
        ));
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