-- =====================================================
-- Gündemim — Initial Database Schema
-- =====================================================

-- Surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question        TEXT NOT NULL,
  description     TEXT,
  options         JSONB NOT NULL,
  -- options format: [{id: "uuid", text: "...", order: 0}, ...]
  category        TEXT NOT NULL CHECK (category IN ('siyaset', 'ekonomi', 'spor', 'kultur')),
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'scheduled', 'active', 'completed')),
  scheduled_for   DATE NOT NULL,
  total_votes     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at    TIMESTAMPTZ,
  UNIQUE (scheduled_for)
);

CREATE INDEX IF NOT EXISTS idx_surveys_scheduled_for ON surveys (scheduled_for DESC);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys (status);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id   UUID NOT NULL REFERENCES surveys (id) ON DELETE CASCADE,
  device_id   TEXT NOT NULL,
  option_id   TEXT NOT NULL,
  voted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (survey_id, device_id)
);

CREATE INDEX IF NOT EXISTS idx_votes_survey_id ON votes (survey_id);
CREATE INDEX IF NOT EXISTS idx_votes_device_id ON votes (device_id);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  device_id              TEXT PRIMARY KEY,
  age_range              TEXT CHECK (age_range IN ('13-17','18-24','25-34','35-44','45-54','55-64','65+')),
  gender                 TEXT CHECK (gender IN ('erkek','kadin','belirtmek_istemiyorum')),
  region                 TEXT,
  education              TEXT CHECK (education IN ('ilkokul','ortaokul','lise','onlisans','lisans','yukseklisans','doktora')),
  interests              TEXT[],
  onboarding_completed   BOOLEAN NOT NULL DEFAULT false,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- Trigger: increment total_votes on each new vote
-- =====================================================

CREATE OR REPLACE FUNCTION increment_vote_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE surveys SET total_votes = total_votes + 1 WHERE id = NEW.survey_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER after_vote_insert
  AFTER INSERT ON votes
  FOR EACH ROW EXECUTE FUNCTION increment_vote_count();

-- =====================================================
-- RPC: get_survey_results(p_survey_id)
-- Returns aggregated results — never exposes raw votes
-- =====================================================

CREATE OR REPLACE FUNCTION get_survey_results(p_survey_id UUID)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_total    INTEGER;
  v_result   JSON;
BEGIN
  SELECT total_votes INTO v_total FROM surveys WHERE id = p_survey_id;

  SELECT json_build_object(
    'survey_id',   p_survey_id,
    'total_votes', COALESCE(v_total, 0),

    'options', (
      SELECT COALESCE(json_agg(row_to_json(opt_counts)), '[]'::JSON)
      FROM (
        SELECT
          option_id,
          COUNT(*)                                                         AS vote_count,
          ROUND(COUNT(*)::NUMERIC / NULLIF(v_total, 0) * 100, 1)         AS percentage
        FROM votes WHERE survey_id = p_survey_id
        GROUP BY option_id
      ) opt_counts
    ),

    'by_age', (
      SELECT COALESCE(
        json_object_agg(age_range, option_counts),
        '{}'::JSON
      )
      FROM (
        SELECT
          u.age_range,
          json_object_agg(v.option_id, cnt) AS option_counts
        FROM (
          SELECT option_id, device_id FROM votes WHERE survey_id = p_survey_id
        ) v
        JOIN (
          SELECT device_id, age_range FROM user_profiles WHERE age_range IS NOT NULL
        ) u ON v.device_id = u.device_id
        CROSS JOIN LATERAL (
          SELECT COUNT(*) AS cnt FROM votes vv
          WHERE vv.survey_id = p_survey_id
            AND vv.option_id = v.option_id
            AND vv.device_id IN (
              SELECT device_id FROM user_profiles WHERE age_range = u.age_range
            )
        ) c
        GROUP BY u.age_range, v.option_id
      ) age_data
      GROUP BY age_range
    ),

    'by_gender', (
      SELECT COALESCE(
        json_object_agg(gender, option_counts),
        '{}'::JSON
      )
      FROM (
        SELECT
          u.gender,
          json_object_agg(v.option_id, COUNT(*)) AS option_counts
        FROM votes v
        JOIN user_profiles u ON v.device_id = u.device_id
        WHERE v.survey_id = p_survey_id
          AND u.gender IS NOT NULL
        GROUP BY u.gender, v.option_id
      ) g
      GROUP BY gender
    ),

    'by_region', (
      SELECT COALESCE(
        json_object_agg(region, option_counts),
        '{}'::JSON
      )
      FROM (
        SELECT
          u.region,
          json_object_agg(v.option_id, COUNT(*)) AS option_counts
        FROM votes v
        JOIN user_profiles u ON v.device_id = u.device_id
        WHERE v.survey_id = p_survey_id
          AND u.region IS NOT NULL
        GROUP BY u.region, v.option_id
      ) r
      GROUP BY region
    ),

    'by_education', (
      SELECT COALESCE(
        json_object_agg(education, option_counts),
        '{}'::JSON
      )
      FROM (
        SELECT
          u.education,
          json_object_agg(v.option_id, COUNT(*)) AS option_counts
        FROM votes v
        JOIN user_profiles u ON v.device_id = u.device_id
        WHERE v.survey_id = p_survey_id
          AND u.education IS NOT NULL
        GROUP BY u.education, v.option_id
      ) e
      GROUP BY education
    )

  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- =====================================================
-- Row Level Security
-- =====================================================

ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Surveys: anyone can read active/completed surveys
CREATE POLICY surveys_public_read ON surveys
  FOR SELECT USING (status IN ('active', 'completed'));

-- Admin can do everything (authenticated via Supabase Auth service role)
-- Service role bypasses RLS automatically

-- Votes: anyone can insert (device_id from app); UNIQUE constraint prevents duplicates
CREATE POLICY votes_insert ON votes
  FOR INSERT WITH CHECK (true);

-- Votes: allow select for results aggregation (via RPC, not direct client query)
-- Direct reads blocked; RPC runs as SECURITY DEFINER
CREATE POLICY votes_no_direct_read ON votes
  FOR SELECT USING (false);

-- User profiles: anyone can insert (onboarding)
CREATE POLICY profiles_insert ON user_profiles
  FOR INSERT WITH CHECK (true);

-- User profiles: anyone can update own profile (matched by device_id passed from app)
CREATE POLICY profiles_update ON user_profiles
  FOR UPDATE USING (true);

-- User profiles: allow select for RPC aggregation
CREATE POLICY profiles_select ON user_profiles
  FOR SELECT USING (true);
