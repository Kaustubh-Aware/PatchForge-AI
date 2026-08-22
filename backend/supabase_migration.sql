-- ==============================================================================
-- PatchForge AI — Complete Supabase SQL Database Migration
-- ==============================================================================
-- Run this script directly in the Supabase SQL Editor (Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. Clean Existing Tables (if migrating)
-- ==============================================================================
DROP TABLE IF EXISTS scan_vulnerabilities CASCADE;
DROP TABLE IF EXISTS vulnerabilities CASCADE;
DROP TABLE IF EXISTS scans CASCADE;
DROP TABLE IF EXISTS repositories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ==============================================================================
-- 3. Profiles Table (User / Platform Accounts)
-- ==============================================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'developer' CHECK (role IN ('developer', 'security_analyst', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 4. Repositories Table
-- ==============================================================================
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

-- ==============================================================================
-- 5. Scans Table
-- ==============================================================================
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

-- ==============================================================================
-- 6. Vulnerabilities Catalog Table (Normalized)
-- ==============================================================================
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

-- ==============================================================================
-- 7. Scan ↔ Vulnerabilities Join Table
-- ==============================================================================
CREATE TABLE scan_vulnerabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id TEXT NOT NULL REFERENCES scans(scan_id) ON DELETE CASCADE,
    vulnerability_id UUID NOT NULL REFERENCES vulnerabilities(id) ON DELETE CASCADE,
    installed_version TEXT NOT NULL DEFAULT 'unknown',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 8. Performance Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_scans_scan_id ON scans(scan_id);
CREATE INDEX IF NOT EXISTS idx_scans_repo_url ON scans(repository_url);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_repositories_url ON repositories(repository_url);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_vuln_id ON vulnerabilities(vulnerability_id);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_pkg ON vulnerabilities(package_name);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON vulnerabilities(severity);
CREATE INDEX IF NOT EXISTS idx_scan_vulns_scan_id ON scan_vulnerabilities(scan_id);
CREATE INDEX IF NOT EXISTS idx_scan_vulns_vuln_id ON scan_vulnerabilities(vulnerability_id);

-- ==============================================================================
-- 9. Automatic Timestamp Trigger
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER trg_repositories_updated_at
    BEFORE UPDATE ON repositories
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER trg_scans_updated_at
    BEFORE UPDATE ON scans
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ==============================================================================
-- 10. Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_vulnerabilities ENABLE ROW LEVEL SECURITY;

-- Read policies for public/anon access
CREATE POLICY "Public profiles are viewable by everyone" 
    ON profiles FOR SELECT USING (true);

CREATE POLICY "Repositories are viewable by everyone" 
    ON repositories FOR SELECT USING (true);

CREATE POLICY "Scans are viewable by everyone" 
    ON scans FOR SELECT USING (true);

CREATE POLICY "Vulnerabilities catalog is viewable by everyone" 
    ON vulnerabilities FOR SELECT USING (true);

CREATE POLICY "Scan vulnerabilities are viewable by everyone" 
    ON scan_vulnerabilities FOR SELECT USING (true);

-- Insert/Update/Delete policies for backend service role (full access)
-- Note: Supabase service_role key automatically bypasses RLS, but these explicit policies allow authenticated admin/service usage as well.
CREATE POLICY "Service role can manage repositories"
    ON repositories FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage scans"
    ON scans FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage vulnerabilities"
    ON vulnerabilities FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage scan vulnerabilities"
    ON scan_vulnerabilities FOR ALL USING (auth.role() = 'service_role');

-- ==============================================================================
-- Migration Complete!
-- ==============================================================================
