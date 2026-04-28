package com.eduvault.eduvault.service;

import com.eduvault.eduvault.dto.AnalyticsPointResponse;
import com.eduvault.eduvault.dto.DashboardOverviewResponse;
import com.eduvault.eduvault.repository.DownloadRepository;
import com.eduvault.eduvault.repository.ResourceRepository;
import com.eduvault.eduvault.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardAnalyticsService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    private final DownloadRepository downloadRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;

    public DashboardAnalyticsService(DownloadRepository downloadRepository,
                                     UserRepository userRepository,
                                     ResourceRepository resourceRepository) {
        this.downloadRepository = downloadRepository;
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
    }

    public DashboardOverviewResponse getOverview() {
        return new DashboardOverviewResponse(
                userRepository.count(),
                downloadRepository.count(),
                resourceRepository.count()
        );
    }

    public List<AnalyticsPointResponse> getDownloadsTrend() {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(6);

        Map<LocalDate, Long> downloadsByDate = new LinkedHashMap<>();
        for (LocalDate date = startDate; !date.isAfter(today); date = date.plusDays(1)) {
            downloadsByDate.put(date, 0L);
        }

        downloadRepository.findAll().forEach(download -> {
            LocalDate date = download.getDownloadedAt().toLocalDate();
            if (!date.isBefore(startDate) && !date.isAfter(today)) {
                downloadsByDate.computeIfPresent(date, (key, count) -> count + 1);
            }
        });

        return downloadsByDate.entrySet().stream()
                .map(entry -> new AnalyticsPointResponse(entry.getKey().format(DATE_FORMATTER), entry.getValue()))
                .toList();
    }
}
