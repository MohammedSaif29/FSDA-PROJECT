package com.eduvault.eduvault.repository;

import com.eduvault.eduvault.model.Download;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DownloadRepository extends JpaRepository<Download, Long> {
    List<Download> findByUser(User user);
    List<Download> findByUserOrderByDownloadedAtDesc(User user);
    List<Download> findTop8ByOrderByDownloadedAtDesc();
    List<Download> findTop10ByOrderByDownloadedAtDesc();
    long countByUser(User user);
}
