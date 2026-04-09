package com.eduvault.eduvault.service;

import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.ResourceView;
import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.repository.ResourceViewRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResourceViewService {

    private final ResourceViewRepository resourceViewRepository;

    public ResourceViewService(ResourceViewRepository resourceViewRepository) {
        this.resourceViewRepository = resourceViewRepository;
    }

    public ResourceView recordView(User user, Resource resource) {
        ResourceView resourceView = new ResourceView();
        resourceView.setUser(user);
        resourceView.setResource(resource);
        resourceView.setViewedAt(LocalDateTime.now());
        return resourceViewRepository.save(resourceView);
    }

    public List<ResourceView> getUserViews(User user) {
        return resourceViewRepository.findByUserOrderByViewedAtDesc(user);
    }

    public long countViews(User user) {
        return resourceViewRepository.countByUser(user);
    }
}
