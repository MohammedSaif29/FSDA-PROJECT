package com.eduvault.eduvault.controller;

import com.eduvault.eduvault.dto.ActivityFeedResponse;
import com.eduvault.eduvault.service.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping("/api/activity")
    public ResponseEntity<List<ActivityFeedResponse>> getActivityFeed() {
        return ResponseEntity.ok(activityService.getRecentActivity());
    }
}
