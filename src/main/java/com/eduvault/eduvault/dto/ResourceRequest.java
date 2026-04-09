package com.eduvault.eduvault.dto;

import lombok.Data;

@Data
public class ResourceRequest {
    private String title;
    private String description;
    private String type;
    private String category;
    private String author;
}