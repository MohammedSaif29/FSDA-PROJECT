package com.eduvault.eduvault.repository;

import com.eduvault.eduvault.model.Download;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DownloadRepository extends JpaRepository<Download, Long> {
    List<Download> findByUser(User user);
    boolean existsByUserAndResource(User user, Resource resource);
}