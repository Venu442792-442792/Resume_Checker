import logging

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.core.config import settings
from app.schemas.models import (
    ExtractResumeResponse,
    HealthResponse,
    MatchRequest,
    MatchResponse,
)
from app.services.pdf_extractor import PdfExtractionError, extract_text_from_pdf
from app.services.similarity_engine import compute_match
from app.services.skill_extractor import skill_extractor

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check() -> HealthResponse:
    return HealthResponse(
        status="ok",
        spacy_model_loaded=skill_extractor.nlp is not None,
        taxonomy_skill_count=len(skill_extractor.taxonomy),
    )


@router.post("/extract-resume", response_model=ExtractResumeResponse, tags=["Resume"])
async def extract_resume(file: UploadFile = File(...)) -> ExtractResumeResponse:
    """
    Called by the Spring Boot backend when a candidate uploads a resume.
    Extracts raw text from the PDF, then detects skills from that text.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported.",
        )

    file_bytes = await file.read()

    max_bytes = settings.max_file_size_mb * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds the maximum allowed size ({settings.max_file_size_mb}MB).",
        )

    try:
        raw_text = extract_text_from_pdf(file_bytes)
    except PdfExtractionError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc

    skills = skill_extractor.extract(raw_text)

    logger.info("Extracted %d chars and %d skills from '%s'", len(raw_text), len(skills), file.filename)

    return ExtractResumeResponse(raw_text=raw_text, skills=skills)


@router.post("/match", response_model=MatchResponse, tags=["Match"])
def match_resume_to_job(request: MatchRequest) -> MatchResponse:
    """
    Called by the Spring Boot backend when a candidate applies to a job.
    Computes the TF-IDF/cosine-based match score plus matched/missing skills.
    """
    score, matched, missing = compute_match(
        resume_text=request.resume_text,
        resume_skills=request.resume_skills,
        job_text=request.job_text,
        job_skills=request.job_skills,
    )

    return MatchResponse(match_score=score, matched_skills=matched, missing_skills=missing)
