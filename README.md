# Upskill_Resume

An AI-powered full-stack resume and career development platform built
for students, freshers, entry-level candidates, and job seekers.

Upskill_Resume combines resume analysis, ATS scoring, job matching,
interview preparation, learning resources, and a free resume builder in
one platform.

## Features

### Resume Management

-   Upload PDF and DOCX resumes.
-   Extract resume text using Apache Tika.
-   Secure user-specific resume access.
-   Import data from a previously uploaded resume.
-   Upload a new resume and extract its information into the Resume
    Builder.

### AI Resume Analysis

-   AI-powered resume analysis using Google Gemini.
-   ATS score and resume evaluation.
-   Skill identification.
-   Skill-gap identification.
-   Improvement suggestions.

### Free Resume Builder

-   25 resume templates.
-   Template selection with live visual previews.
-   Manual resume creation.
-   Profile, summary, skills, education, experience, projects, and
    certifications.
-   Import data from an existing uploaded resume.
-   Import data from a newly uploaded PDF/DOCX.
-   Draft persistence using browser local storage.
-   Live resume preview.
-   Download resume as a Word `.docx` document.
-   Template architecture is dynamically discoverable, allowing
    additional template modules to be added without rewriting the main
    builder.

### Job Matching

-   Match resumes with available job opportunities.
-   User-specific job-related functionality protected by authentication.

### Interview Preparation

-   Interview preparation functionality based on the user's
    career/resume context.

### Learning Resources

-   Curated technical learning resources.
-   Skill-based resource filtering.
-   Popular skill/topic shortcuts.
-   Resources for a broad range of technical skills.
-   Dynamic Google search fallback when a requested skill does not have
    a curated resource.

### Authentication & Security

-   User registration and login.
-   JWT-based authentication.
-   BCrypt password hashing.
-   Role-based access for users and administrators.
-   Ownership checks for user-specific resources.
-   CORS configuration for frontend/backend communication.

## Technology Stack

### Frontend

-   React
-   Vite
-   JavaScript / JSX
-   CSS

### Backend

-   Java 21
-   Spring Boot 4.1.1
-   Spring Web
-   Spring Data JPA
-   Spring Security
-   JWT
-   Maven

### Database

-   PostgreSQL

### AI

-   Google Gemini API
-   Google GenAI Java SDK

### Resume Processing

-   Apache Tika for PDF/DOCX text extraction
-   `docx` library for browser-side Word document generation

## Project Structure

``` text
Upskill_Resume/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── resume-templates/
│       │   ├── Template01/
│       │   │   ├── Preview.jsx
│       │   │   └── style.css
│       │   ├── Template02/
│       │   │   ├── Preview.jsx
│       │   │   └── style.css
│       │   ├── ...
│       │   └── Template125/
│       │       ├── Preview.jsx
│       │       └── style.css
│       └── ...
│
└── backend/
    └── src/
        └── main/
            └── java/
                └── ...
```

## Resume Template Architecture

Resume templates are separated from the main Resume Builder.

Each template has its own:

``` text
TemplateXX/
├── Preview.jsx
└── style.css
```

The builder uses a dynamic template discovery system rather than
maintaining a hardcoded list of all templates.

This means a future template can follow the same structure:

``` text
Template26/
├── Preview.jsx
└── style.css
```

and be discovered by the application automatically, provided it follows
the expected shared resume-data interface.

## Main Application Flow

``` text
User
  │
  ├── Register / Login
  │
  ├── Upload Resume
  │      │
  │      └── Apache Tika extraction
  │
  ├── AI Resume Analysis
  │      ├── ATS Score
  │      ├── Skills
  │      ├── Skill Gaps
  │      └── Suggestions
  │
  ├── Job Matching
  │
  ├── Interview Preparation
  │
  ├── Learning Resources
  │
  └── Free Resume Builder
         ├── Select Template
         ├── Enter / Import Data
         ├── Live Preview
         └── Download DOCX
```

## Important API Endpoints

### Authentication

``` text
POST /api/users/register
POST /api/users/login
```

### Resumes

``` text
POST /api/resumes/upload
GET  /api/resumes/my
POST /api/resumes/analyze/{resumeId}
GET  /api/resumes/analysis/{resumeId}
```

### Learning Resources

``` text
GET /api/resources
GET /api/resources/skill/{skill}
```

Additional job, interview, dashboard, and administrative endpoints are
available in the backend controllers.

## Prerequisites

Install:

-   Java 21
-   Node.js and npm
-   PostgreSQL
-   Git

Configure the required database and Gemini API credentials before
starting the backend.

## Database

Create a PostgreSQL database named:

upskill_resume
```

Configure the database connection and application secrets in the backend
configuration/environment used by the project.

Do not commit API keys, JWT secrets, database passwords, or other
credentials to GitHub.

## Running the Backend

From the project root:

``` cmd
cd backend
mvnw.cmd spring-boot:run
```

Backend:

``` text
http://localhost:8080
```

## Running the Frontend

From the project root:

``` cmd
cd frontend
npm install
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

On Windows PowerShell, if npm script execution is restricted, use:

``` cmd
.\node_modules\.bin\vite.cmd
```

or run npm through an appropriate execution-policy bypass.

## Production Build

Frontend:

``` cmd
cd frontend
npm run build
```

Backend tests:

``` cmd
cd backend
mvnw.cmd test
```

## Security Notes

-   Passwords are stored using BCrypt hashes rather than plaintext
    passwords.
-   JWT authentication protects authenticated endpoints.
-   User-owned resources are checked against the authenticated user.
-   Resume upload validation includes supported PDF/DOCX formats and
    file-size limits.
-   API credentials and database credentials must remain outside source
    control.

## Development Notes

The project intentionally keeps resume-template presentation separate
from resume data and builder logic.

The shared resume data model is consumed by the templates, allowing the
same user data to be displayed through different layouts without
creating a separate form for each template.

The Resume Builder supports both manual entry and extraction-based
population while preserving the same structured data flow.

## Current Status

The major application functionality is implemented, including:

-   Authentication
-   Resume upload and extraction
-   AI resume analysis
-   ATS scoring
-   Job matching
-   Interview preparation
-   Learning resources
-   Free resume builder
-   125 dynamically discovered resume templates
-   Live resume preview
-   DOCX export
-   Responsive user-facing UI

Template visual/design refinement remains an independent area that can
be improved without changing the core Resume Builder architecture.

## GitHub

Repository:

Nikhil-tech-eng/Upskill_Resume
```

## License

This project was developed as a college/academic project.
