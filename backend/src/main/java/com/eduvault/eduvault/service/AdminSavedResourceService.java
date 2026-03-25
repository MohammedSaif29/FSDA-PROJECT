package com.eduvault.eduvault.service;

import com.eduvault.eduvault.dto.AdminSavedResourceResponse;
import com.eduvault.eduvault.model.SavedResource;
import com.eduvault.eduvault.repository.SavedResourceRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminSavedResourceService {

    private final SavedResourceRepository savedResourceRepository;

    public AdminSavedResourceService(SavedResourceRepository savedResourceRepository) {
        this.savedResourceRepository = savedResourceRepository;
    }

    public List<AdminSavedResourceResponse> getSavedResourceSummaries() {
        Map<Long, List<SavedResource>> grouped = savedResourceRepository.findAllByOrderBySavedAtDesc().stream()
                .collect(Collectors.groupingBy(savedResource -> savedResource.getResource().getId()));

        return grouped.values().stream()
                .map(savedResources -> {
                    SavedResource first = savedResources.get(0);
                    return new AdminSavedResourceResponse(
                            first.getResource().getId(),
                            first.getResource().getTitle(),
                            first.getResource().getCategory(),
                            first.getResource().getType().name(),
                            first.getResource().getAuthor(),
                            first.getResource().getImageUrl(),
                            savedResources.size()
                    );
                })
                .sorted(Comparator.comparingLong(AdminSavedResourceResponse::saveCount).reversed())
                .toList();
    }
}
