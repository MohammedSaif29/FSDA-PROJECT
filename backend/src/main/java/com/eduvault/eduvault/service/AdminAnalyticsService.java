package com.eduvault.eduvault.service;

import com.eduvault.eduvault.dto.AdminStatsResponse;
import com.eduvault.eduvault.dto.CategoryStatResponse;
import com.eduvault.eduvault.dto.DownloadsTrendPoint;
import com.eduvault.eduvault.dto.RecentActivityResponse;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.repository.DownloadRepository;
import com.eduvault.eduvault.repository.ResourceRepository;
import com.eduvault.eduvault.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminAnalyticsService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter ACTIVITY_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final DownloadRepository downloadRepository;

    public AdminAnalyticsService(UserRepository userRepository,
                                 ResourceRepository resourceRepository,
                                 DownloadRepository downloadRepository) {
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
        this.downloadRepository = downloadRepository;
    }

    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long totalResources = resourceRepository.count();
        long totalDownloads = downloadRepository.count();
        LocalDate activeCutoff = LocalDate.now().minusDays(30);

        long activeUsers = downloadRepository.findAll().stream()
                .filter(download -> !download.getDownloadedAt().toLocalDate().isBefore(activeCutoff))
                .map(download -> download.getUser().getId())
                .distinct()
                .count();

        return new AdminStatsResponse(totalUsers, totalResources, totalDownloads, activeUsers);
    }

    public List<DownloadsTrendPoint> getDownloadsTrend() {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(6);

        Map<LocalDate, Long> countsByDay = new LinkedHashMap<>();
        for (LocalDate date = startDate; !date.isAfter(today); date = date.plusDays(1)) {
            countsByDay.put(date, 0L);
        }

        downloadRepository.findAll().forEach(download -> {
            LocalDate downloadDate = download.getDownloadedAt().toLocalDate();
            if (!downloadDate.isBefore(startDate) && !downloadDate.isAfter(today)) {
                countsByDay.computeIfPresent(downloadDate, (key, count) -> count + 1);
            }
        });

        return countsByDay.entrySet().stream()
                .map(entry -> new DownloadsTrendPoint(entry.getKey().format(DATE_FORMATTER), entry.getValue()))
                .toList();
    }

    public List<CategoryStatResponse> getCategoryStats() {
        return resourceRepository.findByApprovedTrue().stream()
                .collect(Collectors.groupingBy(Resource::getCategory, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> new CategoryStatResponse(entry.getKey(), entry.getValue()))
                .toList();
    }

    public List<RecentActivityResponse> getRecentActivity() {
        return downloadRepository.findTop8ByOrderByDownloadedAtDesc().stream()
                .map(download -> new RecentActivityResponse(
                        download.getId(),
                        download.getUser().getUsername(),
                        "downloaded",
                        download.getResource().getTitle(),
                        download.getDownloadedAt().format(ACTIVITY_FORMATTER)
                ))
                .toList();
    }
}
