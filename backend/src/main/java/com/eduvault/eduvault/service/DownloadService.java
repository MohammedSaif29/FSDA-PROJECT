package com.eduvault.eduvault.service;

import com.eduvault.eduvault.model.Download;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.repository.DownloadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DownloadService {

    @Autowired
    private DownloadRepository downloadRepository;

    @Autowired
    private ResourceService resourceService;

    public Download recordDownload(User user, Resource resource) {
        Download download = downloadRepository.findTopByUserAndResourceOrderByDownloadedAtDesc(user, resource)
                .orElseGet(Download::new);
        download.setUser(user);
        download.setResource(resource);
        download.setDownloadedAt(LocalDateTime.now());
        Download savedDownload = downloadRepository.save(download);
        resourceService.incrementDownloadCount(resource);
        return savedDownload;
    }

    public List<Download> getUserDownloads(User user) {
        return downloadRepository.findByUserOrderByDownloadedAtDesc(user);
    }

    public long countDownloads(User user) {
        return downloadRepository.countByUser(user);
    }
}
