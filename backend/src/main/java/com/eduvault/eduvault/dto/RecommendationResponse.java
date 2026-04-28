package com.eduvault.eduvault.dto;

public record RecommendationResponse(
        Long id,
        String title,
        String description,
        String category,
        String imageUrl,
        String author,
        String type,
        double rating,
        int downloads,
        String reason
) {
}
