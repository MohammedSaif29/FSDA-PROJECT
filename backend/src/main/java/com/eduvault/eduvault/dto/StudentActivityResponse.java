package com.eduvault.eduvault.dto;

import java.util.List;

public record StudentActivityResponse(
        List<StudentResourceActivityItem> downloads,
        List<StudentResourceActivityItem> viewed,
        List<StudentResourceActivityItem> saved
) {
}
