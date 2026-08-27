# 🎨 PatchForge AI — Frontend Technical Specifications

> **Scope:** Client-Side Single Page Application (SPA)  
> **Status:** Production-Ready & Fully Connected  
> **Version:** 2.0.0

---

## 1. System Overview & Technology Stack

| Category | Technology | Version | Purpose |
|---|---|---|---|
| **Core Framework** | React | `^19.2.8` | Component lifecycle, virtual DOM rendering, hooks |
| **Tooling & Bundler** | Vite | `^8.2.0` | Fast HMR dev server, Rollup production bundling |
| **Routing** | React Router DOM | `^7.18.2` | Client-side declarative route management |
| **Animations** | Framer Motion | `^12.43.0` | UI transitions, staggered entries, progress rings |
| **Iconography** | Lucide React / React Icons | `^1.28.0` / `^5.7.0` | Cybersecurity and system indicator icon set |
| **HTTP Client** | Axios | `^1.19.0` | Intercepted HTTP client with extended 120s timeout |
| **Styling** | Vanilla CSS + Tailwind CSS | `^3.4.17` | Scoped modular CSS + utility classes |

---

## 2. Architecture & Directory Hierarchy

```
frontend/src/
├── App.jsx                       # Master router & layout container
├── main.jsx                      # Application bootstrap & DOM mount
├── index.css                     # Global design tokens, typography, CSS resets
├── styles/
│   ├── variables.css             # HSL theme variables & color tokens
│   └── global.css                # Base layouts, scrollbars, animations
├── components/
│   ├── Navbar/
│   │   ├── Navbar.jsx            # Balanced 3-column SaaS navigation bar
│   │   └── Navbar.css            # Scoped navbar styling (without search bar)
│   ├── Footer/
│   │   ├── Footer.jsx            # Platform footer with tech stack badges
│   │   └── Footer.css            # Responsive footer layout
│   ├── SeverityCard/
│   │   ├── SeverityCard.jsx      # Severity metrics grid (Critical, High, Medium, Low)
│   │   └── SeverityCard.css      # Severity glow cards & badge styling
│   ├── VulnerabilityTable/
│   │   ├── VulnerabilityTable.jsx# Sortable, searchable, paginated vulnerability list
│   │   └── VulnerabilityTable.css# Expandable accordion detail rows with reference links
│   ├── CountUp/
│   │   └── CountUp.jsx           # Animated numeric odometer for metrics
│   ├── ScanProgress/
│   │   ├── ScanProgress.jsx      # Multi-stage scanning progress indicator
│   │   └── ScanProgress.css      # Progress bar & status pulse styling
│   ├── FloatingMenu/
│   │   ├── FloatingMenu.jsx      # Floating quick action menu
│   │   └── FloatingMenu.css      # Floating action styling
│   ├── ScanHistory/
│   │   ├── ScanHistory.jsx       # Historical scan table with status badges
│   │   └── ScanHistory.css       # History table styling
│   ├── SuccessModal/
│   │   ├── SuccessModal.jsx      # Completion confirmation modal
│   │   └── SuccessModal.css      # Modal backdrop & animation styling
│   └── background/
│       ├── CyberBackground.jsx   # Ambient dark grid background with glow particles
│       └── CyberBackground.css   # Cyber grid keyframe animations
├── pages/
│   ├── Dashboard/
│   │   ├── Dashboard.jsx         # Master dashboard view
│   │   ├── DashboardHero.jsx     # Hero section with primary CTA and platform summary
│   │   ├── StatsCards.jsx        # Top metric indicators
│   │   ├── ThreatOverview.jsx    # Severity risk distribution chart
│   │   ├── TopVulnerabilities.jsx# Ranked critical threat highlights
│   │   ├── RecentScans.jsx       # Stream of recently executed scans
│   │   ├── AIRecommendation.jsx # AI quick summary widget
│   │   └── SecurityScore.jsx     # Security health grade breakdown
│   ├── Scan/
│   │   ├── ScanPage.jsx          # Interactive scanner input with validation
│   │   └── ScanPage.css          # Scanner form styling
│   ├── Report/
│   │   ├── ReportPage.jsx        # Full report with SVG score ring & structured AI cards
│   │   └── ReportPage.css        # Structured AI sections & remediation plan styling
│   ├── Login/
│   │   ├── Login.jsx             # User authentication form
│   │   └── Login.css             # Login form styling
│   ├── Signup/
│   │   ├── Signup.jsx            # User registration form
│   │   └── Signup.css            # Registration form styling
│   ├── Settings/
│   │   ├── Settings.jsx          # User configuration & preferences
│   │   └── Settings.css          # Settings form styling
│   └── NotFound/
│       ├── NotFound.jsx          # 404 error fallback view
│       └── NotFound.css          # 404 styling
└── services/
    ├── apiService.js             # Configured Axios instance with request/response interceptors
    ├── scanService.js            # API functions for creating scans, fetching history & streaming
    └── reportService.js          # API functions for fetching detailed reports
```

---

## 3. Router & Navigation Map

```
┌─────────────────────────────────────────────────────────────┐
│                          App.jsx                            │
│  ├── <CyberBackground />                                    │
│  ├── <Navbar />                                             │
│  └── <Routes>                                               │
│       ├── "/" & "/dashboard"   ──► <Dashboard />            │
│       ├── "/scan"              ──► <ScanPage />             │
│       ├── "/report/:scanId"    ──► <ReportPage />           │
│       ├── "/login"             ──► <Login />                │
│       ├── "/signup"            ──► <Signup />               │
│       ├── "/settings"          ──► <Settings />             │
│       └── "*"                  ──► <NotFound />             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Key Component Logic & Features

### 1. **Navbar (`Navbar.jsx`)**
- Rebalanced 3-column SaaS layout:
  - **Left (Brand):** Animated shield icon with conic gradient rotation, `PatchForge AI` brand title, and `v2.0` badge.
  - **Center (Navigation):** Pill-style navigation items (`Dashboard`, `Scan Repository`, `Settings`) with active indicator highlighting.
  - **Right (Actions):** `Login` button + `Start Scan` primary CTA.
  - **Mobile:** Responsive slide-down drawer with collapsible menu toggle.
- **Note:** The legacy repository/CVE search bar and shortcut chips were removed to ensure balanced whitespace.

### 2. **Security Score Ring (`ReportPage.jsx`)**
- SVG animated circular progress gauge computed dynamically from repository score:
  - `circumference = 2 * Math.PI * radius`
  - `offset = circumference - (score / 100) * circumference`
- Severity Color Mapping:
  - **90–100:** `Excellent` (`#22c55e` - Green)
  - **75–89:** `Good` (`#3b82f6` - Blue)
  - **50–74:** `Fair` (`#f59e0b` - Amber)
  - **25–49:** `Poor` (`#f97316` - Orange)
  - **0–24:** `Critical` (`#ef4444` - Red)

### 3. **Structured AI Security Report View (`ReportPage.jsx`)**
- Smart JSON parser rendering intelligence received from Lyzr AI:
  - **Executive Summary:** Narrative risk overview.
  - **Identified Security Risks:** Grid of risk cards tagged with package names, CVSS scores, and severity indicators.
  - **Remediation & Patching Strategy:** Actionable developer patch instructions with target safe versions.
  - **Developer Recommendations:** Hardening suggestions and configuration best practices.

### 4. **Vulnerability Table (`VulnerabilityTable.jsx`)**
- Live multi-field search filter (by CVE, package name, ecosystem).
- Sortable columns (Package name, CVSS Score, Severity).
- Expandable accordion detail rows displaying vulnerability descriptions, CWE IDs, and external advisory links.
- Keyed React Fragments ensuring clean DOM reconciliation.

---

## 5. API Communication Layer

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Components    │ ───►  │  scanService.js │ ───►  │  apiService.js  │ ───► Backend API
│ (Dashboard/Scan)│       │ reportService.js│       │(Axios Instance) │      (/api)
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

- **Base URL:** Dynamic fallback: `import.meta.env.VITE_API_BASE_URL` → `http://localhost:5000/api`
- **Timeout:** Configured to `120,000ms` (2 minutes) to prevent premature disconnection during deep Git clone and OSV query cycles.
- **Interceptors:** Centralized error logging and token propagation headers.

---

## 6. Frontend Environment Configuration

Configuration template located at `frontend/.env.example`:

```env
# API Base Endpoint
VITE_API_BASE_URL=http://localhost:5000/api

# Client-Safe Supabase Keys (Public Anon Key ONLY)
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-public-anon-key>
```

> ⚠️ **Security Requirement:** Never place the backend `SUPABASE_SERVICE_ROLE_KEY` inside the frontend environment configuration.

---

## 7. Vite Server & Build Optimizations

- **Strict Localhost Binding:** Configured in `vite.config.js` with `host: 'localhost'` and dedicated HMR websockets to prevent browser `net::ERR_NETWORK_CHANGED` connection resets.
- **API Proxy:** Transparently forwards `/api` requests to backend port `5000`.
- **Code Splitting & Asset Optimization:** Production bundle outputs chunked CSS/JS assets into `dist/assets/`.
