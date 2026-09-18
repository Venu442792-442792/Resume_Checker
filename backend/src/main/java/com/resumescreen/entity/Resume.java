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

@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    /** Path on disk where the original PDF is stored. */
    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "raw_text", columnDefinition = "TEXT")
    private String rawText;

    @Convert(converter = StringListJsonConverter.class)
    @Column(name = "extracted_skills", columnDefinition = "TEXT")
    private List<String> extractedSkills;

    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        this.uploadedAt = LocalDateTime.now();
    }
}
