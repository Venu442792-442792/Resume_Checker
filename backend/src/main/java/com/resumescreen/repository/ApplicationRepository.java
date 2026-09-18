package com.resumescreen.repository;

import com.resumescreen.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByResumeIdAndJobId(Long resumeId, Long jobId);

    @Query("""
            SELECT a FROM Application a
            JOIN FETCH a.resume r
            JOIN FETCH r.candidate c
            JOIN FETCH a.job j
            WHERE j.id = :jobId
            ORDER BY a.matchScore DESC
            """)
    List<Application> findByJobIdWithDetails(@Param("jobId") Long jobId);

    @Query("""
            SELECT a FROM Application a
            JOIN FETCH a.resume r
            JOIN FETCH r.candidate c
            JOIN FETCH a.job j
            WHERE c.id = :candidateId
            ORDER BY a.createdAt DESC
            """)
    List<Application> findByCandidateIdWithDetails(@Param("candidateId") Long candidateId);

    @Query("""
            SELECT a FROM Application a
            JOIN FETCH a.resume r
            JOIN FETCH r.candidate c
            JOIN FETCH a.job j
            WHERE a.id = :id
            """)
    Optional<Application> findByIdWithDetails(@Param("id") Long id);
}
