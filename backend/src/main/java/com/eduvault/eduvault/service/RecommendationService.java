package com.eduvault.eduvault.service;

import com.eduvault.eduvault.dto.RecommendationResponse;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.repository.DownloadRepository;
import com.eduvault.eduvault.repository.ResourceRepository;
import com.eduvault.eduvault.repository.ResourceViewRepository;
import com.eduvault.eduvault.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final UserRepository userRepository;
    private final DownloadRepository downloadRepository;
    private final ResourceViewRepository resourceViewRepository;
    private final ResourceRepository resourceRepository;

    public RecommendationService(UserRepository userRepository,
                                 DownloadRepository downloadRepository,
                                 ResourceViewRepository resourceViewRepository,
                                 ResourceRepository resourceRepository) {
        this.userRepository = userRepository;
        this.downloadRepository = downloadRepository;
        this.resourceViewRepository = resourceViewRepository;
        this.resourceRepository = resourceRepository;
    }

    public List<RecommendationResponse> getRecommendations(Long userId) {
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        List<Resource> approvedResources = resourceRepository.findByApprovedTrueOrderByCreatedAtDesc();
        List<Resource> downloadedResources = downloadRepository.findAll().stream()
                .filter(download -> download.getUser().getId().equals(userId))
                .map(download -> download.getResource())
                .toList();

        List<Resource> viewedResources = resourceViewRepository.findAll().stream()
                .filter(view -> view.getUser().getId().equals(userId))
                .map(view -> view.getResource())
                .toList();

        Set<Long> downloadedIds = downloadedResources.stream()
                .map(Resource::getId)
                .collect(Collectors.toSet());

        String topCategory = java.util.stream.Stream.concat(downloadedResources.stream(), viewedResources.stream())
                .collect(Collectors.groupingBy(Resource::getCategory, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        if (topCategory == null) {
            return approvedResources.stream()
                    .sorted(Comparator.comparing(Resource::getDownloadsCount).reversed()
                            .thenComparing(Resource::getRating, Comparator.reverseOrder()))
                    .limit(8)
                    .map(resource -> toRecommendation(resource, "Trending among learners"))
                    .toList();
        }

        List<RecommendationResponse> sameCategory = approvedResources.stream()
                .filter(resource -> resource.getCategory().equalsIgnoreCase(topCategory))
                .filter(resource -> !downloadedIds.contains(resource.getId()))
                .sorted(Comparator.comparing(Resource::getDownloadsCount).reversed()
                        .thenComparing(Resource::getRating, Comparator.reverseOrder()))
                .limit(8)
                .map(resource -> toRecommendation(resource, "Because you viewed " + topCategory))
                .toList();

        if (!sameCategory.isEmpty()) {
            return sameCategory;
        }

        return approvedResources.stream()
                .filter(resource -> !downloadedIds.contains(resource.getId()))
                .sorted(Comparator.comparing(Resource::getDownloadsCount).reversed()
                        .thenComparing(Resource::getRating, Comparator.reverseOrder()))
                .limit(8)
                .map(resource -> toRecommendation(resource, "Because you viewed " + topCategory))
                .toList();
    }

    private RecommendationResponse toRecommendation(Resource resource, String reason) {
        return new RecommendationResponse(
                resource.getId(),
                resource.getTitle(),
                resource.getDescription(),
                resource.getCategory(),
                resource.getImageUrl(),
                resource.getAuthor(),
                resource.getType().name(),
                resource.getRating(),
                resource.getDownloadsCount(),
                reason
        );
    }
}
