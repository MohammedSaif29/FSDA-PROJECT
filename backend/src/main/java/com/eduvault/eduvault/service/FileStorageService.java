package com.eduvault.eduvault.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.Normalizer;
import java.util.Locale;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadRoot;

    public FileStorageService(@Value("${app.upload.dir}") String uploadDir) throws IOException {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadRoot);
        Files.createDirectories(uploadRoot.resolve("resources"));
        Files.createDirectories(uploadRoot.resolve("thumbnails"));
    }

    public String store(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        try {
            Path targetDirectory = uploadRoot.resolve(folder).normalize();
            Files.createDirectories(targetDirectory);

            String originalName = StringUtils.cleanPath(file.getOriginalFilename());
            String sanitized = sanitizeFileName(originalName);
            String fileName = UUID.randomUUID() + "-" + sanitized;
            Path destination = targetDirectory.resolve(fileName).normalize();

            if (!destination.startsWith(targetDirectory)) {
                throw new IllegalArgumentException("Invalid file path");
            }

            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + folder + "/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file", ex);
        }
    }

    public Resource loadAsResource(String publicPath) {
        try {
            String normalizedPublicPath = publicPath.startsWith("/uploads/")
                    ? publicPath.substring("/uploads/".length())
                    : publicPath;
            Path file = uploadRoot.resolve(normalizedPublicPath).normalize();
            if (!file.startsWith(uploadRoot)) {
                throw new IllegalArgumentException("Invalid file path");
            }

            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("File not found");
            }
            return resource;
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found", ex);
        }
    }

    public String detectContentType(String publicPath) {
        try {
            String normalizedPublicPath = publicPath.startsWith("/uploads/")
                    ? publicPath.substring("/uploads/".length())
                    : publicPath;
            Path file = uploadRoot.resolve(normalizedPublicPath).normalize();
            return Files.probeContentType(file);
        } catch (IOException ex) {
            return null;
        }
    }

    public boolean exists(String publicPath) {
        if (publicPath == null || publicPath.isBlank()) {
            return false;
        }

        if (!publicPath.startsWith("/uploads/")) {
            return true;
        }

        String normalizedPublicPath = publicPath.substring("/uploads/".length());
        Path file = uploadRoot.resolve(normalizedPublicPath).normalize();
        return file.startsWith(uploadRoot) && Files.exists(file);
    }

    public boolean isImage(MultipartFile file) {
        return file != null
                && file.getContentType() != null
                && file.getContentType().toLowerCase(Locale.ENGLISH).startsWith("image/");
    }

    private String sanitizeFileName(String originalName) {
        String normalized = Normalizer.normalize(originalName == null ? "file" : originalName, Normalizer.Form.NFKC)
                .replaceAll("[^\\w.\\-]+", "-")
                .replaceAll("-{2,}", "-")
                .replaceAll("(^-|-$)", "");
        return normalized.isBlank() ? "file" : normalized;
    }
}
