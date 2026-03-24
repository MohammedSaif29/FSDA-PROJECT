package com.eduvault.eduvault.repository;

import com.eduvault.eduvault.model.Feedback;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByResource(Resource resource);
    Optional<Feedback> findByUserAndResource(User user, Resource resource);
}