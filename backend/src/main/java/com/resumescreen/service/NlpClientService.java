package com.resumescreen.service;

import com.resumescreen.dto.nlp.NlpExtractResponse;
import com.resumescreen.dto.nlp.NlpMatchRequest;
import com.resumescreen.dto.nlp.NlpMatchResponse;
import com.resumescreen.exception.NlpServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Thin client wrapping the two endpoints exposed by the Python NLP service:
 *   POST /extract-resume  — PDF in, raw text + detected skills out
 *   POST /match           — resume + job text/skills in, TF-IDF/cosine score out
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NlpClientService {

    @Autowired
    private final RestClient nlpRestClient;

    public NlpExtractResponse extractResume(MultipartFile file) {
        try {
            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);

            return nlpRestClient.post()
                    .uri("/extract-resume")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body)
                    .retrieve()
                    .body(NlpExtractResponse.class);

        } catch (IOException e) {
            throw new NlpServiceException("Could not read the uploaded file for NLP processing", e);
        } catch (RestClientException e) {
            log.error("Call to NLP /extract-resume failed", e);
            throw new NlpServiceException("Resume text/skill extraction failed", e);
        }
    }

    public NlpMatchResponse matchResumeToJob(NlpMatchRequest request) {
        try {
            return nlpRestClient.post()
                    .uri("/match")
                    .contentType(MediaType.APPLICATION_JSON)
                    .headers(h -> h.setAccept(java.util.List.of(MediaType.APPLICATION_JSON)))
                    .body(request)
                    .retrieve()
                    .body(NlpMatchResponse.class);
        } catch (RestClientException e) {
            log.error("Call to NLP /match failed", e);
            throw new NlpServiceException("Resume-to-job matching failed", e);
        }
    }
}
