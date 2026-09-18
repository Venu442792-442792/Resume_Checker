package com.resumescreen.repository;

import com.resumescreen.entity.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobDescriptionRepository extends JpaRepository<JobDescription, Long> {

    List<JobDescription> findAllByOrderByCreatedAtDesc();
}
