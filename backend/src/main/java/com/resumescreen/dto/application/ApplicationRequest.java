package com.resumescreen.dto.application;

import jakarta.validation.constraints.NotNull;

public record ApplicationRequest(
        @NotNull(message = "resumeId is required")
        Long resumeId,

        @NotNull(message = "jobId is required")
        Long jobId
) {}
