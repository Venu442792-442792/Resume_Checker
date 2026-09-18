package com.resumescreen.dto.resume;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ResumeResponse(
        Long id,
        String fileName,
        LocalDateTime uploadedAt,
        List<String> extractedSkills
) {}
