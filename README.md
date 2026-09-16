# Campus360 AI & PromiseCheck

> **Unified Campus Intelligence Portal & Deceptive Education Claims Auditor**

Campus360 AI is a comprehensive campus management platform powered by Gemini AI and Express/React. It unifies academic scheduling, official document issuance, AI-triaged grievance resolution, hostel management, CampusFind lost-and-found discovery, and **PromiseCheck AI**—an AI auditor that verifies deceptive educational coaching, course guarantees, and 100% placement marketing claims against consumer protection standards.

---

## ✨ Key Features

### 🎓 Academic & Student Intelligence
- **Course & Attendance Tracker**: Real-time attendance percentage tracking with mandatory 75% cutoff alerts and syllabus progression metrics.
- **Interactive Daily Timetable**: Live weekday class and lab schedule with room allocation.
- **Academic Performance**: Cumulative CGPA, semester GPA, and credit completion meters.

### 🛡️ PromiseCheck AI (Deception Auditor)
- **Claim Verification Engine**: Scans text, advertisements, flyers, or job offers against historical placement registries and UGC/AICTE compliance norms.
- **Deception Risk Scoring**: Generates a risk rating (Low, Medium, High, Extreme) with identified red flags (e.g., unqualified "100% placement guarantee", concealed hidden fees, fake accreditation claims).
- **Legitimate Alternatives**: Recommends credible, accredited alternatives and regulatory reporting guidance.

### 🔍 CampusFind (Lost & Found with AI Matching)
- **AI-Powered Item Matching**: Automatically pairs lost item reports with found items based on description and category similarity.
- **Secure Retrieval & Claim Verification**: One-click claim initiation with privacy-protected secret claim codes.

### 📄 Instant Document Request & Verification
- **Official Certificate Issuance**: Self-service requests for Bonafide Certificates, Transcripts, Course Completion Letters, and NOCs.
- **Digital Preview & Validation**: Includes official university seals, verifiable reference codes, and instant printable previews.

### ⚖️ Smart Complaint Management
- **Automated AI Triage**: Categorizes grievances (Infrastructure, Academics, Hostel, Administration), predicts resolution SLAs, and assigns responsible campus departments.
- **Resolution Timeline**: Transparent progress timeline with multi-party communication threads.

### 🏠 Hostel & Dining Services
- **Digital QR Gatepass**: Outpass applications with instant warden approval status and scannable gate security QR codes.
- **Weekly Mess Rotation**: Daily meal menus with diet types (Vegetarian, Non-Veg, Vegan) and calorie estimates.

### 🎙️ AI Voice & Multilingual Campus Assistant
- **Voice Recognition**: Interactive voice queries with Web Speech API integration.
- **Multilingual Support**: Real-time campus guidance in English, Hindi, Spanish, French, and Telugu.
- **Text-to-Speech (TTS)**: Built-in audio playback for spoken responses.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend**: [Express 4](https://expressjs.com/), [Node.js](https://nodejs.org/)
- **AI Engine**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini Flash models)
- **Design System**: Neo-Collegiate Graphic Studio (tactile stickers, warm paper backgrounds, and crisp 2px graphic strokes)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** / **yarn**
- **Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
cd campus360
npm install
```

### 2. Environment Configuration
Create a `.env` file in the project root based on `.env.example`:
```bash
cp .env.example .env
```

Add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Running Locally in Development
Start the dev server (binds Express API routes and Vite frontend to port 3000):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Building for Production
```bash
npm run build
```
This compiles the Vite frontend into `dist/` and bundles the Express server with `esbuild` into `dist/server.cjs`.

### 5. Starting the Production Server
```bash
npm run start
```

---

## 📁 Project Structure

```
├── server.ts                  # Express backend with Gemini API proxy endpoints
├── src/
│   ├── App.tsx                # Main application controller & sub-navigation
│   ├── main.tsx               # Client entry point
│   ├── index.css              # Global Neo-Collegiate styles & Tailwind directives
│   ├── types.ts               # Shared TypeScript interfaces & types
│   ├── data/
│   │   └── mockData.ts        # Seed data for courses, hostel, timetable & claims
│   └── components/
│       ├── Navbar.tsx         # Clean top bar with role & language controls
│       ├── AcademicView.tsx   # Course attendance, CGPA & timetable
│       ├── PromiseCheckView.tsx # AI claim auditor & deception detector
│       ├── CampusFindView.tsx # Lost & found directory with AI matching
│       ├── DocumentRequestView.tsx # Official document generation
│       ├── ComplaintManagementView.tsx # Smart grievance triage
│       ├── HostelServicesView.tsx # QR gatepasses & dining menus
│       ├── AnnouncementsNotificationsView.tsx # Campus notices & circulars
│       ├── FeedbackView.tsx   # Student course & campus ratings
│       ├── AdminDashboardView.tsx # Dean & administrator metrics
│       ├── AssistantDrawer.tsx# Voice & multilingual AI assistant
│       ├── LandingPageView.tsx# Campus overview & quick actions
│       └── LoginModal.tsx     # Role switcher (Student, Faculty, Admin)
├── package.json
└── README.md
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
