package com.eduvault.eduvault.repository;

import com.eduvault.eduvault.model.ResourceView;
import com.eduvault.eduvault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResourceViewRepository extends JpaRepository<ResourceView, Long> {
    List<ResourceView> findByUserOrderByViewedAtDesc(User user);
    long countByUser(User user);
}
