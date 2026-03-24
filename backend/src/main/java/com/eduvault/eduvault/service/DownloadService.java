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
        if (!downloadRepository.existsByUserAndResource(user, resource)) {
            Download download = new Download();
            download.setUser(user);
            download.setResource(resource);
            download.setDownloadedAt(LocalDateTime.now());
            downloadRepository.save(download);
            resourceService.incrementDownloadCount(resource);
        }
        return null; // or return the download if needed
    }

    public List<Download> getUserDownloads(User user) {
        return downloadRepository.findByUser(user);
    }
}