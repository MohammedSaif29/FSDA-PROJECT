package com.eduvault.eduvault.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path thumbnailsPath = uploadPath.resolve("thumbnails").normalize();
        String thumbnailsLocation = thumbnailsPath.toUri().toString();

        registry.addResourceHandler("/uploads/thumbnails/**")
                .addResourceLocations(thumbnailsLocation.endsWith("/") ? thumbnailsLocation : thumbnailsLocation + "/");
    }
}
