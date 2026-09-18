package com.resumescreen.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Resolves the resume-upload directory and guarantees it exists before any
 * upload request comes in. {@link com.resumescreen.service.FileStorageService}
 * reads {@link #getUploadPath()} to know where to read/write files.
 */
@Slf4j
@Configuration
@Getter
public class FileStorageConfig {

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadPath);
            log.info("Resume upload directory ready at: {}", uploadPath);
        } catch (IOException e) {
            throw new IllegalStateException("Could not create upload directory: " + uploadPath, e);
        }
    }
}
