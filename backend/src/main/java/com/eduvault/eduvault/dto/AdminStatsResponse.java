package com.eduvault.eduvault.dto;

public record AdminStatsResponse(
        long totalUsers,
        long totalResources,
        long totalDownloads,
        long activeUsers
) {
}
