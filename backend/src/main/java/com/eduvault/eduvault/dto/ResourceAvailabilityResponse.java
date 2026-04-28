package com.eduvault.eduvault.dto;

public record ResourceAvailabilityResponse(
        boolean downloadAvailable,
        boolean thumbnailAvailable
) {
}
