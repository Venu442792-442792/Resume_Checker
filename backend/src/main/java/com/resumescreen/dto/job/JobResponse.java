package com.resumescreen.dto.job;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record JobResponse(
        Long id,
        String title,
        String description,
        List<String> requiredSkills,
        String createdByName,
        LocalDateTime createdAt
) {}
