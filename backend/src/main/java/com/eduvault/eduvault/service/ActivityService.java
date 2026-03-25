package com.eduvault.eduvault.service;

import com.eduvault.eduvault.dto.ActivityFeedResponse;
import com.eduvault.eduvault.repository.DownloadRepository;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ActivityService {

    private static final DateTimeFormatter ACTIVITY_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

    private final DownloadRepository downloadRepository;

    public ActivityService(DownloadRepository downloadRepository) {
        this.downloadRepository = downloadRepository;
    }

    public List<ActivityFeedResponse> getRecentActivity() {
        return downloadRepository.findTop10ByOrderByDownloadedAtDesc().stream()
                .map(download -> new ActivityFeedResponse(
                        download.getId(),
                        download.getUser().getUsername(),
                        "downloaded",
                        download.getResource().getTitle(),
                        download.getResource().getCategory(),
                        download.getDownloadedAt().format(ACTIVITY_FORMATTER)
                ))
                .toList();
    }
}
