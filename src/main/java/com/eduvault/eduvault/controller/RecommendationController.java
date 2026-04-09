package com.eduvault.eduvault.controller;

import com.eduvault.eduvault.dto.RecommendationResponse;
import com.eduvault.eduvault.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<RecommendationResponse>> getRecommendations(@PathVariable Long userId) {
        return ResponseEntity.ok(recommendationService.getRecommendations(userId));
    }
}
