from app.services.similarity_engine import compute_match


def test_strong_match_scores_highly():
    resume_text = (
        "Experienced backend engineer skilled in Java, Spring Boot, PostgreSQL, "
        "and building REST APIs. Worked extensively with Docker and Kubernetes "
        "for deployment, and Git for version control."
    )
    job_text = (
        "We are looking for a backend engineer with strong Java and Spring Boot "
        "experience, familiarity with PostgreSQL, and the ability to build REST APIs."
    )
    resume_skills = ["Java", "Spring Boot", "PostgreSQL", "REST APIs", "Docker", "Kubernetes", "Git"]
    job_skills = ["Java", "Spring Boot", "PostgreSQL", "REST APIs"]

    score, matched, missing = compute_match(resume_text, resume_skills, job_text, job_skills)

    assert score >= 65.0
    assert set(matched) == set(job_skills)
    assert missing == []


def test_weak_match_scores_low():
    resume_text = "Graphic designer experienced in Adobe Photoshop, Illustrator, and branding."
    job_text = "Looking for a backend engineer with Java, Spring Boot, and PostgreSQL experience."
    resume_skills = ["Photoshop", "Illustrator"]
    job_skills = ["Java", "Spring Boot", "PostgreSQL"]

    score, matched, missing = compute_match(resume_text, resume_skills, job_text, job_skills)

    assert score < 40.0
    assert matched == []
    assert set(missing) == set(job_skills)


def test_partial_match_reports_correct_skill_sets():
    resume_text = "Full-stack developer with Java, Spring Boot, and React experience."
    job_text = "Backend role requiring Java, Spring Boot, PostgreSQL, and Docker."
    resume_skills = ["Java", "Spring Boot", "React"]
    job_skills = ["Java", "Spring Boot", "PostgreSQL", "Docker"]

    score, matched, missing = compute_match(resume_text, resume_skills, job_text, job_skills)

    assert set(matched) == {"Java", "Spring Boot"}
    assert set(missing) == {"PostgreSQL", "Docker"}
    assert 0 < score < 100


def test_no_job_skills_falls_back_to_text_similarity():
    resume_text = "Backend engineer with Java and Spring Boot experience."
    job_text = "Backend engineer role requiring Java and Spring Boot."

    score, matched, missing = compute_match(resume_text, [], job_text, [])

    assert matched == []
    assert missing == []
    assert score > 0


def test_empty_inputs_do_not_crash():
    score, matched, missing = compute_match("", [], "", [])
    assert score == 0.0
    assert matched == []
    assert missing == []
