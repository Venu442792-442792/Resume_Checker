-- noinspection SqlNoDataSourceInspectionForFile

-- ============================================================
-- AI Resume Screening System — initial schema
-- ============================================================

CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(150)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    password      VARCHAR(255)  NOT NULL,
    role          VARCHAR(20)   NOT NULL CHECK (role IN ('ADMIN', 'CANDIDATE')),
    created_at    TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE TABLE job_descriptions (
    id               BIGSERIAL PRIMARY KEY,
    title            VARCHAR(200)  NOT NULL,
    description      TEXT          NOT NULL,
    required_skills  TEXT          NOT NULL, -- JSON array of strings, e.g. ["Java","Spring Boot"]
    created_by       BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at       TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE TABLE resumes (
    id                BIGSERIAL PRIMARY KEY,
    candidate_id      BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name         VARCHAR(255)  NOT NULL,
    file_path         VARCHAR(500)  NOT NULL,
    raw_text          TEXT,
    extracted_skills  TEXT, -- JSON array of strings
    uploaded_at       TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE TABLE applications (
    id               BIGSERIAL PRIMARY KEY,
    resume_id        BIGINT           NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    job_id           BIGINT           NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
    match_score      DOUBLE PRECISION NOT NULL,
    matched_skills   TEXT, -- JSON array of strings
    missing_skills   TEXT, -- JSON array of strings
    recommendation   VARCHAR(20)      NOT NULL CHECK (recommendation IN ('SHORTLIST', 'REJECT')),
    created_at       TIMESTAMP        NOT NULL DEFAULT now(),
    CONSTRAINT uq_resume_job UNIQUE (resume_id, job_id)
);

CREATE INDEX idx_job_descriptions_created_by ON job_descriptions(created_by);
CREATE INDEX idx_resumes_candidate_id ON resumes(candidate_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_resume_id ON applications(resume_id);
CREATE INDEX idx_applications_job_score ON applications(job_id, match_score DESC);
