package com.resumescreen.repository;

import com.resumescreen.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByCandidateIdOrderByUploadedAtDesc(Long candidateId);
}
