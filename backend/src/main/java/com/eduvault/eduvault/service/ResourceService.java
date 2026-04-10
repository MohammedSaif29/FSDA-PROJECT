package com.eduvault.eduvault.service;

import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.repository.ResourceRepository;
import com.eduvault.eduvault.repository.UserRepository;
import com.eduvault.eduvault.repository.DownloadRepository;
import com.eduvault.eduvault.repository.FeedbackRepository;
import com.eduvault.eduvault.repository.ResourceViewRepository;
import com.eduvault.eduvault.repository.SavedResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private SavedResourceRepository savedResourceRepository;

    @Autowired
    private DownloadRepository downloadRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ResourceViewRepository resourceViewRepository;

    public User getUserFromUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Resource createResource(String title, String description, Resource.ResourceType type,
                                   String category, String author, String fileUrl, String imageUrl, User uploadedBy) {
        return createResource(title, description, type, category, author, fileUrl, imageUrl, uploadedBy, false);
    }

    public Resource createResource(String title, String description, Resource.ResourceType type,
                                   String category, String author, String fileUrl, String imageUrl, User uploadedBy, boolean approved) {
        return createResource(title, description, type, category, author, fileUrl, imageUrl, uploadedBy, approved, 0.0, 0, LocalDateTime.now());
    }

    public Resource createResource(String title, String description, Resource.ResourceType type,
                                   String category, String author, String fileUrl, String imageUrl, User uploadedBy,
                                   boolean approved, Double rating, Integer downloadsCount, LocalDateTime createdAt) {
        return createResource(title, description, type, category, author, fileUrl, imageUrl, uploadedBy, approved, rating, downloadsCount, createdAt, null, null, null, null);
    }

    public Resource createResource(String title, String description, Resource.ResourceType type,
                                   String category, String author, String fileUrl, String imageUrl, User uploadedBy,
                                   boolean approved, Double rating, Integer downloadsCount, LocalDateTime createdAt,
                                   Long fileSize, String fileMime, Long imageSize, String imageMime) {
        Resource resource = new Resource();
        resource.setTitle(title);
        resource.setDescription(description);
        resource.setType(type);
        resource.setCategory(category);
        resource.setAuthor(author);
        resource.setFileUrl(fileUrl);
        resource.setImageUrl((imageUrl == null || imageUrl.isBlank()) ? null : imageUrl);
        resource.setFileSize(fileSize);
        resource.setFileMime(fileMime);
        resource.setImageSize(imageSize);
        resource.setImageMime(imageMime);
        // note: file/image metadata may be set by caller via setters if available
        resource.setUploadedBy(uploadedBy);
        resource.setCreatedAt(createdAt);
        resource.setApproved(approved);
        resource.setRating(rating);
        resource.setDownloadsCount(downloadsCount);
        return resourceRepository.save(resource);
    }

    public List<Resource> getApprovedResources() {
        return resourceRepository.findByApprovedTrueOrderByCreatedAtDesc();
    }

    public List<Resource> getAllApprovedResources() {
        return resourceRepository.findByApprovedTrueOrderByCreatedAtDesc();
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAllByOrderByCreatedAtDesc();
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

    public Resource getAccessibleResourceById(Long id, User user) {
        Resource resource = getResourceById(id);

        if (resource.getApproved() || (user != null && user.getRole() == User.Role.ADMIN)) {
            return resource;
        }

        throw new RuntimeException("Resource is not available");
    }

    public List<Resource> getLatestResearchPapers(int limit) {
        return resourceRepository.findByApprovedTrueOrderByCreatedAtDesc().stream()
                .filter(resource -> resource.getType() == Resource.ResourceType.PAPER)
                .limit(limit)
                .toList();
    }

    public Resource approveResource(Long id) {
        Resource resource = getResourceById(id);
        resource.setApproved(true);
        return resourceRepository.save(resource);
    }

    @Transactional
    public void deleteResource(Long id) {
        savedResourceRepository.deleteByResourceId(id);
        downloadRepository.deleteByResourceId(id);
        feedbackRepository.deleteByResourceId(id);
        resourceViewRepository.deleteByResourceId(id);
        resourceRepository.deleteById(id);
    }

    public Resource updateResourceMetadata(Long id, String title, String description, String category, String author, Resource.ResourceType type) {
        return updateResource(id, title, description, category, author, type, null, null, null, null, null, null, false);
    }

    public Resource updateResource(Long id,
                                   String title,
                                   String description,
                                   String category,
                                   String author,
                                   Resource.ResourceType type,
                                   String fileUrl,
                                   String imageUrl,
                                   Long fileSize,
                                   String fileMime,
                                   Long imageSize,
                                   String imageMime,
                                   boolean removeThumbnail) {
        Resource resource = getResourceById(id);
        resource.setTitle(title);
        resource.setDescription(description);
        resource.setCategory(category);
        resource.setAuthor(author);
        resource.setType(type);
        if (fileUrl != null) {
            resource.setFileUrl(fileUrl);
            resource.setFileSize(fileSize);
            resource.setFileMime(fileMime);
        }
        if (imageUrl != null) {
            resource.setImageUrl(imageUrl);
            resource.setImageSize(imageSize);
            resource.setImageMime(imageMime);
        }
        if (removeThumbnail) {
            resource.setImageUrl(null);
            resource.setImageSize(null);
            resource.setImageMime(null);
        }
        return resourceRepository.save(resource);
    }

    public void incrementDownloadCount(Resource resource) {
        resource.setDownloadsCount(resource.getDownloadsCount() + 1);
        resourceRepository.save(resource);
    }

    public void updateRating(Resource resource) {
    }
}
