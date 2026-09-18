import io
import re
import logging

import pdfplumber

logger = logging.getLogger(__name__)


class PdfExtractionError(Exception):
    """Raised when a PDF cannot be parsed or contains no extractable text."""


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts and lightly normalizes text from a PDF's raw bytes.

    We deliberately keep this simple (no OCR): the vast majority of resumes
    submitted as PDFs are text-based exports (Word/LaTeX/Canva -> PDF), not
    scanned images, so pdfplumber's native text extraction covers the
    real-world case well for this project's scope.
    """
    if not file_bytes:
        raise PdfExtractionError("The uploaded file is empty.")

    try:
        pages_text: list[str] = []
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            if len(pdf.pages) == 0:
                raise PdfExtractionError("The PDF has no pages.")

            for page in pdf.pages:
                text = page.extract_text() or ""
                pages_text.append(text)

    except PdfExtractionError:
        raise
    except Exception as exc:  # pdfplumber/pdfminer raise several exception types
        logger.exception("Failed to parse PDF")
        raise PdfExtractionError("Could not read the PDF file. Is it corrupted or password-protected?") from exc

    raw_text = "\n".join(pages_text)
    cleaned = _normalize_whitespace(raw_text)

    if not cleaned.strip():
        raise PdfExtractionError(
            "No extractable text found in the PDF. "
            "It may be a scanned image without a text layer."
        )

    return cleaned


def _normalize_whitespace(text: str) -> str:
    """Collapses runs of whitespace while preserving paragraph breaks,
    which keeps the text clean for both skill matching and TF-IDF."""
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()
