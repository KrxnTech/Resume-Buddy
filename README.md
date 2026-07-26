<div align="center">

# Resume Buddy 😺

### AI-Powered Career Intelligence Platform

Understand how ATS systems and recruiters actually evaluate your resume — Before you hit apply

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)
[![Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?logo=react&logoColor=white)](#tech-stack)
[![Node](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](#tech-stack)
[![AI](https://img.shields.io/badge/AI-Groq%20%2F%20Llama-orange)](#tech-stack)
[![Status](https://img.shields.io/badge/Status-Active%20Development-blue)](#future-roadmap)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](#contributing)

</div>

---

## Table of Contents 🔥

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Why ResumeOS](#why-resumeos)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Application Workflow](#application-workflow)
- [Folder Structure](#folder-structure)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## ✓ Overview

**Resume Buddy** is an AI-powered Career Intelligence Platform that helps candidates optimize their resumes for Applicant Tracking Systems (ATS), improve recruiter visibility, identify skill gaps, rewrite resume sections with AI, prepare for interviews, and receive personalized career insights.

Unlike traditional resume analyzers that just extract raw text from a PDF, Resume Buddy performs **contextual resume analysis using Large Language Models**. It compares your resume against a real job description, simulates how a recruiter would evaluate your profile, calculates ATS compatibility, highlights weaknesses, recommends concrete improvements, and presents everything through a modern SaaS dashboard.

The goal is simple: help job seekers understand how their resume is actually being read — by machines and by humans — before they apply.

---

## Problem Statement 💡

Most candidates submit resumes without ever knowing:

- Whether their resume passes ATS filters
- Which skills are missing for the role they're targeting
- How a recruiter would evaluate their profile
- Whether their experience genuinely matches the job description
- How to improve weak or vague sections
- What skills or projects they should learn next to stay competitive

Resume Buddy closes this feedback gap with AI-driven resume analysis and career guidance.

---

## Why Resume Buddy ? 

- **Context-aware, not keyword-matching.** Resume Buddy uses an LLM to actually understand resume content in relation to a job description, rather than doing naive text/PDF extraction.
- **Dual-lens evaluation.** Every resume is scored from both an ATS-compatibility perspective and a recruiter-judgment perspective.
- **Actionable, not just descriptive.** Beyond scores, Resume Buddy produces rewrite suggestions, keyword recommendations, and section-level feedback you can act on immediately.
- **Built like a real product.** Structured JSON contracts between AI and backend, a clean service-oriented Express API, and a component-driven React dashboard — not a script wrapped in a UI.

---

## Key Features

### ✓ Resume Processing
---
- Resume PDF upload with drag & drop
- Resume validation
- PDF parsing and text extraction
- Resume metadata extraction
- AI-based resume understanding

### ✓ Job Description Analysis
---
- Job description input
- Requirement extraction
- Skill detection
- Experience analysis
- Resume vs. JD comparison

### ✓ AI Resume Analysis
---
- Candidate profile generation
- Resume summary
- Resume match score
- AI-driven resume evaluation

### ✓ Resume Profile
---
- Hard skills extraction
- Soft skills extraction
- Achievement detection
- Experience overview
- Language detection
- Professional links extraction

### ✓ ATS Analysis
---
- Overall ATS match score
- ATS compatibility ring
- Skills, experience, education, formatting, and contact scores
- ATS recommendations

### ✓ Section Analyzer
---
- Skills, experience, project, education, contact, and formatting analysis
- Section strengths and weaknesses
- Keyword suggestions
- Section-level recommendations

### ✓ Recruiter Dashboard
---
- Recruiter verdict and confidence score
- Hiring probability
- Technical interview and HR round chances
- Offer probability
- Strength and risk analysis
- Best matching roles
- Salary readiness indicator
- Recruiter notes

### ✓ AI Rewrite Studio
---
- AI-powered resume rewriter
- Before vs. after comparison
- ATS improvement estimate
- Recruiter impact preview
- Action verb suggestions
- Copy, accept, or undo rewrites
- Version history

### ✓ Resume Insights
---
- Resume strengths
- Missing skills
- Resume improvements
- Actionable suggestions

### ✓ Career Modules
---
- Resume health overview
- Interview preparation
- Career roadmap
- Export report

### ✓ Dashboard Experience
---
- Responsive SaaS layout with sidebar navigation
- Multi-page routing
- Dark theme
- Interactive cards and modern UI components
- Smooth, responsive navigation

### ✓ Backend
---
- Express REST APIs
- File upload API
- PDF processing pipeline
- Groq AI integration
- Structured JSON responses
- Middleware architecture
- Centralized error handling

---

## ✓ Project Architecture

```
                    User
                     │
                     ▼
             React Frontend (Vite)
                     │
                     ▼
            Express Backend (Rest-Full APIs)
                     │
                     ▼
             Resume Upload (PDF Only)
                     │
                     ▼
              PDF Parsing (Multer)
                     │
                     ▼
             Resume Parser (Grok LLM)
                     │
                     ▼
         Job Description Parser (AI)
                     │
                     ▼
                Groq AI (Large Language Model ✓) 
                     │
                     ▼
            Structured JSON (Responce for AI)
                     │
                     ▼
              ATS Engine (Main Dash-Board)
                     │
                     ▼
           Recruiter Engine (Second Main Dash-Board)
                     │
                     ▼
            Rewrite Engine (AI Enhancement)
                     │
                     ▼
          Dashboard Rendering (Complete Resume Information SaaS Way)
```

---

## Application Workflow

1. User uploads a resume PDF.
2. User enters a job description.
3. Backend extracts text from the PDF.
4. Resume information is parsed into structured data.
5. Job description is analyzed.
6. Both datasets are sent to the Groq Large Language Model.
7. The AI generates a structured JSON response.
8. Backend processes the AI response.
9. Frontend renders an interactive dashboard.
10. User receives an ATS score, recruiter analysis, rewrite suggestions, and career recommendations.

---

## Folder Structure ✓


```
Resume-Buddy/
├── client/analyzer-frontend
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   └── utils/
│
└── server/
    ├── controllers/
    ├── middleware/
    ├── routes/
    ├── services/
    ├── uploads/
    ├── utils/
    └── app.js
```

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS
- React Router
- Framer Motion

**Backend**
- Node.js
- Express.js
- Multer
- pdf-parse

**Artificial Intelligence**
- Groq API
- Llama models
- Prompt engineering
- Structured JSON responses

**Database**
- MongoDB *(planned)* 

---

## Installation

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A Groq API key

### Clone the repository

```bash
git clone https://github.com/KrxnTech/AI-Resume-Portfolio-Analyzer.git
cd AI-Resume-Portfolio-Analyzer
```

### Install backend dependencies

```bash
cd server
npm install
```

### Install frontend dependencies

```bash
cd ../client/analyzer-frontend
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server/` directory:

```env
# Server
PORT=5000

# Groq AI
GROQ_API_KEY=your_groq_api_key_here

# MongoDB (planned)
MONGODB_URI=your_mongodb_connection_string
```

> ⚠️ Never commit your `.env` file. Make sure it's listed in `.gitignore`.

---

## Running the Project

### Start the backend

```bash
cd server
npm run dev
```

### Start the frontend

```bash
cd client
npm run dev
```

The frontend will typically run on `http://localhost:5173` and the backend on `http://localhost:5000` (adjust based on your Vite/Express configuration).

---

## Future Roadmap

- [✅] **AI Chat Bot** Careeer AI Assistant - User Helper ✔️
- [ ] MongoDB integration for persistent user data and resume history
- [ ] User authentication and saved resume profiles
- [ ] Multi-resume comparison
- [ ] Export report as PDF
- [ ] Interview preparation module expansion
- [ ] Career roadmap personalization
- [ ] Team/recruiter collaboration workspace

---

## Contributing

Contributions are welcome and appreciated! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m "Add: your feature description"`)
4. Push to your branch (`git push origin feature/your-feature-name`)
5. Open a Pull Request

Please make sure your code follows the existing folder structure and coding conventions before submitting a PR.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Author

**Resume Buddy** — built and maintained by https://github.com/KrxnTech/AI-Resume-Portfolio-Analyzer.

If you find this project useful, consider giving it a ⭐ on GitHub!
