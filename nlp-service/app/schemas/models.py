from pydantic import BaseModel, Field


class ExtractResumeResponse(BaseModel):
    """Response for POST /extract-resume. Field names match what
    NlpExtractResponse expects on the Spring Boot side (raw_text, skills)."""

    raw_text: str = Field(default="", description="Full text extracted from the resume PDF")
    skills: list[str] = Field(default_factory=list, description="Skills detected in the resume text")


class MatchRequest(BaseModel):
    """Request body for POST /match. Field names match NlpMatchRequest on
    the Spring Boot side (resume_text, resume_skills, job_text, job_skills)."""

    resume_text: str = ""
    resume_skills: list[str] = Field(default_factory=list)
    job_text: str = ""
    job_skills: list[str] = Field(default_factory=list) 


class MatchResponse(BaseModel):
    """Response for POST /match. Field names match NlpMatchResponse on the
    Spring Boot side (match_score, matched_skills, missing_skills)."""

    match_score: float = Field(ge=0, le=100, description="Overall match score, 0-100")
    matched_skills: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)


class HealthResponse(BaseModel):
    status: str
    spacy_model_loaded: bool
    taxonomy_skill_count: int
