package com.eduvault.eduvault.repository;

import com.eduvault.eduvault.model.Feedback;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByResource(Resource resource);
    Optional<Feedback> findByUserAndResource(User user, Resource resource);
    void deleteByUser(User user);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Feedback f WHERE f.resource.id = :resourceId")
    void deleteByResourceId(@Param("resourceId") Long resourceId);
}
