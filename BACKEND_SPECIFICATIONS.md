# ⚙️ PatchForge AI — Backend Technical Specifications

> **Scope:** Server-Side REST API & Security Scanning Engine  
> **Status:** Production-Ready & Connected to Supabase  
> **Version:** 2.0.0

---

## 1. System Overview & Technology Stack

| Category | Technology | Version | Purpose |
|---|---|---|---|
| **Runtime** | Node.js | `v18+` / `v20+` | Asynchronous JavaScript runtime environment |
| **HTTP Framework** | Express.js | `^4.19.0` | API routing, middlewares, controller pipeline |
| **Git Engine** | `simple-git` | `^3.25.0` | Shallow repository cloning engine |
| **Database** | Supabase (PostgreSQL 15+) | `@supabase/supabase-js ^2.45.0` | Relational persistence, cataloging, RLS security |
| **Vulnerability Data** | OSV API (Open Source Vulnerabilities) | REST | Google open-source vulnerability database |
| **AI Intelligence** | Lyzr AI Agent Studio | REST | Strategic risk mitigation & developer patch guides |
| **Security & Utilities** | Helmet, CORS, Morgan | Latest | HTTP security headers, CORS origin management, request logging |

---

## 2. Architecture & Directory Hierarchy

```
backend/src/
├── server.js                     # Process bootstrap & port listener
├── app.js                        # Express app configuration, middlewares, error handlers
├── config/
│   └── supabase.js               # Authenticated Supabase client (Service Role access)
├── controllers/
│   ├── scanController.js         # Synchronous scan execution, SSE streaming, scan history
│   ├── reportController.js       # Scan report query with joined vulnerability data
│   ├── vulnerabilityController.js# Query vulnerabilities for a specific scan
│   └── aiController.js           # Fetch AI analysis payload
├── routes/
│   ├── scanRoutes.js             # /api/scan, /api/scan/stream, /api/scans
│   ├── reportRoutes.js           # /api/report/:scanId
│   ├── vulnerabilityRoutes.js    # /api/vulnerabilities/:scanId
│   └── aiRoutes.js               # /api/ai/:scanId
├── services/
│   ├── supabaseService.js        # Supabase PostgreSQL database operations
│   ├── scanResultService.js      # Formats and delegates persistence to Supabase
│   ├── githubService.js          # Clones repository and orchestrates scanners
│   ├── osvService.js             # Batches parallel OSV API vulnerability queries
│   └── lyzrService.js            # Lyzr AI prompt orchestration with 8s timeout fallback
├── scanners/
│   ├── dependencyScanner.js      # Deep Walker crawler: Node.js, Python, Go, Rust
│   └── osvScanner.js             # OSV scanner integration wrapper
├── github/
│   └── cloneRepository.js        # Shallow Git clone with automated temp cleanup
└── utils/
    ├── validateRepository.js     # Sanitizes and validates GitHub URLs
    ├── severityCalculator.js     # Severity normalization & security score math (0-100)
    └── generateScanId.js         # Deterministic scan ID generator (e.g. PF-925BF8B4)
```

---

## 3. Database Schema Specifications (Supabase PostgreSQL)

The database schema is defined in [`backend/supabase_migration.sql`](file:///H:/Extra%20Cirricular/Hackathon/Innovhack%20Round2/PatchForge-AI/backend/supabase_migration.sql):

```
┌─────────────────┐       ┌─────────────────┐       ┌────────────────────────┐
│  repositories   │ 1   * │      scans      │ 1   * │  scan_vulnerabilities  │
│  (Repositories) │───────│ (Scan Sessions) │───────│      (Join Table)      │
└─────────────────┘       └─────────────────┘       └───────────┬────────────┘
                                                                │ *
                                                                │ 1
                                                    ┌───────────▼────────────┐
                                                    │    vulnerabilities     │
                                                    │  (Normalized Catalog)  │
                                                    └────────────────────────┘
```

### Table Definitions

#### 1. `repositories`
Stores unique GitHub repositories scanned by the platform.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `repository_url` (TEXT, Unique, Indexed)
- `owner_name` (TEXT)
- `repo_name` (TEXT)
- `default_branch` (TEXT, Default: `'main'`)
- `profile_id` (UUID, Foreign Key → `profiles.id` ON DELETE SET NULL)
- `created_at` / `updated_at` (TIMESTAMPTZ)

#### 2. `scans`
Stores scan session executions, aggregate scores, and AI findings.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `scan_id` (TEXT, Unique, Indexed — e.g., `PF-925BF8B4`)
- `repository_url` (TEXT)
- `repository_id` (UUID, Foreign Key → `repositories.id` ON DELETE SET NULL)
- `status` (TEXT: `Queued`, `Scanning`, `Analyzing`, `Completed`, `Failed`)
- `total_dependencies` (INTEGER, Default: 0)
- `vulnerabilities_found` (INTEGER, Default: 0)
- `critical_count` / `high_count` / `medium_count` / `low_count` (INTEGER, Default: 0)
- `severity_counts` (JSONB)
- `security_score` (INTEGER, Default: 100)
- `score_label` (TEXT, Default: `'Excellent'`)
- `ai_analysis` (TEXT)
- `started_at` / `completed_at` (TIMESTAMPTZ)
- `created_at` / `updated_at` (TIMESTAMPTZ)

#### 3. `vulnerabilities` (Normalized Catalog)
Unique vulnerability definitions across all repositories.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `vulnerability_id` (TEXT — CVE or GHSA ID)
- `package_name` (TEXT)
- `ecosystem` (TEXT: `npm`, `PyPI`, `Go`, `crates.io`)
- `summary` / `details` (TEXT)
- `severity` (TEXT: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `UNKNOWN`)
- `cvss_score` (NUMERIC(4, 1), Default: 0)
- `fixed_version` (TEXT)
- `references` (JSONB Array)
- **Constraint:** `UNIQUE(vulnerability_id, package_name)`

#### 4. `scan_vulnerabilities` (Join Table)
Links specific scan runs to vulnerability catalog entries.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `scan_id` (TEXT, Foreign Key → `scans.scan_id` ON DELETE CASCADE)
- `vulnerability_id` (UUID, Foreign Key → `vulnerabilities.id` ON DELETE CASCADE)
- `installed_version` (TEXT)
- `created_at` (TIMESTAMPTZ)

---

## 4. Scanning Pipeline & Engine Specifications

```
1. Validate URL (validateRepository.js)
   └── Sanitizes GitHub URLs, supports .git suffixes, enforces owner/repo structure.

2. Shallow Git Clone (cloneRepository.js)
   └── Clones with `--depth 1 --single-branch --no-tags` into backend/temp/ in < 2 seconds.

3. Deep Walker Manifest Crawler (dependencyScanner.js)
   └── Recursively walks project subdirectories up to depth 4, ignoring build folders:
       • Node.js:  package.json
       • Python:   requirements.txt
       • Go:       go.mod
       • Rust:     Cargo.toml

4. Parallel OSV Querying (osvService.js)
   └── Dispatches parallel asynchronous POST requests to https://api.osv.dev/v1/query:
       • Normalizes ecosystem identifiers (npm, PyPI, Go, crates.io).
       • Strips semver prefixes (^, ~, >=).

5. Severity Calculation (severityCalculator.js)
   └── Computes security score from normalized findings:
       • Critical penalty: -25 pts
       • High penalty:     -15 pts
       • Medium penalty:   -8 pts
       • Low penalty:      -2 pts
       • Security Score = max(0, 100 - Total Penalties)

6. Lyzr AI Strategic Risk Analysis (lyzrService.js)
   └── Sends vulnerability findings to Lyzr Agent with an 8s timeout:
       • Returns Executive Summary, Top Risks, and Remediation Strategy.
       • Fallback gracefully returns structured summary if timeout occurs.

7. Cloud Database Persistence (supabaseService.js)
   └── Upserts repository, writes scan record, upserts vulnerability catalog, links join table.

8. Automated Disk Cleanup (fs.rmSync)
   └── Safely evicts temporary clone directories from backend/temp/.
```

---

## 5. API Endpoint Specifications

### Health & Analytics
- `GET /api/health`
  - **Purpose:** Health check & storage provider verification.
  - **Response:** `{ "success": true, "status": "Healthy", "storage": "Supabase (PostgreSQL)" }`
- `GET /api/stats`
  - **Purpose:** Dashboard aggregate metrics across all historical scans.
  - **Response:** `{ "success": true, "data": { "totalScans": 9, "completedScans": 8, "totalDependencies": 248, "totalVulnerabilities": 21, "securityScore": 83 } }`

### Scans
- `POST /api/scan`
  - **Purpose:** Start synchronous repository scan.
  - **Body:** `{ "repositoryUrl": "https://github.com/owner/repo" }`
  - **Response (201):** `{ "success": true, "data": { "scanId": "PF-925BF8B4", "status": "Completed", "securityScore": 100, ... } }`
- `GET /api/scan/stream?repositoryUrl=...`
  - **Purpose:** Real-time Server-Sent Events (SSE) progress streaming.
  - **Events:** Emits `data: { "status": "Cloning", "progress": 30, "message": "..." }`
- `GET /api/scan` / `GET /api/scans`
  - **Purpose:** Retrieve all historical scan records.
- `GET /api/scan/:scanId`
  - **Purpose:** Retrieve single scan record by ID.

### Reports & Intelligence
- `GET /api/report/:scanId`
  - **Purpose:** Fetch complete report including joined vulnerability definitions and AI analysis.
- `GET /api/vulnerabilities/:scanId`
  - **Purpose:** Fetch only the vulnerability findings list for a scan.
- `GET /api/ai/:scanId`
  - **Purpose:** Fetch AI analysis payload for a scan.

---

## 6. Backend Environment Configuration

Configuration template located at `backend/.env.example`:

```env
# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

# Supabase Credentials
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Lyzr AI Agent Configuration
LYZR_API_URL=https://agent-prod.studio.lyzr.ai/v3/inference/chat/
LYZR_AGENT_ID=<your-agent-id>
LYZR_API_KEY=<your-lyzr-key>
```
