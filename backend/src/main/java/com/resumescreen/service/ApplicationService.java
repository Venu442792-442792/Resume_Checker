package com.resumescreen.service;

import com.resumescreen.dto.application.ApplicationRequest;
import com.resumescreen.dto.application.ApplicationResponse;
import com.resumescreen.dto.nlp.NlpMatchRequest;
import com.resumescreen.dto.nlp.NlpMatchResponse;
import com.resumescreen.entity.Application;
import com.resumescreen.entity.JobDescription;
import com.resumescreen.entity.Recommendation;
import com.resumescreen.entity.Resume;
import com.resumescreen.entity.Role;
import com.resumescreen.entity.User;
import com.resumescreen.exception.BadRequestException;
import com.resumescreen.exception.ResourceNotFoundException;
import com.resumescreen.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    @Autowired
    private final ApplicationRepository applicationRepository;
    @Autowired
    private final ResumeService resumeService;
    @Autowired
    private final JobDescriptionService jobDescriptionService;
    @Autowired
    private final NlpClientService nlpClientService;

    @Value("${app.matching.shortlist-threshold}")
    private double shortlistThreshold;

    /**
     * Scores a candidate's resume against a job description and persists the result.
     * This is the requirement-#5/#6/#9 pipeline: compare -> TF-IDF/cosine score -> recommend.
     */
    @Transactional
    public ApplicationResponse apply(ApplicationRequest request, User candidate) {
        Resume resume = resumeService.findEntityById(request.resumeId());

        if (!resume.getCandidate().getId().equals(candidate.getId())) {
            throw new AccessDeniedException("This resume does not belong to you.");
        }

        JobDescription job = jobDescriptionService.findEntityById(request.jobId());

        if (applicationRepository.existsByResumeIdAndJobId(resume.getId(), job.getId())) {
            throw new BadRequestException("You have already applied to this job with this resume.");
        }

        NlpMatchRequest nlpRequest = new NlpMatchRequest(
                resume.getRawText(),
                resume.getExtractedSkills(),
                job.getDescription(),
                job.getRequiredSkills()
        );
        NlpMatchResponse matchResult = nlpClientService.matchResumeToJob(nlpRequest);

        Recommendation recommendation = matchResult.matchScore() >= shortlistThreshold
                ? Recommendation.SHORTLIST
                : Recommendation.REJECT;

        Application application = Application.builder()
                .resume(resume)
                .job(job)
                .matchScore(matchResult.matchScore())
                .matchedSkills(matchResult.matchedSkills())
                .missingSkills(matchResult.missingSkills())
                .recommendation(recommendation)
                .build();

        Application saved = applicationRepository.save(application);
        // Re-fetch with joins so the response mapper can safely read candidate/job names.
        Application withDetails = applicationRepository.findByIdWithDetails(saved.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found after creation"));

        return toResponse(withDetails);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications(User candidate) {
        return applicationRepository.findByCandidateIdWithDetails(candidate.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicantsForJob(Long jobId) {
        // Ensures a clean 404 instead of a silently empty list for an unknown job id.
        jobDescriptionService.findEntityById(jobId);

        return applicationRepository.findByJobIdWithDetails(jobId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getById(Long id, User requester) {
        Application application = applicationRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        boolean isOwner = application.getResume().getCandidate().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("You do not have permission to view this application.");
        }

        return toResponse(application);
    }

    private ApplicationResponse toResponse(Application app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .candidateId(app.getResume().getCandidate().getId())
                .candidateName(app.getResume().getCandidate().getName())
                .matchScore(app.getMatchScore())
                .matchedSkills(app.getMatchedSkills())
                .missingSkills(app.getMissingSkills())
                .recommendation(app.getRecommendation())
                .createdAt(app.getCreatedAt())
                .build();
    }
}
