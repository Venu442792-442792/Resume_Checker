package com.resumescreen.controller;

import com.resumescreen.dto.application.ApplicationResponse;
import com.resumescreen.dto.job.JobRequest;
import com.resumescreen.dto.job.JobResponse;
import com.resumescreen.security.UserPrincipal;
import com.resumescreen.service.ApplicationService;
import com.resumescreen.service.JobDescriptionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Tag(name = "Job Descriptions", description = "Admin job postings and candidate browsing")
public class JobDescriptionController {

    @Autowired
    private final JobDescriptionService jobDescriptionService;
    @Autowired
    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<JobResponse> create(
            @Valid @RequestBody JobRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        JobResponse response = jobDescriptionService.create(request, principal.getUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> getAll() {
        return ResponseEntity.ok(jobDescriptionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(jobDescriptionService.getById(id));
    }

    @GetMapping("/{id}/applicants")
    public ResponseEntity<List<ApplicationResponse>> getApplicants(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicantsForJob(id));
    }
}
