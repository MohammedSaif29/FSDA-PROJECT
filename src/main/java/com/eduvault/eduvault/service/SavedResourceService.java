package com.eduvault.eduvault.service;

import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.SavedResource;
import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.repository.SavedResourceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SavedResourceService {

    private final SavedResourceRepository savedResourceRepository;

    public SavedResourceService(SavedResourceRepository savedResourceRepository) {
        this.savedResourceRepository = savedResourceRepository;
    }

    public SavedResource save(User user, Resource resource) {
        return savedResourceRepository.findByUserAndResourceId(user, resource.getId())
                .orElseGet(() -> {
                    SavedResource savedResource = new SavedResource();
                    savedResource.setUser(user);
                    savedResource.setResource(resource);
                    savedResource.setSavedAt(LocalDateTime.now());
                    return savedResourceRepository.save(savedResource);
                });
    }

    public List<SavedResource> getSavedResources(User user) {
        return savedResourceRepository.findByUserOrderBySavedAtDesc(user);
    }

    public long countSavedResources(User user) {
        return savedResourceRepository.countByUser(user);
    }
}
