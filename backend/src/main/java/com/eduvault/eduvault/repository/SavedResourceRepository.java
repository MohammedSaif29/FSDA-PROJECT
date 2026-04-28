package com.eduvault.eduvault.repository;

import com.eduvault.eduvault.model.SavedResource;
import com.eduvault.eduvault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface SavedResourceRepository extends JpaRepository<SavedResource, Long> {
    List<SavedResource> findByUserOrderBySavedAtDesc(User user);
    List<SavedResource> findAllByOrderBySavedAtDesc();
    long countByUser(User user);
    boolean existsByUserAndResourceId(User user, Long resourceId);
    Optional<SavedResource> findByUserAndResourceId(User user, Long resourceId);
    void deleteByUser(User user);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM SavedResource s WHERE s.resource.id = :resourceId")
    void deleteByResourceId(@Param("resourceId") Long resourceId);
}
