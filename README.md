# AI Resume Analyzer

A production-ready AI-powered Resume Analyzer built with the MERN Stack that intelligently evaluates resumes against job descriptions using Large Language Models.

The application extracts resume information, compares candidate profiles with job requirements, calculates ATS compatibility scores, identifies missing skills, highlights strengths, and generates actionable recommendations to improve interview readiness.

Designed with a scalable architecture, modern UI, and AI-assisted analysis, this project demonstrates the integration of full-stack development with practical Generative AI workflows.

---

# Project Overview

The goal of this project is to automate resume screening by simulating how Applicant Tracking Systems (ATS) and recruiters evaluate resumes.

Instead of simply extracting text from PDFs, the system performs intelligent analysis by understanding:

- Candidate profile
- Technical skills
- Soft skills
- Experience
- Achievements
- Resume quality
- Job requirements
- Skill gaps
- ATS compatibility
- Improvement suggestions

This allows candidates to identify weaknesses before applying for jobs.

---

# Features

## Resume Processing

- Upload Resume (PDF)
- Automatic PDF Parsing
- Resume Text Extraction
- Resume Metadata Extraction
- AI Resume Understanding

## Job Description Analysis

- Custom Job Description Input
- Requirement Extraction
- Skill Requirement Identification
- Experience Requirement Detection
- Responsibility Analysis

## AI Resume Analysis

- Resume vs Job Description Matching
- ATS Compatibility Score
- AI Generated Resume Summary
- Candidate Profile Extraction
- Resume Quality Evaluation

## Resume Insights

- Hard Skills Detection
- Soft Skills Detection
- Achievement Extraction
- Professional Links Detection
- Experience Overview

## ATS Analysis

- Overall ATS Match Score
- Skills Score
- Experience Score
- Education Score
- Formatting Score
- Contact Information Score

## AI Recommendations

- Resume Strengths
- Missing Skills
- Improvement Suggestions
- Resume Optimization Tips

---

# Current Project Capabilities

The application currently performs the following workflow:

1. Upload Resume PDF

2. Parse Resume Content

3. Extract Candidate Information

4. Analyze Job Description

5. Compare Resume with JD

6. Generate ATS Match Percentage

7. Detect Missing Skills

8. Identify Candidate Strengths

9. Suggest Resume Improvements

10. Display Complete AI Analysis Dashboard

---

# Technology Stack

## Frontend

- React
- Vite
- JavaScript
- CSS
- Responsive UI

## Backend

- Node.js
- Express.js
- Multer
- pdf-parse

## AI

- Groq API
- Large Language Models
- Prompt Engineering

## Database

- MongoDB (Upcoming)

---

# System Architecture

```
                Resume PDF
                     │
                     ▼
             PDF Text Extraction
                     │
                     ▼
          Resume Information Parser
                     │
                     ▼
        Candidate Profile Generation
                     │
                     │
                     ▼
           Job Description Parser
                     │
                     ▼
         Resume ↔ JD AI Comparison
                     │
                     ▼
        ATS Score Generation Engine
                     │
                     ▼
        AI Recommendation Generator
                     │
                     ▼
          Interactive Dashboard UI
```

---

# Application Workflow

```
User

│

├── Upload Resume

│

├── Enter Job Description

│

├── Submit Analysis

│

▼

Backend

│

├── Receive PDF

├── Extract Text

├── Parse Resume

├── Process Job Description

├── Send Data to AI

├── Compare Resume & JD

├── Calculate ATS Scores

├── Generate Suggestions

│

▼

Frontend

│

├── Resume Profile

├── ATS Match Score

├── Section Breakdown

├── Skills

├── Missing Skills

├── Strengths

└── Improvement Suggestions
```

---

# Project Structure

```
AI-Resume-Analyzer

│

├── client/

│   ├── public/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── hooks/

│   │   ├── utils/

│   │   ├── services/

│   │   └── assets/

│

├── server/

│   ├── controllers/

│   ├── routes/

│   ├── middleware/

│   ├── services/

│   ├── utils/

│   ├── uploads/

│   └── app.js

│

└── README.md
```

---

# Screenshots

## Home Page

> Insert Screenshot

---

## Resume Upload

> Insert Screenshot

---

## AI Resume Profile

> Insert Screenshot

---

## ATS Match Analysis

> Insert Screenshot

---

## Resume Strengths & Missing Skills

> Insert Screenshot

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/AI-Resume-Analyzer.git

cd AI-Resume-Analyzer
```

---

## Backend

```bash
cd server

npm install

npm run dev
```

Runs on

```
http://localhost:5000
```

---

## Frontend

```bash
cd client

npm install

npm run dev
```

Runs on

```
http://localhost:5173
```

---

# Environment Variables

Create a `.env` file inside the server folder.

```
PORT=5000

GROQ_API_KEY=YOUR_API_KEY
```

---

# AI Analysis Output

The analyzer currently provides:

- Resume Profile
- Hard Skills
- Soft Skills
- Achievements
- ATS Match Score
- Resume Summary
- Resume Strengths
- Missing Skills
- Resume Improvements
- Section-wise ATS Breakdown

---

# Upcoming Features

- User Authentication
- Resume History
- Resume Version Comparison
- AI Resume Rewriter
- AI Cover Letter Generator
- Interview Question Generator
- GitHub Profile Analyzer
- LinkedIn Profile Analyzer
- Portfolio Analyzer
- Resume Templates
- Export Optimized Resume
- Dashboard Analytics
- Recruiter Portal
- MongoDB Persistence

---

# Learning Objectives

This project was built to explore:

- MERN Stack Architecture
- File Upload Handling
- PDF Parsing
- AI Integration
- Prompt Engineering
- REST API Design
- Resume Intelligence
- ATS Evaluation Systems
- Clean Project Structure
- Production Ready Frontend Development

---

# Author

Krishna

Computer Science Engineering Student

MERN Stack Developer

AI Application Developer

---

# License

This project is licensed under the MIT License.
