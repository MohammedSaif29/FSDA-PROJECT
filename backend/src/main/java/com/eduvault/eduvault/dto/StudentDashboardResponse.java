package com.eduvault.eduvault.dto;

public record StudentDashboardResponse(
        long downloadsCount,
        long savedResourcesCount,
        long recentlyViewedCount
) {
}
