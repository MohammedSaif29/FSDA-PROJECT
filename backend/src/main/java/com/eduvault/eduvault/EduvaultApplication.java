package com.eduvault.eduvault;

import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.repository.ResourceRepository;
import com.eduvault.eduvault.repository.UserRepository;
import com.eduvault.eduvault.service.ResourceService;
import com.eduvault.eduvault.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EduvaultApplication {

	public static void main(String[] args) {
		SpringApplication.run(EduvaultApplication.class, args);
	}

	@Bean
	public CommandLineRunner dataInitializer(UserService userService,
			ResourceService resourceService,
			ResourceRepository resourceRepository) {
		return args -> {
			if (userService.findByUsername("admin").isEmpty()) {
				userService.registerUser("admin", "admin@eduvault.com", "admin123", User.Role.ADMIN);
			}
			if (userService.findByUsername("user").isEmpty()) {
				userService.registerUser("user", "user@eduvault.com", "user123", User.Role.USER);
			}

			if (resourceRepository.count() == 0) {
				User admin = userService.findByUsername("admin").orElseThrow();
				resourceService.createResource(
					"Introduction to Quantum Physics",
					"A beginner-friendly introduction to quantum physics concepts.",
					Resource.ResourceType.TEXTBOOK,
					"Science",
					"Dr. Jane Smith",
					"https://www.example.com/dummy-quantum.pdf",
					"https://via.placeholder.com/640x360.png?text=Quantum+Physics",
					admin,
					true
				);
				resourceService.createResource(
					"Machine Learning in Healthcare",
					"A comprehensive guide on healthcare applications of machine learning.",
					Resource.ResourceType.PAPER,
					"Computer Science",
					"Dr. Anil Sharma",
					"https://www.example.com/dummy-ml-healthcare.pdf",
					"https://via.placeholder.com/640x360.png?text=Machine+Learning",
					admin,
					true
				);
				resourceService.createResource(
					"Advanced Calculus Guide",
					"Detailed coverage of advanced calculus topics for undergraduates.",
					Resource.ResourceType.GUIDE,
					"Mathematics",
					"Prof. Albert Newton",
					"https://www.example.com/dummy-calculus.pdf",
					"https://via.placeholder.com/640x360.png?text=Advanced+Calculus",
					admin,
					true
				);
			}
		};
	}
}