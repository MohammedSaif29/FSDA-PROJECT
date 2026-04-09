package com.eduvault.eduvault.dto;

public record RecentActivityResponse(
        Long id,
        String userName,
        String action,
        String resourceTitle,
        String activityTime
) {
}
