package com.resumescreen.entity;

import com.resumescreen.util.StringListJsonConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * The central "result" record: a candidate's resume scored against a
 * specific job description via the NLP matching engine.
 */
@Entity
@Table(name = "applications", uniqueConstraints = {
        @UniqueConstraint(name = "uq_resume_job", columnNames = {"resume_id", "job_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private JobDescription job;

    @Column(name = "match_score", nullable = false)
    private Double matchScore;

    @Convert(converter = StringListJsonConverter.class)
    @Column(name = "matched_skills", columnDefinition = "TEXT")
    private List<String> matchedSkills;

    @Convert(converter = StringListJsonConverter.class)
    @Column(name = "missing_skills", columnDefinition = "TEXT")
    private List<String> missingSkills;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Recommendation recommendation;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
