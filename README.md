<p align="center">
  <img src="./public/logo.png" alt="Yukti AI Logo" width="180" />
</p>

<h1 align="center">Yukti AI</h1>

<p align="center">
  <strong>Comprehensive AI Campus Intelligence &amp; Student Success Ecosystem</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue.svg" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF.svg" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-38B2AC.svg" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Express-4.x-000000.svg" alt="Express" />
  <img src="https://img.shields.io/badge/Recharts-2.x-22c55e.svg" alt="Recharts" />
  <img src="https://img.shields.io/badge/HuggingFace-Transformers.js-FFD21E.svg" alt="Transformers.js" />
  <img src="https://img.shields.io/badge/Gemini_API-Supported-orange.svg" alt="Gemini API" />
</p>

---

## 🌟 Overview

**Yukti AI** is a modern, unified campus workspace and intelligence portal engineered to streamline academic administration, simplify student life, and protect learners through automated verification tools. 

Featuring hybrid on-device and cloud AI capabilities, Yukti AI pairs local semantic search (via quantized MiniLM embeddings) with cloud generative intelligence (Google Gemini and Groq), backed by resilient cloud persistence on Supabase with automatic browser-local offline fallback.

---

## 🚀 Key Modules & Capabilities

### 1. 🎓 Academics & Schedules
- Dynamic weekly timetable with room numbers, faculty assignments, and subject metadata.
- Attendance tracker with threshold alerts (e.g. 75% minimum criteria alerts) and detailed attendance breakdowns.
- Course credits, grade registers, and progress indicators.

### 2. 📄 Smart Document Requests
- Digital application pipeline for official documents:
  - Bona Fide Certificates
  - Official Grade Transcripts
  - Letters of Recommendation (LOR)
  - Character & Transfer Certificates
- Multi-stage approval timeline: `Submitted` ➔ `Under Review` ➔ `HOD Approved` ➔ `Ready`.
- Digital PDF preview and instant download generation for certified documents.

### 3. 🚨 AI Grievance & Smart Complaint Redressal
- Intuitive student ticketing for campus infrastructure, academics, and hostel issues.
- Automated AI triage: category assignment, priority level, and sentiment detection.
- Interactive student-administrator discussion threads and real-time status tracking.

### 4. 🏢 Hostel & Campus Services
- Streamlined digital Outpass applications with warden/faculty approval workflows.
- Real-time digital pass generation with exit/entry timestamps.
- Weekly hostel dining hall menu with meal timings and daily dietary schedules.

### 5. 🔍 CampusFind — Semantic Lost & Found
- Powered locally by [Xenova/all-MiniLM-L6-v2](https://huggingface.co/Xenova/all-MiniLM-L6-v2) through Hugging Face Transformers.js.
- Computes cosine similarity between lost and found descriptions directly in the workspace without sending student data to external servers.
- Filter by category, location, date, and status.

### 6. 📊 Campus Surveys & Real-Time Analytics
- Democratic campus polling on campus initiatives, festival planning, and student facilities.
- **Interactive Recharts Visualizations**:
  - Live 100% stacked progress bars and dynamic percentage distributions.
  - Interactive Recharts Donut Charts with center total tallies and hover tooltips.
  - Active Poll Spotlight with instant switching between running surveys.
  - Demographic and departmental breakdown analytics modal for campus administrators.

### 7. 🛡️ PromiseCheck AI — Offer & Claims Analyzer
- In-depth AI analyzer evaluating educational offers, internship letters, placement promises, and course certificates.
- Detects deceptive marketing, unrealistic salary guarantees, hidden upfront fee structures, and fake accreditations.
- Generates structured risk scores, red-flag checklists, and actionable verification tips.

### 8. 🎙️ Multilingual Campus AI Voice Assistant
- Integrated floating assistant supporting English, Hindi, Spanish, French, and Telugu.
- Speech-to-Text (STT) voice recognition and natural Text-to-Speech (TTS) vocal responses.
- Handles queries regarding deadlines, exam schedules, mess menus, and campus policies with deep-link navigation.

### 9. 👥 Multi-Role Perspectives
- Instant switching between **Student** (Alex Rivera), **Faculty** (Dr. Aris Thorne), and **Administrator** (Dean Eleanor Vance).
- Context-aware UI showing role-specific tools, actions, and administrative oversight.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts, Lucide Icons, Motion.
- **Backend API**: Express.js server providing secure proxy endpoints, eliminating browser-side key exposure.
- **Local AI Embedding Engine**: `@xenova/transformers` running the quantized MiniLM model locally.
- **Cloud AI Providers**: `@google/genai` (Gemini API) and Groq SDK with automatic fallback orchestration.
- **Persistence Layer**: Supabase PostgreSQL with schema migrations (`supabase/migrations/`) and browser localStorage offline cache.

---

## ⚡ Quick Start

### Prerequisites
- **Node.js**: Version 22 or later.
- **npm**: Version 10 or later.

### Installation

1. **Clone the repository & install dependencies**:
   ```bash
   git clone <repository-url>
   cd yukti-ai
   npm install
   ```

2. **Download the local MiniLM embedding model**:
   ```bash
   npm run prepare:model
   ```
   *Downloads the quantized MiniLM model (~24 MB) into the local `.cache/models` directory.*

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Provide your API credentials (never commit `.env`):
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   GROQ_API_KEY=your_groq_api_key
   AI_PROVIDER=auto

   # Optional Supabase Cloud Database:
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SECRET_KEY=your_supabase_service_role_key
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ AI Provider Orchestration

- `AI_PROVIDER=auto` *(default)*: Uses Gemini first for all requests; automatically falls back to Groq for text tasks if Gemini quota or connection is unavailable.
- `AI_PROVIDER=gemini`: Exclusively routes requests through Google Gemini models.
- `AI_PROVIDER=groq`: Exclusively routes text requests through Groq.
- *Note: Poster and document image analysis requires Gemini vision capabilities.*

---

## 🧪 Testing & Verification

- **Type Checking**:
  ```bash
  npm run lint
  ```
- **Unit & Mock Tests**:
  ```bash
  npm test
  ```
- **API Smoke Tests** *(validates local MiniLM inference & endpoints)*:
  ```bash
  npm run test:api
  ```
- **Production Build**:
  ```bash
  npm run build
  ```
- **Production Preview**:
  ```bash
  npm start
  ```

---

## 🔒 Security & Boundaries

- **Demo Workspace**: Designed as an institutional demonstration system. User roles are demonstration perspectives and do not replace institutional Single Sign-On (SSO) or security perimeters.
- **PromiseCheck Scope**: PromiseCheck provides automated heuristic and linguistic analysis of submitted texts. It does not replace certified legal counsel, accreditation board verification, or background check agencies.
- **Key Safety**: All generative AI calls and database mutations are proxied through the server backend. Secret keys are never exposed to the client bundle.

---

## 📄 License & Attribution

- **Local Model**: [Xenova/all-MiniLM-L6-v2](https://huggingface.co/Xenova/all-MiniLM-L6-v2) (Apache-2.0).
- **Inference Runtime**: [Transformers.js](https://github.com/huggingface/transformers.js) by Hugging Face (Apache-2.0).
- **Icons**: [Lucide React](https://lucide.dev) (ISC License).
- **Charts**: [Recharts](https://recharts.org) (MIT License).

<p align="center">
  <sub>© 2026 Yukti AI · Built for student success and campus intelligence.</sub>
</p>
