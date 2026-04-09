package com.eduvault.eduvault.controller;

import com.eduvault.eduvault.dto.StudentActivityResponse;
import com.eduvault.eduvault.dto.StudentDashboardResponse;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.service.ResourceService;
import com.eduvault.eduvault.service.ResourceViewService;
import com.eduvault.eduvault.service.SavedResourceService;
import com.eduvault.eduvault.service.StudentDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentDashboardService studentDashboardService;
    private final ResourceService resourceService;
    private final ResourceViewService resourceViewService;
    private final SavedResourceService savedResourceService;

    public StudentController(StudentDashboardService studentDashboardService,
                             ResourceService resourceService,
                             ResourceViewService resourceViewService,
                             SavedResourceService savedResourceService) {
        this.studentDashboardService = studentDashboardService;
        this.resourceService = resourceService;
        this.resourceViewService = resourceViewService;
        this.savedResourceService = savedResourceService;
    }

    @GetMapping("/student/dashboard/{userId}")
    public ResponseEntity<StudentDashboardResponse> getStudentDashboard(@PathVariable Long userId) {
        return ResponseEntity.ok(studentDashboardService.getDashboard(userId));
    }

    @GetMapping("/user/activity/{userId}")
    public ResponseEntity<StudentActivityResponse> getStudentActivity(@PathVariable Long userId) {
        return ResponseEntity.ok(studentDashboardService.getActivity(userId));
    }

    @GetMapping("/user/saved/{userId}")
    public ResponseEntity<List<Resource>> getSavedResources(@PathVariable Long userId) {
        return ResponseEntity.ok(studentDashboardService.getSavedResources(userId));
    }

    @PostMapping("/view/{resourceId}")
    public ResponseEntity<?> recordView(@PathVariable Long resourceId, Authentication authentication) {
        try {
            User user = resourceService.getUserFromUsername(authentication.getName());
            Resource resource = resourceService.getResourceById(resourceId);
            resourceViewService.recordView(user, resource);
            return ResponseEntity.ok(Map.of("message", "View recorded"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/save/{resourceId}")
    public ResponseEntity<?> saveResource(@PathVariable Long resourceId, Authentication authentication) {
        try {
            User user = resourceService.getUserFromUsername(authentication.getName());
            Resource resource = resourceService.getResourceById(resourceId);
            savedResourceService.save(user, resource);
            return ResponseEntity.ok(Map.of("message", "Resource saved"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
