package com.eduvault.eduvault.dto;

public record DashboardOverviewResponse(
        long totalUsers,
        long totalDownloads,
        long totalResources
) {
}
