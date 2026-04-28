package com.eduvault.eduvault.controller;

import com.eduvault.eduvault.dto.AnalyticsPointResponse;
import com.eduvault.eduvault.dto.DashboardOverviewResponse;
import com.eduvault.eduvault.service.DashboardAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")

public class AnalyticsController {

    private final DashboardAnalyticsService dashboardAnalyticsService;

    public AnalyticsController(DashboardAnalyticsService dashboardAnalyticsService) {
        this.dashboardAnalyticsService = dashboardAnalyticsService;
    }

    @GetMapping("/downloads")
    public ResponseEntity<List<AnalyticsPointResponse>> getDownloadsAnalytics() {
        return ResponseEntity.ok(dashboardAnalyticsService.getDownloadsTrend());
    }

    @GetMapping("/overview")
    public ResponseEntity<DashboardOverviewResponse> getOverview() {
        return ResponseEntity.ok(dashboardAnalyticsService.getOverview());
    }
}
