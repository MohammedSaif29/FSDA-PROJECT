package com.eduvault.eduvault.dto;

public record AdminSavedResourceResponse(
        Long resourceId,
        String title,
        String category,
        String type,
        String author,
        String imageUrl,
        long saveCount
) {
}
