package com.eduvault.eduvault.repository;

import com.eduvault.eduvault.model.ResourceView;
import com.eduvault.eduvault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ResourceViewRepository extends JpaRepository<ResourceView, Long> {
    List<ResourceView> findByUserOrderByViewedAtDesc(User user);
    long countByUser(User user);
    void deleteByUser(User user);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM ResourceView r WHERE r.resource.id = :resourceId")
    void deleteByResourceId(@Param("resourceId") Long resourceId);
}
