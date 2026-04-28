package com.eduvault.eduvault.service;

import com.eduvault.eduvault.dto.StudentActivityResponse;
import com.eduvault.eduvault.dto.StudentDashboardResponse;
import com.eduvault.eduvault.dto.StudentResourceActivityItem;
import com.eduvault.eduvault.model.Download;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.ResourceView;
import com.eduvault.eduvault.model.SavedResource;
import com.eduvault.eduvault.model.User;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class StudentDashboardService {

    private static final DateTimeFormatter ACTIVITY_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    private final DownloadService downloadService;
    private final ResourceViewService resourceViewService;
    private final SavedResourceService savedResourceService;
    private final UserService userService;

    public StudentDashboardService(DownloadService downloadService,
                                   ResourceViewService resourceViewService,
                                   SavedResourceService savedResourceService,
                                   UserService userService) {
        this.downloadService = downloadService;
        this.resourceViewService = resourceViewService;
        this.savedResourceService = savedResourceService;
        this.userService = userService;
    }

    public StudentDashboardResponse getDashboard(Long userId) {
        User user = getUser(userId);
        return new StudentDashboardResponse(
                downloadService.countDownloads(user),
                savedResourceService.countSavedResources(user),
                resourceViewService.countViews(user)
        );
    }

    public StudentActivityResponse getActivity(Long userId) {
        User user = getUser(userId);

        List<StudentResourceActivityItem> downloads = downloadService.getUserDownloads(user).stream()
                .map(this::toDownloadItem)
                .toList();

        List<StudentResourceActivityItem> viewed = resourceViewService.getUserViews(user).stream()
                .map(this::toViewItem)
                .toList();

        List<StudentResourceActivityItem> saved = savedResourceService.getSavedResources(user).stream()
                .map(this::toSavedItem)
                .toList();

        return new StudentActivityResponse(downloads, viewed, saved);
    }

    public List<Resource> getSavedResources(Long userId) {
        User user = getUser(userId);
        return savedResourceService.getSavedResources(user).stream()
                .map(SavedResource::getResource)
                .toList();
    }

    private User getUser(Long userId) {
        return userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private StudentResourceActivityItem toDownloadItem(Download download) {
        return new StudentResourceActivityItem(
                download.getId(),
                download.getResource().getId(),
                download.getResource().getTitle(),
                download.getResource().getAuthor(),
                download.getResource().getCategory(),
                download.getResource().getImageUrl(),
                download.getResource().getType().name(),
                download.getDownloadedAt().format(ACTIVITY_FORMATTER)
        );
    }

    private StudentResourceActivityItem toViewItem(ResourceView resourceView) {
        return new StudentResourceActivityItem(
                resourceView.getId(),
                resourceView.getResource().getId(),
                resourceView.getResource().getTitle(),
                resourceView.getResource().getAuthor(),
                resourceView.getResource().getCategory(),
                resourceView.getResource().getImageUrl(),
                resourceView.getResource().getType().name(),
                resourceView.getViewedAt().format(ACTIVITY_FORMATTER)
        );
    }

    private StudentResourceActivityItem toSavedItem(SavedResource savedResource) {
        return new StudentResourceActivityItem(
                savedResource.getId(),
                savedResource.getResource().getId(),
                savedResource.getResource().getTitle(),
                savedResource.getResource().getAuthor(),
                savedResource.getResource().getCategory(),
                savedResource.getResource().getImageUrl(),
                savedResource.getResource().getType().name(),
                savedResource.getSavedAt().format(ACTIVITY_FORMATTER)
        );
    }
}
