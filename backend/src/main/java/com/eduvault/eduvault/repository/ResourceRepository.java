package com.eduvault.eduvault.repository;

import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByApprovedTrue();
    List<Resource> findByApprovedTrueOrderByCreatedAtDesc();
    List<Resource> findAllByOrderByCreatedAtDesc();
    List<Resource> findByApprovedFalse();
    List<Resource> findByUploadedBy(User uploadedBy);
    List<Resource> findByCategoryAndApprovedTrue(String category);
    List<Resource> findByTypeAndApprovedTrue(Resource.ResourceType type);
    List<Resource> findByCategoryAndTypeAndApprovedTrue(String category, Resource.ResourceType type);

    @Query("SELECT r FROM Resource r WHERE r.approved = true AND " +
           "(LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.author) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Resource> searchApprovedResources(@Param("query") String query);
}
