package com.eduvault.eduvault.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
@Data
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType type;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private Double rating = 0.0;

    @Column(nullable = false)
    private Integer downloadsCount = 0;

    private String fileUrl;

    private String imageUrl;

    // File metadata
    private Long fileSize;
    private String fileMime;

    private Long imageSize;
    private String imageMime;

    @ManyToOne
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Boolean approved = false;

    public enum ResourceType {
        TEXTBOOK, PAPER, GUIDE
    }
}