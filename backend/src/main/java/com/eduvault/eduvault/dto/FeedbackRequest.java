package com.eduvault.eduvault.dto;

import lombok.Data;

@Data
public class FeedbackRequest {
    private Long resourceId;
    private Integer rating;
    private String comment;
}