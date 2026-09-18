package com.resumescreen.service;

import com.resumescreen.config.FileStorageConfig;
import com.resumescreen.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileStorageService {

    @Autowired
    private static final long MAX_FILE_SIZE_BYTES = 5L * 1024 * 1024; // 5MB

    @Autowired
    private final FileStorageConfig fileStorageConfig;

    /**
     * Validates and persists an uploaded resume PDF to disk.
     * @return the absolute path where the file was stored.
     */
    public String store(MultipartFile file) {
        validate(file);

        String originalName = sanitize(file.getOriginalFilename());
        String storedName = UUID.randomUUID() + "_" + originalName;
        Path targetPath = fileStorageConfig.getUploadPath().resolve(storedName);

        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            log.error("Failed to store resume file '{}'", originalName, e);
            throw new BadRequestException("Failed to store the uploaded file. Please try again.");
        }

        return targetPath.toString();
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please attach a resume file.");
        }
        if (!"application/pdf".equalsIgnoreCase(file.getContentType())) {
            throw new BadRequestException("Only PDF files are supported.");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BadRequestException("File size must not exceed 5MB.");
        }
    }

    private String sanitize(String filename) {
        if (filename == null || filename.isBlank()) {
            return "resume.pdf";
        }
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
