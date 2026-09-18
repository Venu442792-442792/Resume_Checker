package com.resumescreen.dto.nlp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Response returned by the FastAPI NLP service's POST /extract-resume endpoint.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record NlpExtractResponse(
        @JsonProperty("raw_text") String rawText,
        @JsonProperty("skills") List<String> skills
) {}
