# ResumeMatch — NLP Service

FastAPI microservice handling everything NLP-related for the AI Resume
Screening System: PDF text extraction, skill detection, and TF-IDF +
Cosine Similarity matching. Called exclusively by the Spring Boot backend —
never directly by the frontend.

## Prerequisites
- Python 3.11+
- pip

## Setup

```bash
cd nlp-service
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

`requirements.txt` installs the `en_core_web_sm` spaCy model directly from
its release wheel, so no separate `python -m spacy download` step is needed.

## Run

```bash
uvicorn main:app --reload --port 8000
```

- API: **http://localhost:8000**
- Interactive docs: **http://localhost:8000/docs**
- Health check: **http://localhost:8000/health**

## Run tests

```bash
pytest -v
```

## Endpoints

### `POST /extract-resume`
Multipart form upload (`file`: PDF). Extracts raw text with `pdfplumber`,
then detects skills from that text.

```json
{
  "raw_text": "John Doe ... Java, Spring Boot, PostgreSQL ...",
  "skills": ["Java", "Spring Boot", "PostgreSQL"]
}
```

### `POST /match`
```json
// Request
{
  "resume_text": "...",
  "resume_skills": ["Java", "Spring Boot", "PostgreSQL"],
  "job_text": "...",
  "job_skills": ["Java", "Spring Boot", "PostgreSQL", "Docker"]
}
```
```json
// Response
{
  "match_score": 78.5,
  "matched_skills": ["Java", "Spring Boot", "PostgreSQL"],
  "missing_skills": ["Docker"]
}
```

### `GET /health`
Returns whether the spaCy model loaded successfully and how many taxonomy
skills are registered — useful for container health checks.

## How matching works

1. **Skill extraction** (`app/services/skill_extractor.py`): spaCy's
   `PhraseMatcher` scans text against a curated taxonomy of ~150 technical
   skills (`app/core/skills_taxonomy.json`), matching case-insensitively and
   handling multi-word terms ("Spring Boot", "Machine Learning") correctly.
2. **Matched/missing skills** (requirements #7/#8): a direct set comparison
   between the job's required skills and the resume's extracted skills.
3. **Match score** (`app/services/similarity_engine.py`, requirement #6):
   TF-IDF vectorizes the resume text and job description text, then computes
   their cosine similarity. This is blended with required-skill coverage
   (30% TF-IDF / 70% skill overlap by default) because a pure text-similarity
   score between a long resume and a short job description tends to
   under-represent genuine fit — the blend keeps scores meaningful for
   shortlisting decisions. Weights are configurable via
   `NLP_TFIDF_WEIGHT` / `NLP_SKILL_OVERLAP_WEIGHT`.

## Adding more skills

Edit `app/core/skills_taxonomy.json` — it's a flat JSON array of strings.
The service rebuilds its matcher from this file at startup, so no code
changes are needed to expand skill coverage.

## Configuration (environment variables, prefix `NLP_`)

| Variable | Default | Purpose |
|---|---|---|
| `NLP_CORS_ORIGINS` | `http://localhost:8080,http://localhost:5173` | Allowed CORS origins |
| `NLP_MAX_FILE_SIZE_MB` | `5` | Max accepted PDF size |
| `NLP_SPACY_MODEL` | `en_core_web_sm` | spaCy model to load |
| `NLP_TFIDF_WEIGHT` | `0.3` | Weight of TF-IDF/cosine score in the blend |
| `NLP_SKILL_OVERLAP_WEIGHT` | `0.7` | Weight of skill-coverage score in the blend |
