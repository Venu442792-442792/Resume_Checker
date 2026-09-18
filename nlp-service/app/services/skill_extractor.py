import json
import logging

import spacy
from spacy.matcher import PhraseMatcher

from app.core.config import settings

logger = logging.getLogger(__name__)

# Tokens spaCy's default English tokenizer would otherwise split apart
# (e.g. "C++" -> "C", "+", "+"), which would break phrase matching.
_SPECIAL_CASE_TOKENS = ["C++", "C#", ".NET"]


class SkillExtractor:
    """
    Loads spaCy once and builds a PhraseMatcher over the skills taxonomy.
    Matching is case-insensitive (attr="LOWER") and multi-word-aware, so
    "spring boot", "Spring Boot", and "SPRING BOOT" in resume/job text all
    resolve to the canonical taxonomy entry "Spring Boot".
    """

    def __init__(self) -> None:
        logger.info("Loading spaCy model '%s'...", settings.spacy_model)
        self.nlp = spacy.load(settings.spacy_model, disable=["ner", "lemmatizer"])

        for token_text in _SPECIAL_CASE_TOKENS:
            self.nlp.tokenizer.add_special_case(token_text, [{"ORTH": token_text}])

        self.taxonomy: list[str] = self._load_taxonomy()
        self.matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")

        # Map each matcher pattern id back to the taxonomy's canonical casing
        # (e.g. "Spring Boot" rather than whatever case appeared in the text).
        self._canonical_by_lower: dict[str, str] = {}
        patterns = []
        for skill in self.taxonomy:
            patterns.append(self.nlp.make_doc(skill))
            self._canonical_by_lower[skill.lower()] = skill
        self.matcher.add("SKILLS", patterns)

        logger.info("Skill extractor ready with %d taxonomy entries.", len(self.taxonomy))

    def _load_taxonomy(self) -> list[str]:
        with open(settings.skills_taxonomy_path, "r", encoding="utf-8") as f:
            skills = json.load(f)
        # De-duplicate while preserving order, in case the taxonomy file
        # ever gets edited with an accidental repeat.
        seen = set()
        unique = []
        for skill in skills:
            key = skill.lower()
            if key not in seen:
                seen.add(key)
                unique.append(skill)
        return unique

    def extract(self, text: str) -> list[str]:
        """Returns the sorted, de-duplicated list of taxonomy skills found in `text`."""
        if not text or not text.strip():
            return []

        doc = self.nlp(text)
        matches = self.matcher(doc)

        found_lower: set[str] = set()
        for _match_id, start, end in matches:
            span_text = doc[start:end].text.lower()
            if span_text in self._canonical_by_lower:
                found_lower.add(span_text)

        canonical_matches = [self._canonical_by_lower[lower] for lower in found_lower]
        return sorted(canonical_matches, key=str.lower)


# Loaded once at process startup and reused for every request — spaCy model
# loading and matcher construction are too expensive to repeat per-request.
skill_extractor = SkillExtractor()
