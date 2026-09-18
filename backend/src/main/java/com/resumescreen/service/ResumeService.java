package com.resumescreen.service;

import com.resumescreen.dto.nlp.NlpExtractResponse;
import com.resumescreen.dto.resume.ResumeResponse;
import com.resumescreen.entity.Resume;
import com.resumescreen.entity.User;
import com.resumescreen.exception.ResourceNotFoundException;
import com.resumescreen.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeService {

    @Autowired
    private final ResumeRepository resumeRepository;
    @Autowired
    private final FileStorageService fileStorageService;
    @Autowired
    private final NlpClientService nlpClientService;

    /**
     * Stores the PDF on disk, sends it to the NLP service for text + skill
     * extraction, and persists the result as a Resume record.
     */
    @Transactional
    public ResumeResponse upload(MultipartFile file, User candidate) {
        String storedPath = fileStorageService.store(file);
        NlpExtractResponse extraction = nlpClientService.extractResume(file);

        Resume resume = Resume.builder()
                .candidate(candidate)
                .fileName(file.getOriginalFilename())
                .filePath(storedPath)
                .rawText(extraction.rawText())
                .extractedSkills(extraction.skills())
                .build();

        Resume saved = resumeRepository.save(resume);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ResumeResponse> getMyResumes(User candidate) {
        return resumeRepository.findByCandidateIdOrderByUploadedAtDesc(candidate.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Resume findEntityById(Long id) {
        return resumeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + id));
    }

    private ResumeResponse toResponse(Resume resume) {
        return ResumeResponse.builder()
                .id(resume.getId())
                .fileName(resume.getFileName())
                .uploadedAt(resume.getUploadedAt())
                .extractedSkills(resume.getExtractedSkills())
                .build();
    }
}
