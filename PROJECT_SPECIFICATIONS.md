# 🛡️ PatchForge AI — Project Specifications & System Documentation

> **Version:** 2.0.0 (Supabase Cloud-Native Edition)  
> **Repository:** `https://github.com/Kaustubh-Aware/PatchForge-AI`  
> **Last Updated:** August 27, 2026  
> **Platform Status:** Operational & Fully Connected

---

## 📑 Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [System Architecture & Technology Stack](#2-system-architecture--technology-stack)
3. [Full Component Hierarchy](#3-full-component-hierarchy)
4. [Supabase Database Schema Specifications](#4-supabase-database-schema-specifications)
5. [API Endpoint Specifications](#5-api-endpoint-specifications)
6. [Scanning Engine & Security Pipeline](#6-scanning-engine--security-pipeline)
7. [Error Audit, Root Causes & Implemented Solutions](#7-error-audit-root-causes--implemented-solutions)
8. [Comprehensive Modification Log](#8-comprehensive-modification-log)
9. [Development & Deployment Guide](#9-development--deployment-guide)

---

## 1. Executive Summary

**PatchForge AI** is an automated developer-security intelligence SaaS platform designed to:
1. Clone and recursively analyze public GitHub repositories across multiple ecosystems (**Node.js, Python, Go, Rust**).
2. Extract dependency manifests and query open-source vulnerability databases (**OSV / GitHub Security Advisories**).
3. Compute standardized CVSS/severity risk scores (**Critical, High, Medium, Low**).
4. Generate AI-powered executive risk summaries and remediation plans via **Lyzr AI Agent Studio**.
5. Persist real-time scan analytics, vulnerabilities, and repository records in **Supabase PostgreSQL**.
6. Present findings through a responsive cybersecurity dashboard with animated SVG scores, sorting/filtering tables, and structured remediation advice.

---

## 2. System Architecture & Technology Stack

```
                                  ┌────────────────────────┐
                                  │      Client (SPA)      │
                                  │  React + Vite + Router │
                                  └───────────┬────────────┘
                                              │ HTTP / REST / SSE
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Express.js Backend API                                 │
│                                                                                        │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────────────┐  │
│  │   Git Clone Engine   │  │  Dependency Scanner  │  │   OSV Vulnerability Client   │  │
│  │ (Shallow / Multi-OS) │  │(Node/Python/Go/Rust) │  │  (Parallel Axios Batching)   │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────────────────┘  │
│                                                                                        │
│  ┌────────────────────────────────────────────────┐  ┌──────────────────────────────┐  │
│  │               Lyzr AI Agent Hub                │  │    Supabase Service Layer    │  │
│  │        (Executive Summary & Mitigation)        │  │     (@supabase/supabase-js)  │  │
│  └────────────────────────────────────────────────┘  └──────────────┬───────────────┘  │
└─────────────────────────────────────────────────────────────────────┼──────────────────┘
                                                                      │ Service Role Key
                                                                      ▼
                                                       ┌─────────────────────────────┐
                                                       │    Supabase (PostgreSQL)    │
                                                       │  • repositories   • scans   │
                                                       │  • vulnerabilities          │
                                                       │  • scan_vulnerabilities     │
                                                       │  • profiles       • RLS     │
                                                       └─────────────────────────────┘
```

### Core Technologies

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend UI** | React 18, Vite 8, React Router v6, Framer Motion | High-performance SPA with micro-animations & dark cyber theme |
| **Icons & Design** | Lucide React, Custom Vanilla CSS Design System | Sleek dark-mode cybersecurity aesthetics |
| **Backend Runtime** | Node.js (v18+ / v20+), Express 4.x | REST API server, rate limiting, security headers (Helmet, CORS) |
| **Git Engine** | `simple-git` | Automated shallow repository cloning (`--depth 1 --single-branch --no-tags`) |
| **Vulnerability DB** | Google Open Source Vulnerabilities (OSV.dev API) | Real-time ecosystem vulnerability querying |
| **AI Intelligence** | Lyzr AI Agent Studio (OpenAI GPT-4o backend) | Executive summaries, risk prioritization & developer patch guides |
| **Database** | Supabase (PostgreSQL 15+) | Cloud-native relational storage with RLS, foreign keys, and indexes |
| **Authentication** | Supabase Auth | Token-based secure user sessions and profile management |

---

## 3. Full Component Hierarchy

### Frontend Structure (`/frontend/src/`)
```
frontend/src/
├── App.jsx                       # Master router & layout orchestrator
├── main.jsx                      # React DOM root entry
├── index.css                     # Global design tokens, dark theme variables, typography
├── components/
│   ├── Navbar/
│   │   ├── Navbar.jsx            # Balanced SaaS navbar with brand glow & responsive drawer
│   │   └── Navbar.css            # 3-column layout CSS without search bar
│   ├── Footer/
│   │   ├── Footer.jsx            # Platform footer with tech stack badges (Supabase, Lyzr, React)
│   │   └── Footer.css            # Footer styling
│   ├── SeverityCard/
│   │   ├── SeverityCard.jsx      # Breakdown cards for Critical, High, Medium, Low
│   │   └── SeverityCard.css      # Severity badge glow & color indicators
│   ├── VulnerabilityTable/
│   │   ├── VulnerabilityTable.jsx# Sortable, searchable, paginated vulnerability list
│   │   └── VulnerabilityTable.css# Expandable accordion detail rows with reference links
│   ├── CountUp/
│   │   └── CountUp.jsx           # Animated numeric odometer for metrics
│   └── ScanProgress/
│       └── ScanProgress.jsx      # Multi-stage scanning progress indicator
├── pages/
│   ├── Dashboard/
│   │   ├── DashboardPage.jsx     # Main platform overview, stats, recent scans list
│   │   └── DashboardPage.css     # Grid layout & metrics cards
│   ├── Scan/
│   │   ├── ScanPage.jsx          # Interactive scanner input with validation & tips
│   │   └── ScanPage.css          # Scanner form styling
│   ├── Report/
│   │   ├── ReportPage.jsx        # Full report with SVG score ring & structured AI cards
│   │   └── ReportPage.css        # Structured AI sections & remediation plan styling
│   ├── Login/
│   │   └── LoginPage.jsx         # Supabase Auth sign-in portal
│   └── Signup/
│       └── SignupPage.jsx        # Account registration
└── services/
    ├── api.js                    # Axios instance configured with base URL & interceptors
    ├── scanService.js            # Start scan, get scans list, stream scan
    ├── reportService.js          # Fetch detailed scan report with vulnerabilities
    └── statsService.js           # Fetch platform aggregate metrics
```

### Backend Structure (`/backend/src/`)
```
backend/src/
├── server.js                     # Process bootstrap & port binding
├── app.js                        # Express middlewares, rate-limit, health, error handlers
├── config/
│   └── supabase.js               # Authenticated Supabase client with Service Role Key
├── controllers/
│   ├── scanController.js         # Scan creation, SSE streaming, scan history retrieval
│   ├── reportController.js       # Complete report with joined vulnerability findings
│   ├── vulnerabilityController.js# Query vulnerabilities for a specific scan
│   └── aiController.js           # Fetch Lyzr AI analysis payload
├── routes/
│   ├── scanRoutes.js             # /api/scan, /api/scan/stream, /api/scans
│   ├── reportRoutes.js           # /api/report/:scanId
│   ├── vulnerabilityRoutes.js    # /api/vulnerabilities/:scanId
│   └── aiRoutes.js               # /api/ai/:scanId
├── services/
│   ├── supabaseService.js        # Direct Supabase cloud database operations
│   ├── scanResultService.js      # Formats and delegates persistence to Supabase
│   ├── githubService.js          # Clones repository and triggers dependency parsing
│   ├── osvService.js             # Batches parallel OSV API vulnerability queries
│   └── lyzrService.js            # Lyzr AI prompt orchestration with 8s timeout fallback
├── scanners/
│   └── dependencyScanner.js      # Deep Walker crawler: Node.js, Python, Go, Rust
├── github/
│   └── cloneRepository.js        # Shallow Git clone with automated temp cleanup
└── utils/
    ├── validateRepository.js     # Sanitizes and validates GitHub URLs
    ├── severityCalculator.js     # Severity normalization & security score math (0-100)
    └── generateScanId.js         # Generates deterministic IDs (e.g. PF-23B654F4)
```

---

## 4. Supabase Database Schema Specifications

The database schema is fully defined in [`backend/supabase_migration.sql`](file:///H:/Extra%20Cirricular/Hackathon/Innovhack%20Round2/PatchForge-AI/backend/supabase_migration.sql):

### 1. `repositories` Table
Stores unique GitHub repositories scanned by the platform.
```sql
CREATE TABLE repositories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repository_url TEXT UNIQUE NOT NULL,
    owner_name TEXT,
    repo_name TEXT,
    default_branch TEXT DEFAULT 'main',
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### 2. `scans` Table
Stores high-level scan executions, security scores, and AI analysis.
```sql
CREATE TABLE scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id TEXT UNIQUE NOT NULL,
    repository_url TEXT NOT NULL,
    repository_id UUID REFERENCES repositories(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'Scanning' CHECK (status IN ('Queued', 'Scanning', 'Analyzing', 'Completed', 'Failed')),
    total_dependencies INTEGER NOT NULL DEFAULT 0,
    vulnerabilities_found INTEGER NOT NULL DEFAULT 0,
    critical_count INTEGER NOT NULL DEFAULT 0,
    high_count INTEGER NOT NULL DEFAULT 0,
    medium_count INTEGER NOT NULL DEFAULT 0,
    low_count INTEGER NOT NULL DEFAULT 0,
    severity_counts JSONB NOT NULL DEFAULT '{"CRITICAL":0,"HIGH":0,"MEDIUM":0,"LOW":0}'::jsonb,
    security_score INTEGER NOT NULL DEFAULT 100,
    score_label TEXT NOT NULL DEFAULT 'Excellent',
    ai_analysis TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### 3. `vulnerabilities` Table (Catalog)
Normalized catalog of unique security vulnerabilities detected across all scans.
```sql
CREATE TABLE vulnerabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vulnerability_id TEXT NOT NULL,
    package_name TEXT NOT NULL,
    ecosystem TEXT NOT NULL DEFAULT 'npm',
    summary TEXT,
    details TEXT,
    severity TEXT NOT NULL DEFAULT 'UNKNOWN' CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN')),
    cvss_score NUMERIC(4, 1) DEFAULT 0,
    fixed_version TEXT,
    "references" JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_vuln_pkg UNIQUE (vulnerability_id, package_name)
);
```

### 4. `scan_vulnerabilities` Table (Join Table)
Associates specific scans with vulnerability catalog entries and tracks the installed package version.
```sql
CREATE TABLE scan_vulnerabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id TEXT NOT NULL REFERENCES scans(scan_id) ON DELETE CASCADE,
    vulnerability_id UUID NOT NULL REFERENCES vulnerabilities(id) ON DELETE CASCADE,
    installed_version TEXT NOT NULL DEFAULT 'unknown',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

---

## 5. API Endpoint Specifications

### Health & Aggregates
- `GET /api/health` — Check server status & database storage provider (`Supabase (PostgreSQL)`).
- `GET /api/stats` — Platform aggregate metrics (total scans, dependencies, vulnerabilities, average score).

### Scans
- `POST /api/scan` — Initiate synchronous repository scan.
  - **Body:** `{ "repositoryUrl": "https://github.com/owner/repo" }`
  - **Response (201):** Full completed scan record with security score and vulnerability list.
- `GET /api/scan/stream?repositoryUrl=...` — Server-Sent Events (SSE) stream returning incremental progress (10% -> 30% -> 60% -> 85% -> 100%).
- `GET /api/scan` or `GET /api/scans` — List all scan records ordered by `created_at DESC`.
- `GET /api/scan/:scanId` — Fetch a single scan by ID.

### Reports & Vulnerabilities
- `GET /api/report/:scanId` — Fetch complete report including joined vulnerability array and structured AI analysis.
- `GET /api/vulnerabilities/:scanId` — Query only the vulnerability array for a scan.
- `GET /api/ai/:scanId` — Query only the AI analysis string for a scan.

---

## 6. Scanning Engine & Security Pipeline

1. **URL Validation:** Validates `https://github.com/owner/repo` format, strips `.git` suffixes and trailing slashes.
2. **Optimized Shallow Clone:** Clones to a temporary directory with `--depth 1 --single-branch --no-tags` in < 2 seconds.
3. **Deep Manifest Discovery:** Recursively crawls project directories up to depth 4, ignoring `node_modules`, `.git`, `dist`, `build`, etc., and locates:
   - `package.json` (Node.js / npm)
   - `requirements.txt` (Python / PyPI)
   - `go.mod` (Go modules)
   - `Cargo.toml` (Rust crates)
4. **Parallel OSV Querying:** Dispatches batched async HTTP requests to Google OSV API to identify known CVE/GHSA advisories.
5. **Severity Normalization:**
   - Critical: Score impact -25 pts
   - High: Score impact -15 pts
   - Medium: Score impact -8 pts
   - Low: Score impact -2 pts
   - `Security Score = max(0, 100 - total_impact)`
6. **Lyzr AI Analysis:** Formats vulnerability findings into structured intelligence (Executive Summary, Top Risks, Remediation Strategy).
7. **Cloud Persistence:** Upserts repository -> creates scan -> upserts vulnerabilities -> writes join table -> deletes local temp clone.

---

## 7. Error Audit, Root Causes & Implemented Solutions

| # | Issue Identified | Root Cause | Implemented Solution |
|---|---|---|---|
| 1 | **Missing Supabase Export Functions** | Latest git pull replaced `supabaseService.js` with an incomplete file missing `saveScanResultsToSupabase`, `getStatsFromSupabase`, etc. | Reimplemented complete `supabaseService.js` exporting all required functions for controllers. |
| 2 | **Supabase Client Module Destructuring Bug** | `require("../config/supabase")` returned `{ supabase }`, but code treated it as direct client instance, causing `supabase.from is not a function`. | Corrected client import to `{ supabase } = require("../config/supabase")`. |
| 3 | **URL Validator String Interpolation Typo** | In `validateRepository.js`, `https://github.com{owner}/${repo}` was missing a `/` after `github.com`. | Fixed string template to `https://github.com/${owner}/${repo}` and added support for `.git` suffixes and `www.github.com`. |
| 4 | **React List Missing Key Prop Warning** | `VulnerabilityTable.jsx` used anonymous fragments `<>` inside `.map()`. | Updated to `<Fragment key={key}>` with unique keys for parent and detail rows. |
| 5 | **Navbar Empty Space After Search Removal** | Removing the search bar left an awkward gap in the header layout. | Redesigned into a balanced 3-column SaaS navbar (Brand Left, Nav Links Center, Auth/Scan Actions Right, Responsive Mobile Drawer). |
| 6 | **Legacy MongoDB Baggage** | Unused `mongoose` packages and stale MongoDB connection models remained in the project. | Completely uninstalled `mongoose`, deleted legacy models, and migrated all persistence to Supabase PostgreSQL. |

---

## 8. Comprehensive Modification Log

### Backend Modifications
- [`backend/src/services/supabaseService.js`](file:///H:/Extra%20Cirricular/Hackathon/Innovhack%20Round2/PatchForge-AI/backend/src/services/supabaseService.js): Complete cloud-first Supabase persistence (repositories, scans, normalized vulnerabilities, joins, aggregate statistics).
- [`backend/src/utils/validateRepository.js`](file:///H:/Extra%20Cirricular/Hackathon/Innovhack%20Round2/PatchForge-AI/backend/src/utils/validateRepository.js): Fixed URL reconstruction typo and enhanced regex sanitation.
- [`backend/src/controllers/scanController.js`](file:///H:/Extra%20Cirricular/Hackathon/Innovhack%20Round2/PatchForge-AI/backend/src/controllers/scanController.js): Supports both synchronous `POST /api/scan` and streaming `GET /api/scan/stream` with automatic disk cleanup.
- [`backend/src/scanners/dependencyScanner.js`](file:///H:/Extra%20Cirricular/Hackathon/Innovhack%20Round2/PatchForge-AI/backend/src/scanners/dependencyScanner.js): Added recursive crawler for multi-ecosystem repository parsing.
- [`backend/src/config/supabase.js`](file:///H:/Extra%20Cirricular/Hackathon/Innovhack%20Round2/PatchForge-AI/backend/src/config/supabase.js): Configured authenticated Supabase client using Service Role credentials.
- [`backend/supabase_migration.sql`](file:///H:/Extra%20Cirricular/Hackathon/Innovhack%20Round2/PatchForge-AI/backend/supabase_migration.sql): Complete SQL migration script with 5 tables, RLS policies, indexes, and automated triggers.

### Frontend Modifications
- [`frontend/src/components/Navbar/Navbar.jsx`](file:///H:/Extra%20Cirricular/Hackathon/Innovhack%20Round2/PatchForge-AI/frontend/src/components/Navbar/Navbar.jsx) & [`Navbar.css`](file:///H:/Extra%20Cirricular/Hackathon/Innovhack%20Round2/PatchForge-AI/frontend/src/components/Navbar/Navbar.css): Modern redesigned navbar without search bar, balanced 3-column layout, and responsive drawer.
- [`frontend/src/pages/Report/ReportPage.jsx`](file:///H:/Extra%20Cirricular/Hackathon/Innovhack%20Round2/PatchForge-AI/frontend/src/pages/Report/ReportPage.jsx) & [`ReportPage.css`](file:///H:/Extra%20Cirricular/Hackathon/Innovhack%20Round2/PatchForge-AI/frontend/src/pages/Report/ReportPage.css): Structured AI analysis parser rendering Executive Summary, Top Risks, Remediation Strategy, and Developer Recommendations.
- [`frontend/src/components/VulnerabilityTable.jsx`](file:///H:/Extra%20Cirricular/Hackathon/Innovhack%20Round2/PatchForge-AI/frontend/src/components/VulnerabilityTable.jsx): Fixed React Fragment key mappings; added sort and filter mechanisms.
- [`frontend/src/components/Footer/Footer.jsx`](file:///H:/Extra%20Cirricular/Hackathon/Innovhack%20Round2/PatchForge-AI/frontend/src/components/Footer/Footer.jsx): Updated technology badges (`MongoDB` -> `Supabase`).

---

### Dedicated Specification Documents
- 🎨 **Frontend Architecture & Components:** [`FRONTEND_SPECIFICATIONS.md`](file:///H:/Extra%20Cirricular/Hackathon/Innovhack%20Round2/PatchForge-AI/FRONTEND_SPECIFICATIONS.md)
- ⚙️ **Backend Services & Database:** [`BACKEND_SPECIFICATIONS.md`](file:///H:/Extra%20Cirricular/Hackathon/Innovhack%20Round2/PatchForge-AI/BACKEND_SPECIFICATIONS.md)

---

### Environment Variables Template

#### Backend (`backend/.env.example`)
```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

# Supabase Credentials
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>

# Lyzr AI Credentials
LYZR_API_URL=https://agent-prod.studio.lyzr.ai/v3/inference/chat/
LYZR_AGENT_ID=<your-agent-id>
LYZR_API_KEY=<your-lyzr-api-key>
```

#### Frontend (`frontend/.env.example`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

---

### Running Locally

```bash
# 1. Start Backend Server
cd backend
npm install
node src/server.js

# 2. Start Frontend SPA
cd frontend
npm install
npm run dev
```

- **Backend API:** `http://localhost:5000`
- **Frontend App:** `http://localhost:5173`
