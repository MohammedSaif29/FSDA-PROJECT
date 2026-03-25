package com.eduvault.eduvault.dto;

public record RecommendationResponse(
        Long id,
        String title,
        String category,
        String imageUrl,
        String author,
        int downloads,
        String reason
) {
}
