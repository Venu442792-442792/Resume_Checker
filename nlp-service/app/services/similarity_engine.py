import logging

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.core.config import settings

logger = logging.getLogger(__name__)


def _tfidf_cosine_score(resume_text: str, job_text: str) -> float:
    """
    Core requirement: vectorize resume text and job description text with
    TF-IDF, then compute their cosine similarity. Returns a percentage (0-100).
    """
    resume_text = (resume_text or "").strip()
    job_text = (job_text or "").strip()

    if not resume_text or not job_text:
        return 0.0

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        max_features=5000,
    )

    try:
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_text])
    except ValueError:
        # Happens if, after stop-word removal, no vocabulary terms remain
        # (e.g. extremely short input) — treat as no meaningful overlap.
        return 0.0

    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    return round(float(similarity) * 100, 2)


def _skill_overlap_score(matched_count: int, required_count: int) -> float:
    """What fraction of the job's *required* skills the resume covers, as a percentage."""
    if required_count == 0:
        return 0.0
    return round((matched_count / required_count) * 100, 2)


def compute_match(
    resume_text: str,
    resume_skills: list[str],
    job_text: str,
    job_skills: list[str],
) -> tuple[float, list[str], list[str]]:
    """
    Computes the full match result for a resume against a job description.

    Design note: a pure TF-IDF/cosine score between a long, varied resume and
    a short job description tends to under-represent genuine fit (lots of
    resume content — education, past employers, soft skills — is irrelevant
    "noise" to the vectorizer). To keep the score meaningful for shortlisting
    decisions, the final score blends:
      - the TF-IDF/cosine similarity of the full texts (satisfies the core
        "TF-IDF + Cosine Similarity" requirement), and
      - explicit required-skill coverage (how many of the job's required
        skills actually appear in the resume's extracted skills).
    Empirically, short job-description text scored against long, varied
    resume text tends to produce fairly low TF-IDF/cosine scores even for a
    genuinely strong match, so skill coverage is weighted more heavily by
    default (30% TF-IDF / 70% skill overlap).
    Weights are configurable via NLP_TFIDF_WEIGHT / NLP_SKILL_OVERLAP_WEIGHT.

    Returns: (match_score, matched_skills, missing_skills)
    """
    resume_skills_lower = {s.lower(): s for s in (resume_skills or [])}
    job_skills_clean = job_skills or []

    matched_skills = [s for s in job_skills_clean if s.lower() in resume_skills_lower]
    missing_skills = [s for s in job_skills_clean if s.lower() not in resume_skills_lower]

    tfidf_score = _tfidf_cosine_score(resume_text, job_text)
    overlap_score = _skill_overlap_score(len(matched_skills), len(job_skills_clean))

    if job_skills_clean:
        blended = (settings.tfidf_weight * tfidf_score) + (settings.skill_overlap_weight * overlap_score)
    else:
        # No required skills were specified on the job — fall back to pure text similarity.
        blended = tfidf_score

    final_score = round(min(100.0, max(0.0, blended)), 2)

    logger.info(
        "Match computed: tfidf=%.2f overlap=%.2f (%d/%d skills) -> final=%.2f",
        tfidf_score, overlap_score, len(matched_skills), len(job_skills_clean), final_score,
    )

    return final_score, matched_skills, missing_skills
