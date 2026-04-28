package com.eduvault.eduvault.repository;

import com.eduvault.eduvault.model.Download;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface DownloadRepository extends JpaRepository<Download, Long> {
    List<Download> findByUser(User user);
    List<Download> findByUserOrderByDownloadedAtDesc(User user);
    List<Download> findTop8ByOrderByDownloadedAtDesc();
    List<Download> findTop10ByOrderByDownloadedAtDesc();
    long countByUser(User user);
    Optional<Download> findTopByUserAndResourceOrderByDownloadedAtDesc(User user, Resource resource);
    void deleteByUser(User user);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Download d WHERE d.resource.id = :resourceId")
    void deleteByResourceId(@Param("resourceId") Long resourceId);
}
