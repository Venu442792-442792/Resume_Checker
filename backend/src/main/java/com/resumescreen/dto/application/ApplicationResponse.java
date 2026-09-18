package com.resumescreen.dto.application;

import com.resumescreen.entity.Recommendation;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ApplicationResponse(
        Long id,
        Long jobId,
        String jobTitle,
        Long candidateId,
        String candidateName,
        Double matchScore,
        List<String> matchedSkills,
        List<String> missingSkills,
        Recommendation recommendation,
        LocalDateTime createdAt
) {}
