package com.eduvault.eduvault.dto;

public record StudentResourceActivityItem(
        Long id,
        Long resourceId,
        String title,
        String author,
        String category,
        String imageUrl,
        String type,
        String timestamp
) {
}
