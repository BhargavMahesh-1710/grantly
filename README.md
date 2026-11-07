# GRANTLY — Unified Scholarship Discovery & Management Platform

> **Frontend Arena • Track 1 Prototype**  
> *Rethinking how students find, evaluate, prepare, and track educational financial assistance.*

---

## 🌟 Problem Statement & Vision
Accessing educational financial assistance is frequently an overwhelming, disjointed experience for students. Opportunities are scattered across fragmented portals, eligibility criteria are buried in dense legal text, required documents are easily missed, and keeping track of application deadlines typically falls back to confusing spreadsheets.

**GRANTLY** turns this complicated journey into a cohesive, empowering digital product:
- **Discover:** Instant keyword and multi-faceted search (major, study level, award amount, and urgency).
- **Match:** Dynamic client-side eligibility evaluation that gives students an instant confidence score (`Likely Match`, `Potential Match`, `Check Details`) compared against their student profile.
- **Prepare:** An interactive document readiness checklist (transcripts, essays, letters of recommendation) directly on the grant detail page.
- **Manage:** A visual Kanban pipeline (`Interested` &rarr; `In Progress` &rarr; `Applied` &rarr; `Shortlisted` &rarr; `Awarded` / `Not Selected`) with custom notes and persistent browser LocalStorage.

---

## 🚀 Key Features

### 1. 🔍 Scholarship Discovery Engine
- **Instant Search:** Full-text filtering on scholarship title, sponsor/provider, description keywords, and tags.
- **Multi-Faceted Filters:** Filter by Degree Level, Major / Discipline, Minimum Funding Amount, Closing Soon (within 21 days), and High Match (75%+).
- **Flexible Sorting:** Sort by Best Match Score, Highest Award, Earliest Deadline, or Alphabetical.
- **View Modes:** Toggle seamlessly between Responsive Cards Grid and Scannable List View.
- **Active Filter Badges:** Easily see and clear active filter tags.

### 2. ⚡ Client-Side Eligibility Analyzer
- Automatically analyzes student profile metrics (Degree Level, Major/Field, GPA, State of Legal Residence, Financial Demographics) against each scholarship's requirements.
- Generates a transparent itemized breakdown:
  - Degree Level Check
  - Field of Study Compatibility
  - Minimum GPA Threshold Verification
  - Geographic / State Residency

### 3. 📋 Guided Document Preparation Checklist
- Real-time tickable checklist for transcripts, statements of purpose, portfolios, and letters of recommendation.
- Progress bar shows preparation readiness percentage.
- Checklist states persist directly into the student's application tracking record.

### 4. 📊 Kanban Application Tracker & Table View
- **Dual Views:** Switch between an interactive Kanban pipeline and a clean, structured Table view.
- **Custom Stages:** Manage opportunities across `Interested`, `In Progress`, `Applied`, `Shortlisted`, `Awarded`, and `Not Selected`.
- **Celebration Trigger:** Marking an application as **Awarded** fires a confetti celebration.
- **Personal Notes & Deadlines:** Add reminders, portal submission codes, and interview dates.
- **Pipeline Funding Counter:** Real-time computation of total potential grant aid tracked.

### 5. 📈 Student Dashboard & Analytics
- Overview of tracked grants, saved items, shortlisted awards, and cumulative pipeline value.
- Recharts visualization showing application distribution across pipeline stages.
- Urgent 30-day deadline alerts.
- Top 3 recommended scholarships matched to the student's profile.

### 6. 👤 Profile & Preferences Management
- Editable student details: Degree level, major, institution, GPA, state, income range, first-generation status, and personal bio.
- Notification simulation preferences.
- **Demo Reset Button:** One-click reset to restore default demonstration data for hackathon judges at any time.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime & Build** | Node.js + Vite | Lightning-fast local dev and sub-second production builds |
| **UI Framework** | React 19 (ES6+) | Modern component architecture, state hooks, and Context API |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) | Responsive, modern SaaS light design system |
| **Routing** | React Router DOM v7 | Seamless client-side navigation with query param sync |
| **Icons** | Lucide React | Consistent, accessible interface iconography |
| **Analytics** | Recharts | Responsive chart visualizations of application status |
| **Celebration** | Canvas Confetti | Delightful user feedback upon receiving awards |
| **Persistence** | Browser `LocalStorage` | Zero-latency persistence of profile, bookmarks, and pipeline |

---

## 🎨 Design System Tokens

- **Primary Action:** `#1D4ED8` (Royal Blue)
- **Deep Navy:** `#14233B` (Headings, high contrast text)
- **Slate Canvas:** `#F8FAFC` (App background)
- **Surface:** `#FFFFFF` (Cards, modals, navigation)
- **Accent:** `#7C3AED` (Soft Violet)
- **Typography:** `Plus Jakarta Sans` & `Inter`

---

## 💻 Local Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Deployment Instructions

GRANTLY is a pure frontend Single Page Application (SPA) requiring zero backend server setup.

### Option A: Deploy to Netlify
1. Run `npm run build` to generate the `dist` directory.
2. Drag and drop the `dist/` folder into [Netlify Drop](https://app.netlify.com/drop).
3. If using Netlify CLI or Git connection, add a `_redirects` file in `public/` containing `/* /index.html 200` for SPA routing.

### Option B: Deploy to Vercel
```bash
npx vercel
```
Set the output directory to `dist`.

---

## 🔒 Prototype Transparency Notice
GRANTLY v1 is a frontend prototype built for the Frontend Arena hackathon. Scholarship listings represent realistic demonstration models with realistic criteria and award amounts. All eligibility evaluations, document checklists, and application stages are processed securely in the browser using LocalStorage. Future versions can connect to official financial aid APIs, institutional databases, and authenticated user accounts.
