-- SwimTrack Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;

-- Set search path to include public schema
SET search_path TO public, extensions;

-- Countries
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(3) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Regions (State/Department)
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clubs
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  country_id UUID REFERENCES countries(id),
  region_id UUID REFERENCES regions(id),
  city VARCHAR(100),
  address TEXT,
  logo_url TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  phone VARCHAR(20),
  date_of_birth DATE,
  country_id UUID REFERENCES countries(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Roles (many-to-many)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('club_admin', 'coach', 'swimmer', 'parent', 'spectator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, club_id, role)
);

-- Swimmers
CREATE TABLE swimmers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
  date_of_birth DATE,
  profile_visibility VARCHAR(20) DEFAULT 'club_private' CHECK (profile_visibility IN ('club_private', 'club_public', 'country', 'international')),
  is_minor BOOLEAN DEFAULT false,
  parent_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meets
CREATE TABLE meets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  club_id UUID REFERENCES clubs(id),
  country_id UUID REFERENCES countries(id),
  region_id UUID REFERENCES regions(id),
  city VARCHAR(100),
  venue VARCHAR(200),
  meet_date DATE NOT NULL,
  pool_type VARCHAR(10) NOT NULL CHECK (pool_type IN ('SCM', 'SCY', 'LCM')),
  level VARCHAR(20) CHECK (level IN ('club', 'local', 'regional', 'national', 'international')),
  federation VARCHAR(100),
  results_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events (stroke + distance + pool type)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  distance INTEGER NOT NULL,
  stroke VARCHAR(30) NOT NULL CHECK (stroke IN ('freestyle', 'backstroke', 'breaststroke', 'butterfly', 'individual_medley', 'relay')),
  pool_type VARCHAR(10) NOT NULL CHECK (pool_type IN ('SCM', 'SCY', 'LCM')),
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'mixed')),
  age_group_min INTEGER,
  age_group_max INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(distance, stroke, pool_type, gender)
);

-- Results
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swimmer_id UUID REFERENCES swimmers(id) ON DELETE CASCADE,
  meet_id UUID REFERENCES meets(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id),
  entry_time_ms INTEGER,
  official_time_ms INTEGER,
  is_pb BOOLEAN DEFAULT false,
  is_dq BOOLEAN DEFAULT false,
  dq_reason TEXT,
  is_relay BOOLEAN DEFAULT false,
  relay_position INTEGER,
  split_times JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time Trial Entries
CREATE TABLE time_trials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swimmer_id UUID REFERENCES swimmers(id) ON DELETE CASCADE,
  distance INTEGER NOT NULL,
  time_ms INTEGER NOT NULL,
  trial_date DATE NOT NULL,
  pool_type VARCHAR(10) NOT NULL CHECK (pool_type IN ('SCM', 'SCY', 'LCM')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Zone Pace Cards
CREATE TABLE pace_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swimmer_id UUID REFERENCES swimmers(id) ON DELETE CASCADE,
  css_sec_per_100 DECIMAL(6,2),
  a1_sec_per_100 DECIMAL(6,2),
  a2_sec_per_100 DECIMAL(6,2),
  a3_sec_per_100 DECIMAL(6,2),
  vo2_sec_per_100 DECIMAL(6,2),
  tolerance_sec_per_100 DECIMAL(6,2),
  all_out_sec_per_100 DECIMAL(6,2),
  pool_type VARCHAR(10),
  calculated_from_trial_id UUID REFERENCES time_trials(id),
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(swimmer_id, pool_type)
);

-- Import Templates
CREATE TABLE import_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  format VARCHAR(20) NOT NULL,
  column_mapping JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE swimmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE meets ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE pace_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_templates ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Swimmer policies
CREATE POLICY "Club members can view swimmers" ON swimmers FOR SELECT 
  USING (club_id IN (SELECT club_id FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "Coaches can manage swimmers" ON swimmers FOR ALL 
  USING (club_id IN (SELECT club_id FROM user_roles WHERE user_id = auth.uid() AND role IN ('club_admin', 'coach')));

-- Results policies
CREATE POLICY "View results" ON results FOR SELECT 
  USING (swimmer_id IN (SELECT id FROM swimmers WHERE club_id IN (SELECT club_id FROM user_roles WHERE user_id = auth.uid())));
CREATE POLICY "Coaches can manage results" ON results FOR ALL 
  USING (swimmer_id IN (SELECT id FROM swimmers WHERE club_id IN (SELECT club_id FROM user_roles WHERE user_id = auth.uid() AND role IN ('club_admin', 'coach'))));

-- Public leaderboard view
CREATE VIEW public_leaderboard AS
SELECT 
  s.id as swimmer_id,
  s.first_name || ' ' || s.last_name as swimmer_name,
  s.date_of_birth,
  c.name as club_name,
  c.id as club_id,
  r.official_time_ms as time_ms,
  e.distance,
  e.stroke,
  e.pool_type,
  m.name as meet_name,
  m.meet_date,
  m.results_verified
FROM results r
JOIN swimmers s ON r.swimmer_id = s.id
JOIN events e ON r.event_id = e.id
JOIN meets m ON r.meet_id = m.id
JOIN clubs c ON s.club_id = c.id
WHERE s.profile_visibility IN ('club_public', 'country', 'international')
  AND r.official_time_ms IS NOT NULL
  AND r.is_dq = false
  AND m.results_verified = true;

-- Personal Best view
CREATE VIEW personal_bests AS
WITH ranked_results AS (
  SELECT 
    r.swimmer_id,
    r.event_id,
    r.official_time_ms,
    m.meet_date,
    m.name as meet_name,
    ROW_NUMBER() OVER (PARTITION BY r.swimmer_id, e.distance, e.stroke, e.pool_type ORDER BY r.official_time_ms ASC) as rn
  FROM results r
  JOIN events e ON r.event_id = e.id
  JOIN meets m ON r.meet_id = m.id
  WHERE r.official_time_ms IS NOT NULL AND r.is_dq = false
)
SELECT * FROM ranked_results WHERE rn = 1;

-- Indexes for performance
CREATE INDEX idx_results_swimmer ON results(swimmer_id);
CREATE INDEX idx_results_meet ON results(meet_id);
CREATE INDEX idx_results_event ON results(event_id);
CREATE INDEX idx_results_time ON results(official_time_ms);
CREATE INDEX idx_swimmers_club ON swimmers(club_id);
CREATE INDEX idx_meets_date ON meets(meet_date);
CREATE INDEX idx_time_trials_swimmer ON time_trials(swimmer_id);
CREATE INDEX idx_pace_cards_swimmer ON pace_cards(swimmer_id);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clubs_updated_at BEFORE UPDATE ON clubs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER meets_updated_at BEFORE UPDATE ON meets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER swimmers_updated_at BEFORE UPDATE ON swimmers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Insert default countries
INSERT INTO countries (name, code) VALUES
  ('Colombia', 'CO'),
  ('United States', 'US'),
  ('Spain', 'ES'),
  ('Mexico', 'MX'),
  ('Argentina', 'AR'),
  ('Brazil', 'BR'),
  ('United Kingdom', 'GB'),
  ('Australia', 'AU'),
  ('France', 'FR'),
  ('Germany', 'DE')
ON CONFLICT (code) DO NOTHING;