package com.resumescreen.dto.nlp;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Payload sent to the FastAPI NLP service's POST /match endpoint.
 * JSON field names are explicitly snake_case to match the Python/Pydantic
 * side, which is the convention followed throughout the NLP service contract.
 */
public record NlpMatchRequest(
        @JsonProperty("resume_text") String resumeText,
        @JsonProperty("resume_skills") List<String> resumeSkills,
        @JsonProperty("job_text") String jobText,
        @JsonProperty("job_skills") List<String> jobSkills
) {}
