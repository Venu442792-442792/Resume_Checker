package com.resumescreen.service;

import com.resumescreen.dto.job.JobRequest;
import com.resumescreen.dto.job.JobResponse;
import com.resumescreen.entity.JobDescription;
import com.resumescreen.entity.User;
import com.resumescreen.exception.ResourceNotFoundException;
import com.resumescreen.repository.JobDescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobDescriptionService {

    @Autowired
    private final JobDescriptionRepository jobDescriptionRepository;

    @Transactional
    public JobResponse create(JobRequest request, User admin) {
        JobDescription job = JobDescription.builder()
                .title(request.title().trim())
                .description(request.description().trim())
                .requiredSkills(request.requiredSkills())
                .createdBy(admin)
                .build();

        JobDescription saved = jobDescriptionRepository.save(job);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getAll() {
        return jobDescriptionRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public JobResponse getById(Long id) {
        return toResponse(findEntityById(id));
    }

    @Transactional(readOnly = true)
    public JobDescription findEntityById(Long id) {
        return jobDescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job description not found with id: " + id));
    }

    private JobResponse toResponse(JobDescription job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requiredSkills(job.getRequiredSkills())
                .createdByName(job.getCreatedBy().getName())
                .createdAt(job.getCreatedAt())
                .build();
    }
}
