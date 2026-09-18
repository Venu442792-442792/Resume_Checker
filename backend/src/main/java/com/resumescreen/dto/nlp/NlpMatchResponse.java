package com.resumescreen.dto.nlp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Response returned by the FastAPI NLP service's POST /match endpoint.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record NlpMatchResponse(
        @JsonProperty("match_score") Double matchScore,
        @JsonProperty("matched_skills") List<String> matchedSkills,
        @JsonProperty("missing_skills") List<String> missingSkills
) {}
