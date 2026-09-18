from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Centralized configuration. All values can be overridden via environment
    variables prefixed with NLP_ (e.g. NLP_CORS_ORIGINS=http://foo,http://bar).
    """

    app_name: str = "AI Resume Screening — NLP Service"
    app_version: str = "1.0.0"

    # Comma-separated list is provided via env var and split below.
    cors_origins: str = "http://localhost:8080,http://localhost:5173"

    max_file_size_mb: int = 5
    spacy_model: str = "en_core_web_sm"

    # Weighting between raw TF-IDF/cosine text similarity and explicit
    # required-skill coverage when computing the final match score.
    # See services/similarity_engine.py for the full rationale — empirically,
    # short job-description text vs. long resume text yields a fairly low
    # TF-IDF/cosine score even for genuinely strong matches, so skill
    # coverage is weighted more heavily by default.
    tfidf_weight: float = 0.3
    skill_overlap_weight: float = 0.7

    skills_taxonomy_path: Path = Path(__file__).parent / "skills_taxonomy.json"

    model_config = SettingsConfigDict(env_prefix="NLP_", case_sensitive=False)

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
