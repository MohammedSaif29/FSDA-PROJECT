package com.eduvault.eduvault.dto;

public record ActivityFeedResponse(
        Long id,
        String userName,
        String action,
        String resourceTitle,
        String category,
        String activityTime
) {
}
