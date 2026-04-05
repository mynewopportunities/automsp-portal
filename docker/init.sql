-- AutoMSP Portal — Internal PostgreSQL replica schema
-- Mirrors the Supabase auth.users + profiles structure

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'team', 'client')),
  team_section TEXT,
  client_notion_name TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Sync log for Supabase → internal PG replication events
CREATE TABLE IF NOT EXISTS sync_log (
  id          BIGSERIAL PRIMARY KEY,
  table_name  TEXT NOT NULL,
  operation   TEXT NOT NULL,
  record_id   UUID,
  synced_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed admin user (update email after deploy)
INSERT INTO profiles (email, full_name, role) VALUES
  ('moiz@automsp.us', 'Moiz Contractor', 'admin')
ON CONFLICT (email) DO NOTHING;
