package com.eduvault.eduvault.service;

import com.eduvault.eduvault.model.Feedback;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ResourceService resourceService;

    public Feedback addFeedback(User user, Resource resource, Integer rating, String comment) {
        Optional<Feedback> existing = feedbackRepository.findByUserAndResource(user, resource);
        Feedback feedback;
        if (existing.isPresent()) {
            feedback = existing.get();
            feedback.setRating(rating);
            feedback.setComment(comment);
        } else {
            feedback = new Feedback();
            feedback.setUser(user);
            feedback.setResource(resource);
            feedback.setRating(rating);
            feedback.setComment(comment);
            feedback.setCreatedAt(LocalDateTime.now());
        }
        feedbackRepository.save(feedback);
        updateResourceRating(resource);
        return feedback;
    }

    private void updateResourceRating(Resource resource) {
        List<Feedback> feedbacks = feedbackRepository.findByResource(resource);
        double average = feedbacks.stream().mapToInt(Feedback::getRating).average().orElse(0.0);
        resource.setRating(average);
        resourceService.updateRating(resource); // This will save it
    }

    public List<Feedback> getResourceFeedback(Resource resource) {
        return feedbackRepository.findByResource(resource);
    }
}