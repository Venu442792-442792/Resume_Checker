# ResumeMatch — Backend

Spring Boot 3.3 (Java 21) API for the AI Resume Screening System. Owns auth,
job descriptions, resumes, and applications; delegates all NLP work (text
extraction, skill detection, TF-IDF/cosine matching) to the FastAPI service.

## Prerequisites
- Java 21 (JDK)
- Maven 3.9+ (or use the included Maven wrapper conventions — plain `mvn` used below)
- PostgreSQL 16 (or run via Docker, see below)
- The NLP microservice running (see `../nlp-service`, built in the next step)

## 1. Start PostgreSQL

Easiest via Docker, from the project root:
```bash
docker compose up -d db
```
This starts Postgres on `localhost:5432` with database `resume_screening`,
user `postgres`, password `postgres` (see `docker-compose.yml` — change these
for anything beyond local development).

Or point `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` at your own instance.

## 2. Run the backend

```bash
cd backend
mvn spring-boot:run
```

On startup, Flyway automatically applies `src/main/resources/db/migration/V1__init.sql`
against the database — no manual schema setup needed.

The API is available at **http://localhost:8080/api**, with interactive docs
at **http://localhost:8080/swagger-ui.html**.

## Configuration (environment variables)

All have sensible local defaults in `application.yml`; override for anything
beyond a laptop demo.

| Variable | Default | Purpose |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/resume_screening` | Postgres connection |
| `DB_USERNAME` / `DB_PASSWORD` | `postgres` / `postgres` | Postgres credentials |
| `JWT_SECRET` | dev-only placeholder | HMAC signing key for JWTs — **must** be changed for anything real |
| `JWT_EXPIRATION_MS` | `86400000` (24h) | Token lifetime |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Frontend origin(s) allowed to call the API |
| `FILE_UPLOAD_DIR` | `./uploads/resumes` | Where uploaded resume PDFs are stored on disk |
| `NLP_SERVICE_URL` | `http://localhost:8000` | Base URL of the FastAPI NLP service |
| `SHORTLIST_THRESHOLD` | `65.0` | Minimum match score (0–100) to auto-recommend shortlisting |

## API summary

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create an account (`role`: `ADMIN` or `CANDIDATE`) |
| POST | `/api/auth/login` | Public | Get a JWT |
| POST | `/api/jobs` | ADMIN | Create a job description |
| GET | `/api/jobs` | Authenticated | List all job descriptions |
| GET | `/api/jobs/{id}` | Authenticated | Get one job description |
| GET | `/api/jobs/{id}/applicants` | ADMIN | Ranked applicants for a job |
| POST | `/api/resumes/upload` | CANDIDATE | Upload a PDF resume (multipart `file`) — triggers NLP extraction |
| GET | `/api/resumes/my` | CANDIDATE | List the current candidate's resumes |
| POST | `/api/applications` | CANDIDATE | Score a resume against a job (`resumeId`, `jobId`) |
| GET | `/api/applications/my` | CANDIDATE | The current candidate's application history |
| GET | `/api/applications/{id}` | Owner or ADMIN | Full match detail for one application |

All authenticated endpoints expect `Authorization: Bearer <token>`.

## Architecture notes

- **Schema is owned by Flyway**, not Hibernate (`ddl-auto: validate`) — the
  migration in `db/migration/V1__init.sql` is the single source of truth.
- **Skills are stored as JSON text** (`StringListJsonConverter`) rather than a
  Postgres native array type, keeping the schema portable and avoiding extra
  Hibernate type libraries.
- **NLP calls use Spring's `RestClient`** (`config/RestClientConfig.java`),
  not the reactive `WebClient` — this needs no reactor/netty dependency and
  is the modern, blocking-friendly replacement for `RestTemplate` in a plain
  Spring MVC app. (The original project plan called this file
  `WebClientConfig.java`; it was renamed for accuracy.)
- **Ownership checks live in the service layer**, not just route rules — e.g.
  a candidate can only view/apply with their own resume; `GET /applications/{id}`
  is open to any authenticated user at the route level, then the service
  verifies the requester is either the resume's owner or an ADMIN.
- **JWT contains `userId`, `role`, and `name`** as custom claims so the
  frontend can render immediately after login without a follow-up profile call.

## Try it end-to-end (once the NLP service is running)

```bash
# 1. Register an admin
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex Admin","email":"admin@example.com","password":"password123","role":"ADMIN"}'

# 2. Create a job (use the token from step 1)
curl -X POST http://localhost:8080/api/jobs \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"title":"Backend Engineer","description":"Build APIs with Java and Spring.","requiredSkills":["Java","Spring Boot","PostgreSQL","REST APIs"]}'

# 3. Register a candidate, upload a resume, then POST /api/applications
#    with the returned resumeId + jobId to get a match score.
```
