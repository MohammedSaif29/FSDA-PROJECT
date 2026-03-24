package com.eduvault.eduvault.service;

import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.repository.ResourceRepository;
import com.eduvault.eduvault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    public User getUserFromUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Resource createResource(String title, String description, Resource.ResourceType type,
                                   String category, String author, String fileUrl, String imageUrl, User uploadedBy) {
        return createResource(title, description, type, category, author, fileUrl, imageUrl, uploadedBy, false);
    }

    public Resource createResource(String title, String description, Resource.ResourceType type,
                                   String category, String author, String fileUrl, String imageUrl, User uploadedBy, boolean approved) {
        Resource resource = new Resource();
        resource.setTitle(title);
        resource.setDescription(description);
        resource.setType(type);
        resource.setCategory(category);
        resource.setAuthor(author);
        resource.setFileUrl(fileUrl);
        resource.setImageUrl(imageUrl);
        resource.setUploadedBy(uploadedBy);
        resource.setCreatedAt(LocalDateTime.now());
        resource.setApproved(approved);
        return resourceRepository.save(resource);
    }

    public List<Resource> getApprovedResources() {
        return resourceRepository.findByApprovedTrue();
    }

    public List<Resource> getPendingResources() {
        return resourceRepository.findByApprovedFalse();
    }

    public List<Resource> searchResources(String query) {
        return resourceRepository.searchApprovedResources(query);
    }

    public List<Resource> filterResources(String category, Resource.ResourceType type) {
        if (category != null && type != null) {
            return resourceRepository.findByCategoryAndTypeAndApprovedTrue(category, type);
        } else if (category != null) {
            return resourceRepository.findByCategoryAndApprovedTrue(category);
        } else if (type != null) {
            return resourceRepository.findByTypeAndApprovedTrue(type);
        } else {
            return getApprovedResources();
        }
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id).orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    public Resource approveResource(Long id) {
        Resource resource = getResourceById(id);
        resource.setApproved(true);
        return resourceRepository.save(resource);
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }

    public void incrementDownloadCount(Resource resource) {
        resource.setDownloadsCount(resource.getDownloadsCount() + 1);
        resourceRepository.save(resource);
    }

    public void updateRating(Resource resource) {
        // This will be called after saving feedback
        // Rating is updated in FeedbackService
    }
}