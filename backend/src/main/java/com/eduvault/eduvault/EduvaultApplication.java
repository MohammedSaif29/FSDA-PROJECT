package com.eduvault.eduvault;

import com.eduvault.eduvault.model.Download;
import com.eduvault.eduvault.model.Resource;
import com.eduvault.eduvault.model.ResourceView;
import com.eduvault.eduvault.model.SavedResource;
import com.eduvault.eduvault.model.User;
import com.eduvault.eduvault.repository.DownloadRepository;
import com.eduvault.eduvault.repository.ResourceRepository;
import com.eduvault.eduvault.repository.ResourceViewRepository;
import com.eduvault.eduvault.repository.SavedResourceRepository;
import com.eduvault.eduvault.service.ResourceService;
import com.eduvault.eduvault.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class EduvaultApplication {

    public static void main(String[] args) {
        SpringApplication.run(EduvaultApplication.class, args);
    }

    @Bean
    public CommandLineRunner dataInitializer(UserService userService,
                                             ResourceService resourceService,
                                             ResourceRepository resourceRepository,
                                             DownloadRepository downloadRepository,
                                             ResourceViewRepository resourceViewRepository,
                                             SavedResourceRepository savedResourceRepository) {
        return args -> {
            User admin = ensureUser(userService, "admin", "admin@gmail.com", "admin123", User.Role.ADMIN);
            User user = ensureUser(userService, "user1", "user1@gmail.com", "user123", User.Role.STUDENT);
            User learnerOne = ensureUser(userService, "user2", "user2@gmail.com", "user123", User.Role.STUDENT);
            User learnerTwo = ensureUser(userService, "alice", "alice@eduvault.com", "alice123", User.Role.STUDENT);
            User learnerThree = ensureUser(userService, "nina", "nina@eduvault.com", "nina123", User.Role.STUDENT);
            User learnerFour = ensureUser(userService, "rahul", "rahul@eduvault.com", "rahul123", User.Role.STUDENT);

            if (resourceRepository.count() == 0) {
                List<Resource> seededResources = new ArrayList<>();
                List<User> uploaders = List.of(admin, user, learnerOne, learnerTwo);

                List<SeedResource> seeds = List.of(
                        new SeedResource("Quantum Mechanics Fundamentals", "A visual-first textbook covering wave functions, operators, and modern quantum intuition.", Resource.ResourceType.TEXTBOOK, "Physics", "Dr. Maya Srinivasan", 4.7, 126, 55),
                        new SeedResource("Physics Problem Solving Handbook", "Worked examples for mechanics, electromagnetism, optics, and thermal systems.", Resource.ResourceType.TEXTBOOK, "Physics", "Prof. Daniel Clarke", 4.5, 102, 48),
                        new SeedResource("Relativity for Curious Minds", "An accessible journey from special relativity to spacetime geometry and cosmology.", Resource.ResourceType.TEXTBOOK, "Physics", "Dr. Elena Brooks", 4.8, 144, 51),
                        new SeedResource("Foundations of Computer Science", "Core algorithms, computation models, and problem-solving patterns for modern engineers.", Resource.ResourceType.TEXTBOOK, "Computer Science", "Dr. Karan Mehta", 4.6, 188, 42),
                        new SeedResource("Operating Systems in Practice", "Process scheduling, memory, synchronization, file systems, and production-grade tradeoffs.", Resource.ResourceType.TEXTBOOK, "Computer Science", "Prof. Sarah Lim", 4.4, 165, 39),
                        new SeedResource("Machine Learning Blueprint", "A practitioner-friendly guide to supervised, unsupervised, and evaluation workflows.", Resource.ResourceType.TEXTBOOK, "ML", "Dr. Anil Sharma", 4.9, 220, 28),
                        new SeedResource("Deep Learning Systems", "Covers neural architectures, training stability, and real-world deployment constraints.", Resource.ResourceType.TEXTBOOK, "AI", "Prof. Tessa Lin", 4.8, 212, 24),
                        new SeedResource("Mathematics for Data Modeling", "Linear algebra, calculus, probability, and optimization for data-centric workflows.", Resource.ResourceType.TEXTBOOK, "Mathematics", "Dr. Albert Newton", 4.7, 174, 33),
                        new SeedResource("Abstract Algebra Essentials", "Groups, rings, fields, and structural reasoning presented with intuitive examples.", Resource.ResourceType.TEXTBOOK, "Mathematics", "Prof. Mira Bose", 4.3, 94, 46),
                        new SeedResource("Chemical Reactions and Thermodynamics", "A modern chemistry text on bonding, kinetics, equilibrium, and lab interpretation.", Resource.ResourceType.TEXTBOOK, "Chemistry", "Dr. Oliver Stone", 4.4, 117, 37),
                        new SeedResource("Organic Chemistry Visual Atlas", "Reaction maps, mechanism patterns, and structure-driven memory frameworks.", Resource.ResourceType.TEXTBOOK, "Chemistry", "Dr. Tara Gill", 4.5, 131, 29),
                        new SeedResource("Economics Through Case Studies", "Micro and macro principles explained through markets, policy, and global events.", Resource.ResourceType.TEXTBOOK, "Economics", "Prof. Liam Hart", 4.2, 88, 35),
                        new SeedResource("Behavioral Economics Playbook", "Biases, incentives, and decision science for product, policy, and education contexts.", Resource.ResourceType.TEXTBOOK, "Economics", "Dr. Sofia Reed", 4.6, 109, 21),
                        new SeedResource("AI Product Strategy", "How to scope, design, and ship AI-powered user experiences responsibly.", Resource.ResourceType.TEXTBOOK, "AI", "Meera Kapoor", 4.8, 196, 17),
                        new SeedResource("Modern Data Structures", "A clean, visual review of trees, heaps, graphs, hashing, and performance tradeoffs.", Resource.ResourceType.TEXTBOOK, "Computer Science", "Prof. Ethan Cole", 4.5, 158, 19),

                        new SeedResource("Transformer Models for Scientific Discovery", "Research paper on scaling attention-based models for simulation and experimentation.", Resource.ResourceType.PAPER, "AI", "Dr. Nikhil Rao", 4.9, 236, 6),
                        new SeedResource("Graph Learning in Molecular Chemistry", "Explores graph neural networks for reaction prediction and drug design.", Resource.ResourceType.PAPER, "Chemistry", "Dr. Aisha Patel", 4.7, 167, 5),
                        new SeedResource("Quantum Error Correction Benchmarks", "Benchmarking modern error-correction strategies for near-term quantum devices.", Resource.ResourceType.PAPER, "Physics", "Prof. Lena Hoffman", 4.6, 143, 9),
                        new SeedResource("Efficient Retrieval for Academic Search", "A paper on semantic retrieval pipelines for large scholarly corpora.", Resource.ResourceType.PAPER, "Computer Science", "Dr. Arjun Sen", 4.5, 155, 8),
                        new SeedResource("Adaptive Optimization in Deep Networks", "Evaluates optimizer behavior under sparse gradients and long-horizon training.", Resource.ResourceType.PAPER, "ML", "Dr. Wei Zhang", 4.8, 201, 7),
                        new SeedResource("Large Language Models in Education", "Investigates tutoring quality, reliability, and assessment design with LLMs.", Resource.ResourceType.PAPER, "AI", "Dr. Priya Menon", 4.9, 248, 4),
                        new SeedResource("Numerical Stability in PDE Solvers", "A paper on robust methods for stiff equations and scientific computing pipelines.", Resource.ResourceType.PAPER, "Mathematics", "Prof. Isaac Rowe", 4.3, 98, 11),
                        new SeedResource("Macroeconomic Forecasting with Hybrid Models", "Combines econometric priors and neural sequence models for policy forecasting.", Resource.ResourceType.PAPER, "Economics", "Dr. James Ford", 4.4, 112, 10),
                        new SeedResource("Human-Centered Explainable AI", "Design patterns for explanation systems that build confidence without overload.", Resource.ResourceType.PAPER, "AI", "Dr. Neha Kulkarni", 4.7, 179, 12),
                        new SeedResource("Causal Inference for Learning Analytics", "A paper on identifying instructional interventions with observational data.", Resource.ResourceType.PAPER, "ML", "Prof. Aaron Blake", 4.5, 136, 13),
                        new SeedResource("Secure Federated Learning at Scale", "Security and coordination strategies for cross-device collaborative training.", Resource.ResourceType.PAPER, "Computer Science", "Dr. Chen Wu", 4.6, 163, 14),
                        new SeedResource("Catalyst Design with Generative Models", "A research-first exploration of generative chemistry for catalyst discovery.", Resource.ResourceType.PAPER, "Chemistry", "Dr. Rhea Thomas", 4.8, 149, 15),
                        new SeedResource("Topological Materials Review", "Survey paper on electronic states, transport phenomena, and material design.", Resource.ResourceType.PAPER, "Physics", "Prof. Jonas Meyer", 4.4, 121, 16),
                        new SeedResource("Optimization Landscapes in Matrix Factorization", "Fresh insights into convergence geometry and regularization in matrix methods.", Resource.ResourceType.PAPER, "Mathematics", "Dr. Carla Vega", 4.2, 83, 18),
                        new SeedResource("AI Governance for Public Platforms", "Policy-facing analysis of model oversight, audits, and accountability patterns.", Resource.ResourceType.PAPER, "Economics", "Dr. Omar Yassin", 4.6, 140, 20)
                );

                for (int index = 0; index < seeds.size(); index++) {
                    SeedResource seed = seeds.get(index);
                    User uploader = uploaders.get(index % uploaders.size());
                    Resource resource = resourceService.createResource(
                            seed.title(),
                            seed.description(),
                            seed.type(),
                            seed.category(),
                            seed.author(),
                            "https://www.example.com/resources/" + slugify(seed.title()) + ".pdf",
                            null,
                            uploader,
                            true,
                            seed.rating(),
                            seed.downloadsCount(),
                            LocalDateTime.now().minusDays(seed.daysAgo())
                    );
                    seededResources.add(resource);
                }

                List<User> seededUsers = List.of(admin, user, learnerOne, learnerTwo, learnerThree, learnerFour);
                seedDownloadActivity(downloadRepository, seededUsers, seededResources);
                seedViewedActivity(resourceViewRepository, seededUsers, seededResources);
                seedSavedResources(savedResourceRepository, List.of(user, learnerOne, learnerTwo), seededResources);
            }
        };
    }

    private User ensureUser(UserService userService, String username, String email, String password, User.Role role) {
        return userService.findByUsername(username)
                .orElseGet(() -> userService.registerUser(username, email, password, role));
    }

    private void seedDownloadActivity(DownloadRepository downloadRepository, List<User> users, List<Resource> resources) {
        if (downloadRepository.count() > 0) {
            return;
        }

        for (int dayOffset = 0; dayOffset < 7; dayOffset++) {
            for (int index = 0; index < 4; index++) {
                Download download = new Download();
                download.setUser(users.get((dayOffset + index) % users.size()));
                download.setResource(resources.get((dayOffset * 3 + index) % resources.size()));
                download.setDownloadedAt(LocalDateTime.now().minusDays(dayOffset).minusHours(index * 2L));
                downloadRepository.save(download);
            }
        }
    }

    private void seedViewedActivity(ResourceViewRepository resourceViewRepository, List<User> users, List<Resource> resources) {
        if (resourceViewRepository.count() > 0) {
            return;
        }

        for (int index = 0; index < 18; index++) {
            ResourceView resourceView = new ResourceView();
            resourceView.setUser(users.get((index + 1) % users.size()));
            resourceView.setResource(resources.get((index * 2) % resources.size()));
            resourceView.setViewedAt(LocalDateTime.now().minusHours(index * 3L));
            resourceViewRepository.save(resourceView);
        }
    }

    private void seedSavedResources(SavedResourceRepository savedResourceRepository, List<User> users, List<Resource> resources) {
        if (savedResourceRepository.count() > 0) {
            return;
        }

        for (int index = 0; index < 9; index++) {
            SavedResource savedResource = new SavedResource();
            savedResource.setUser(users.get(index % users.size()));
            savedResource.setResource(resources.get((index * 3 + 1) % resources.size()));
            savedResource.setSavedAt(LocalDateTime.now().minusDays(index).minusHours(2));
            savedResourceRepository.save(savedResource);
        }
    }

    private String slugify(String value) {
        return value.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }

    private record SeedResource(
            String title,
            String description,
            Resource.ResourceType type,
            String category,
            String author,
            Double rating,
            Integer downloadsCount,
            long daysAgo
    ) {
    }
}
