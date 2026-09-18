# AI Resume Screening System using NLP

> An intelligent, end-to-end resume screening platform that uses Natural Language Processing (NLP) and Machine Learning to analyze resumes, compare them with job descriptions, identify skills, calculate matching scores, and assist recruiters in efficiently screening candidates.

---

## 1. Overview

Recruiters often receive hundreds or thousands of resumes for a single job opening. Manually reviewing every resume is time-consuming and can lead to inconsistent screening.

The AI Resume Screening System automates the initial resume screening process.

The system allows recruiters to create job descriptions and upload candidate resumes. The NLP engine extracts important information from resumes, identifies technical skills, compares candidate profiles with job requirements, and generates an explainable matching result.

### The system provides

* Resume PDF upload and processing
* Resume text extraction
* NLP-based resume analysis
* Technical skill extraction
* Job description management
* Resume and job description comparison
* Resume matching score
* Matched skills
* Missing skills
* Candidate ranking
* Recruiter analytics
* Candidate reports
* Secure administrator authentication

---

# 2. Problem Statement

Recruiters frequently need to process a large number of resumes for a single job position. Manual screening requires considerable time and effort and may result in inconsistent evaluation.

There is a need for an intelligent system that can automatically analyze resumes, extract relevant information, compare candidate qualifications with job requirements, and provide recruiters with meaningful screening insights.

---

# 3. Proposed Solution

The proposed system uses Natural Language Processing and Machine Learning techniques to automate the initial resume screening process.

A candidate's resume is uploaded as a PDF. The system extracts the text, preprocesses it, identifies relevant information such as skills, education, and experience, and compares the candidate's profile with the selected job description.

The system generates:

* Resume Match Score
* Matched Skills
* Missing Skills
* Candidate Information
* Screening Insights
* Candidate Ranking

The system is designed as a decision-support tool for recruiters rather than replacing human decision-making.

---

# 4. System Architecture

```text
                    React Frontend
                          |
                          | REST API
                          |
                          v
                    Spring Boot
                       Backend
                          |
             +------------+------------+
             |                         |
             v                         v
      FastAPI NLP Service          PostgreSQL
             |                      Database
             |
             v
       NLP Processing
             |
       +-----+-----+
       |           |
       v           v
   PDF Parser   ML Analysis
                   |
             TF-IDF +
          Cosine Similarity
```

---

# 5. Technology Stack

## Frontend

| Technology      | Purpose             |
| --------------- | ------------------- |
| React           | User Interface      |
| Vite            | Frontend Build Tool |
| Tailwind CSS    | Styling             |
| React Router    | Navigation          |
| Axios           | API Communication   |
| Framer Motion   | Animations          |
| React Icons     | Icons               |
| Recharts        | Data Visualization  |
| React Hook Form | Form Handling       |
| SweetAlert2     | Notifications       |

## Backend

| Technology        | Purpose                          |
| ----------------- | -------------------------------- |
| Java 21           | Programming Language             |
| Spring Boot 3     | Backend Framework                |
| Spring Web        | REST APIs                        |
| Spring Data JPA   | Database Access                  |
| Hibernate         | ORM                              |
| Lombok            | Boilerplate Reduction            |
| Spring Validation | Input Validation                 |
| Spring Security   | Authentication and Authorization |
| JWT               | Secure Authentication            |
| Swagger/OpenAPI   | API Documentation                |
| Maven             | Dependency Management            |

## NLP and Machine Learning

| Technology        | Purpose              |
| ----------------- | -------------------- |
| Python 3.12       | NLP Service          |
| FastAPI           | NLP REST API         |
| spaCy             | NLP Processing       |
| NLTK              | Text Processing      |
| pdfplumber        | PDF Text Extraction  |
| Scikit-learn      | Machine Learning     |
| TF-IDF            | Text Vectorization   |
| Cosine Similarity | Resume-JD Similarity |

## Database

PostgreSQL is used to store:

* Administrator information
* Job descriptions
* Candidate information
* Resume metadata
* Screening results
* Match scores
* Skills
* Audit information

---

# 6. Main Features

## 6.1 Authentication

The system provides secure administrator authentication using:

* JWT
* Spring Security
* Password hashing
* Role-based authorization

---

## 6.2 Admin Dashboard

The dashboard provides an overview of the recruitment process.

### Statistics

* Total Candidates
* Total Jobs
* Shortlisted Candidates
* Average Match Score

### Analytics

* Candidate distribution
* Match score analysis
* Job-wise candidate statistics
* Screening trends

---

## 6.3 Job Management

Administrators can:

* Create job descriptions
* Update job descriptions
* Delete job descriptions
* View available jobs

Example:

```text
Job Title:
Java Backend Developer

Required Skills:
Java
Spring Boot
REST API
PostgreSQL
Git
Docker
AWS
```

---

## 6.4 Resume Upload

Recruiters can upload candidate resumes in PDF format.

The processing workflow is:

```text
Resume PDF
    |
    v
PDF Text Extraction
    |
    v
Text Processing
    |
    v
NLP Analysis
    |
    v
Candidate Information
```

---

## 6.5 NLP Resume Processing

The NLP service processes resumes through multiple stages.

```text
PDF Resume
    |
    v
Text Extraction
    |
    v
Text Cleaning
    |
    v
Tokenization
    |
    v
Stop Word Removal
    |
    v
Lemmatization
    |
    v
Skill Extraction
    |
    v
Information Extraction
    |
    v
Resume Representation
```

---

## 6.6 Skill Extraction

The system identifies relevant technical skills from the resume.

Example:

```text
Resume:

Java developer with experience in Spring Boot,
React, PostgreSQL, Docker and Git.
```

Extracted skills:

```text
Java
Spring Boot
React
PostgreSQL
Docker
Git
```

---

## 6.7 Resume Matching

The system compares the candidate's resume with the selected job description.

### Job Requirements

```text
Java
Spring Boot
PostgreSQL
Docker
AWS
Git
```

### Candidate Skills

```text
Java
Spring Boot
PostgreSQL
Docker
Git
```

### Result

```text
Matched Skills:

Java
Spring Boot
PostgreSQL
Docker
Git

Missing Skills:

AWS
```

---

# 7. Machine Learning Methodology

## 7.1 TF-IDF

TF-IDF (Term Frequency-Inverse Document Frequency) is used to represent important terms in the resume and job description numerically.

The process is:

```text
Resume Text
     |
     v
TF-IDF Vector
     |
     v
Numerical Representation
```

---

## 7.2 Cosine Similarity

Cosine Similarity is used to measure the similarity between the resume and job description vectors.

```text
Resume
  |
  v
TF-IDF Vector
  |
  +----------+
             |
             v
      Cosine Similarity
             ^
             |
  +----------+
  |
  v
Job Description
```

The resulting similarity value is converted into a percentage-based match score for presentation.

---

# 8. Candidate Ranking

Candidates can be ranked according to their resume-job matching scores.

Example:

| Candidate   | Match Score |
| ----------- | ----------: |
| Candidate A |         91% |
| Candidate B |         84% |
| Candidate C |         76% |
| Candidate D |         68% |

Ranking allows recruiters to review candidate profiles more efficiently.

---

# 9. Analytics

The dashboard provides graphical insights such as:

* Average candidate score
* Number of candidates per job
* Skill frequency
* Shortlisted candidates
* Match score distribution
* Job-wise candidate statistics

Charts can be implemented using Recharts.

---

# 10. Reports

The system can generate candidate screening reports containing:

* Candidate information
* Job applied for
* Match score
* Matched skills
* Missing skills
* Screening information

Reports can be exported in supported formats such as PDF and CSV.

---

# 11. Project Structure

```text
AI-Resume-Screening-System/
|
+-- frontend/
|   |
|   +-- src/
|   |   |
|   |   +-- components/
|   |   +-- pages/
|   |   +-- layouts/
|   |   +-- services/
|   |   +-- hooks/
|   |   +-- utils/
|   |   +-- context/
|   |   +-- App.jsx
|   |
|   +-- public/
|   +-- package.json
|   +-- vite.config.js
|
+-- backend/
|   |
|   +-- src/
|   |   +-- main/
|   |       +-- java/
|   |       +-- resources/
|   |
|   +-- pom.xml
|   +-- README.md
|
+-- nlp-service/
|   |
|   +-- app/
|   |   +-- api/
|   |   +-- services/
|   |   +-- models/
|   |   +-- utils/
|   |   +-- main.py
|   |
|   +-- requirements.txt
|   +-- README.md
|
+-- database/
|   +-- migrations/
|   +-- seed/
|
+-- docker-compose.yml
+-- .gitignore
+-- README.md
```

---

# 12. Application Workflow

```text
Administrator Login
        |
        v
Admin Dashboard
        |
        v
Create Job Description
        |
        v
Upload Candidate Resume
        |
        v
Spring Boot API
        |
        v
FastAPI NLP Service
        |
        v
Extract Resume Text
        |
        v
NLP Processing
        |
        v
Extract Skills
        |
        v
Compare Resume and Job Description
        |
        v
TF-IDF Vectorization
        |
        v
Cosine Similarity
        |
        v
Calculate Match Score
        |
        v
Store Result in PostgreSQL
        |
        v
React Dashboard
        |
        v
Candidate Ranking and Analytics
```

---

# 13. Database Design

Main entities include:

```text
Admin
 |
 +---- Job
          |
          +---- Screening Result
                     |
                     +---- Candidate
                              |
                              +---- Resume
```

### Main Tables

```text
admins
jobs
candidates
resumes
screening_results
audit_logs
```

---

# 14. Getting Started

## Prerequisites

Install:

* Java 21
* Maven
* Node.js
* npm
* Python 3.12
* PostgreSQL
* Git

Verify the installations:

```bash
java -version
mvn -version
node -v
npm -v
python --version
psql --version
git --version
```

---

# 15. Installation

## 15.1 Clone the Repository

```bash
git clone <repository-url>
cd AI-Resume-Screening-System
```

---

## 15.2 Configure PostgreSQL

Create the database:

```sql
CREATE DATABASE resume_screening;
```

Configure the database connection in the Spring Boot configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/resume_screening
spring.datasource.username=postgres
spring.datasource.password=your_password
```

Use environment variables for credentials in production.

---

# 16. Run NLP Service

Navigate to the NLP service:

```bash
cd nlp-service
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the service:

```bash
uvicorn app.main:app --reload --port 8000
```

The NLP service will run on:

```text
http://localhost:8000
```

---

# 17. Run Spring Boot Backend

Navigate to the backend:

```bash
cd backend
```

Run:

```bash
mvn spring-boot:run
```

The backend will run on:

```text
http://localhost:8080
```

Swagger documentation:

```text
http://localhost:8080/swagger-ui/index.html
```

---

# 18. Run React Frontend

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

# 19. Docker Deployment

The project can be containerized using Docker.

Services include:

```text
React
Spring Boot
FastAPI
PostgreSQL
```

Start all services:

```bash
docker compose up --build
```

Stop all services:

```bash
docker compose down
```

---

# 20. API Overview

## Authentication

```text
POST /api/auth/login
```

## Jobs

```text
POST   /api/jobs
GET    /api/jobs
GET    /api/jobs/{id}
PUT    /api/jobs/{id}
DELETE /api/jobs/{id}
```

## Resumes

```text
POST   /api/resumes/upload
GET    /api/resumes
GET    /api/resumes/{id}
DELETE /api/resumes/{id}
```

## Screening

```text
POST /api/screening/analyze
GET  /api/screening/results
GET  /api/screening/results/{id}
```

## Candidates

```text
GET /api/candidates
GET /api/candidates/{id}
```

---

# 21. Testing

The system should be tested with different types of resumes.

| Test Case                       | Expected Result               |
| ------------------------------- | ----------------------------- |
| Valid PDF                       | Resume processed successfully |
| Invalid file                    | Validation error              |
| Empty resume                    | Appropriate error             |
| Resume with matching skills     | Higher matching score         |
| Resume with few matching skills | Lower matching score          |
| Missing skills                  | Missing skills displayed      |
| Multiple candidates             | Candidates ranked             |
| Invalid login                   | Authentication failure        |

---

# 22. Security Considerations

The application includes:

* JWT authentication
* Password hashing
* Role-based authorization
* Input validation
* File type validation
* File size restrictions
* API authorization
* Secure configuration
* Global exception handling

Sensitive information such as passwords, JWT secrets, and database credentials should be provided through environment variables and should never be committed to the repository.

---

# 23. Sustainable Development Goals

## SDG 4 — Quality Education

The system can help students and job seekers understand the skill gaps between their resumes and job requirements, encouraging continuous learning and skill development.

## SDG 8 — Decent Work and Economic Growth

The system supports more efficient employment processes by helping recruiters organize and evaluate candidate information.

## SDG 9 — Industry, Innovation and Infrastructure

The project applies Artificial Intelligence, Natural Language Processing, and Machine Learning techniques to improve an existing recruitment workflow.

## SDG 10 — Reduced Inequalities

An automated and explainable screening system can help standardize the initial comparison of candidate qualifications when appropriately designed and monitored for potential bias.

---

# 24. Limitations

The system is intended to support recruiters rather than make final hiring decisions.

Potential limitations include:

* Resume formatting can affect text extraction.
* Skill extraction may not identify every skill.
* Similarity scores do not represent complete candidate suitability.
* NLP models may produce incorrect interpretations.
* Automated screening can inherit biases from training data or predefined rules.
* Human review remains important for final recruitment decisions.

---

# 25. Future Enhancements

Possible future improvements include:

* Transformer-based NLP models
* Sentence embeddings
* Semantic skill matching
* Multilingual resume processing
* Job recommendation
* Resume improvement suggestions
* Interview question generation
* Email notifications
* Cloud deployment
* Advanced explainable AI
* Bias and fairness monitoring
* Integration with external recruitment platforms

---

# 26. Academic Information

**Project Title:**
AI Resume Screening System using NLP

**Domain:**
Emerging Trends in Machine Learning

**Core Technologies:**

* Natural Language Processing
* Machine Learning
* Information Extraction
* Text Similarity
* Artificial Intelligence

---

# 27. Project Team

**Project Guide:**
*Add guide name here*

**Team Members:**

1. *Member 1*
2. *Member 2*
3. *Member 3*
4. *Member 4*

---

# 28. Screenshots

Add screenshots of the major application interfaces.

Recommended screenshots:

1. Login Page
2. Admin Dashboard
3. Job Creation
4. Resume Upload
5. Candidate List
6. Resume Analysis
7. Match Score
8. Candidate Ranking
9. Analytics Dashboard
10. Report Page

Recommended directory:

```text
docs/
|
+-- screenshots/
    +-- login.png
    +-- dashboard.png
    +-- job-management.png
    +-- resume-upload.png
    +-- screening-result.png
    +-- candidate-ranking.png
```

---

# 29. Contribution

Contributions are welcome.

Create a feature branch:

```bash
git checkout -b feature/new-feature
```

Make changes and commit:

```bash
git add .
git commit -m "feat: add resume screening functionality"
```

Push the branch:

```bash
git push origin feature/new-feature
```

Create a Pull Request after completing the changes.

---

# 30. License

This project is developed for academic and educational purposes.

---

# 31. Project Summary

The AI Resume Screening System using NLP demonstrates how modern Machine Learning and Natural Language Processing techniques can be integrated with a full-stack web application.

The project combines:

```text
React
   +
Spring Boot
   +
Python FastAPI
   +
Natural Language Processing
   +
Machine Learning
   +
PostgreSQL
```

to create an intelligent resume screening and candidate analysis platform.

The system helps recruiters reduce the effort required for initial resume screening while providing transparent information such as matched skills, missing skills, and resume-job similarity.

---

## Built With

React, Spring Boot, Python, FastAPI, Natural Language Processing, Machine Learning, PostgreSQL, and Docker.
