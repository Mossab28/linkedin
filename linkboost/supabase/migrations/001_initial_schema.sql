-- ============================================================
-- LinkBoost - Initial Database Schema
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE experience_level AS ENUM (
  'stage', 'alternance', 'junior', 'intermediaire', 'senior'
);

CREATE TYPE remote_preference AS ENUM (
  'on_site', 'remote', 'hybrid', 'flexible'
);

CREATE TYPE application_status AS ENUM (
  'draft', 'sent', 'pending', 'interview', 'follow_up',
  'rejected', 'accepted', 'withdrawn'
);

CREATE TYPE message_type AS ENUM (
  'cold_outreach', 'job_response', 'follow_up', 'thank_you'
);

CREATE TYPE message_tone AS ENUM (
  'professional', 'casual', 'enthusiastic', 'concise'
);

-- ============================================================
-- TABLES
-- ============================================================

-- 1. Users
CREATE TABLE public.users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  full_name     TEXT NOT NULL DEFAULT '',
  avatar_url    TEXT,
  current_title TEXT,
  experience_level experience_level NOT NULL DEFAULT 'junior',
  education     TEXT,
  skills        TEXT[] NOT NULL DEFAULT '{}',
  linkedin_url  TEXT,
  bio           TEXT,
  city          TEXT,
  country       TEXT NOT NULL DEFAULT 'France',
  remote_preference remote_preference NOT NULL DEFAULT 'flexible',
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Search Profiles
CREATE TABLE public.search_profiles (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  keywords          TEXT[] NOT NULL DEFAULT '{}',
  job_titles        TEXT[] NOT NULL DEFAULT '{}',
  locations         TEXT[] NOT NULL DEFAULT '{}',
  remote_preference remote_preference,
  experience_level  experience_level,
  salary_min        INTEGER,
  salary_max        INTEGER,
  contract_types    TEXT[] NOT NULL DEFAULT '{}',
  industries        TEXT[] NOT NULL DEFAULT '{}',
  company_sizes     TEXT[] NOT NULL DEFAULT '{}',
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  last_searched_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Saved Jobs
CREATE TABLE public.saved_jobs (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  search_profile_id UUID REFERENCES public.search_profiles(id) ON DELETE SET NULL,
  external_id       TEXT NOT NULL,
  source            TEXT NOT NULL,
  title             TEXT NOT NULL,
  company_name      TEXT NOT NULL,
  company_logo_url  TEXT,
  location          TEXT,
  remote_type       remote_preference,
  description       TEXT,
  salary_range      TEXT,
  job_url           TEXT NOT NULL,
  posted_at         TIMESTAMPTZ,
  expires_at        TIMESTAMPTZ,
  match_score       REAL,
  is_bookmarked     BOOLEAN NOT NULL DEFAULT FALSE,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, external_id, source)
);

-- 4. Applications
CREATE TABLE public.applications (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  saved_job_id      UUID REFERENCES public.saved_jobs(id) ON DELETE SET NULL,
  company_name      TEXT NOT NULL,
  job_title         TEXT NOT NULL,
  job_url           TEXT,
  status            application_status NOT NULL DEFAULT 'draft',
  applied_at        TIMESTAMPTZ,
  response_at       TIMESTAMPTZ,
  interview_date    TIMESTAMPTZ,
  contact_name      TEXT,
  contact_email     TEXT,
  contact_linkedin  TEXT,
  cover_letter      TEXT,
  notes             TEXT,
  follow_up_count   INTEGER NOT NULL DEFAULT 0,
  last_follow_up_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Generated Messages
CREATE TABLE public.generated_messages (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  application_id    UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  message_type      message_type NOT NULL,
  tone              message_tone NOT NULL DEFAULT 'professional',
  recipient_name    TEXT,
  recipient_title   TEXT,
  company_name      TEXT,
  job_title         TEXT,
  context           TEXT,
  generated_content TEXT NOT NULL,
  edited_content    TEXT,
  is_used           BOOLEAN NOT NULL DEFAULT FALSE,
  ai_model          TEXT NOT NULL DEFAULT 'gpt-4',
  prompt_tokens     INTEGER,
  completion_tokens INTEGER,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. User Preferences
CREATE TABLE public.user_preferences (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  email_notifications  BOOLEAN NOT NULL DEFAULT TRUE,
  search_frequency     TEXT NOT NULL DEFAULT 'daily',
  preferred_language   TEXT NOT NULL DEFAULT 'fr',
  default_tone         message_tone NOT NULL DEFAULT 'professional',
  auto_follow_up       BOOLEAN NOT NULL DEFAULT FALSE,
  follow_up_delay_days INTEGER NOT NULL DEFAULT 7,
  theme                TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_search_profiles_user_id ON public.search_profiles(user_id);
CREATE INDEX idx_saved_jobs_user_id ON public.saved_jobs(user_id);
CREATE INDEX idx_applications_user_id ON public.applications(user_id);
CREATE INDEX idx_applications_status ON public.applications(user_id, status);
CREATE INDEX idx_generated_messages_user_id ON public.generated_messages(user_id);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Users: can only access their own row
CREATE POLICY "own_data" ON public.users
  FOR ALL USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Search Profiles: can only access their own
CREATE POLICY "own_data" ON public.search_profiles
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Saved Jobs: can only access their own
CREATE POLICY "own_data" ON public.saved_jobs
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Applications: can only access their own
CREATE POLICY "own_data" ON public.applications
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Generated Messages: can only access their own
CREATE POLICY "own_data" ON public.generated_messages
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User Preferences: can only access their own
CREATE POLICY "own_data" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_search_profiles_updated_at
  BEFORE UPDATE ON public.search_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_saved_jobs_updated_at
  BEFORE UPDATE ON public.saved_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Handle new user signup: create profile + preferences
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL)
  );

  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- DASHBOARD STATS FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_applications', (
      SELECT COUNT(*) FROM public.applications WHERE user_id = p_user_id
    ),
    'applications_by_status', (
      SELECT COALESCE(
        json_object_agg(status, cnt),
        '{}'::json
      )
      FROM (
        SELECT status, COUNT(*) AS cnt
        FROM public.applications
        WHERE user_id = p_user_id
        GROUP BY status
      ) sub
    ),
    'total_saved_jobs', (
      SELECT COUNT(*) FROM public.saved_jobs WHERE user_id = p_user_id
    ),
    'total_messages', (
      SELECT COUNT(*) FROM public.generated_messages WHERE user_id = p_user_id
    ),
    'active_search_profiles', (
      SELECT COUNT(*) FROM public.search_profiles
      WHERE user_id = p_user_id AND is_active = TRUE
    ),
    'recent_applications', (
      SELECT COALESCE(
        json_agg(row_to_json(a) ORDER BY a.created_at DESC),
        '[]'::json
      )
      FROM (
        SELECT * FROM public.applications
        WHERE user_id = p_user_id
        ORDER BY created_at DESC
        LIMIT 5
      ) a
    ),
    'weekly_application_count', (
      SELECT COUNT(*) FROM public.applications
      WHERE user_id = p_user_id
        AND created_at >= NOW() - INTERVAL '7 days'
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
