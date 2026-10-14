-- ============================================================
-- FIX: Auto-create profile on signup via trigger
-- Root cause: When email confirmation is enabled, signUp() does
-- not establish a session. The app-side INSERT into profiles
-- fails because auth.uid() is NULL (RLS blocks it).
-- Solution: A SECURITY DEFINER trigger creates the profile
-- immediately when the auth.users row is created, using the
-- metadata passed to signUp().
-- ============================================================

-- Drop existing trigger/function if present
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create a function that inserts a profile row from auth metadata
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role text := 'student';
  v_batch int;
  v_year int;
  v_sem int;
BEGIN
  -- Parse numeric metadata fields safely
  v_batch := NULLIF(NEW.raw_user_meta_data->>'batch', '')::int;
  v_year := NULLIF(NEW.raw_user_meta_data->>'year', '')::int;
  v_sem := NULLIF(NEW.raw_user_meta_data->>'semester', '')::int;

  -- Never trust client-provided role — always force 'student'
  INSERT INTO profiles (
    id,
    email,
    full_name,
    course,
    branch,
    batch_start,
    current_year,
    semester,
    section,
    role,
    is_verified_contributor,
    interests,
    skills,
    achievements,
    certifications
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Student'),
    NEW.raw_user_meta_data->>'course',
    NEW.raw_user_meta_data->>'branch',
    v_batch,
    v_year,
    v_sem,
    NULLIF(TRIM(NEW.raw_user_meta_data->>'section'), ''),
    v_role,
    false,
    '{}'::text[],
    '{}'::text[],
    '{}'::text[],
    '{}'::text[]
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: fires when a new auth.users row is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- FIX: Recovery for existing users who log in without a profile
-- The trigger above handles NEW signups. For existing auth users
-- whose profile insert failed previously, we add an idempotent
-- upsert function that the app can call after login.
-- ============================================================
CREATE OR REPLACE FUNCTION ensure_profile_exists()
RETURNS void AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role, is_verified_contributor)
  SELECT
    auth.uid(),
    auth.jwt() ->>'email',
    COALESCE((auth.jwt() ->>'user_metadata') ->> 'full_name', 'Student'),
    'student',
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FIX: Tighten overly permissive RLS policies
-- clubs, exams, announcements, campus_locations had
-- WITH CHECK (true) which lets any user insert/modify
-- ============================================================

-- Clubs: restrict insert/update to admins and moderators
DROP POLICY IF EXISTS "clubs_insert_auth" ON clubs;
CREATE POLICY "clubs_insert_auth"
  ON clubs FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  );

DROP POLICY IF EXISTS "clubs_update_auth" ON clubs;
CREATE POLICY "clubs_update_auth"
  ON clubs FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  );

-- Add delete policy for clubs (admin/mod only)
DROP POLICY IF EXISTS "clubs_delete_admin" ON clubs;
CREATE POLICY "clubs_delete_admin"
  ON clubs FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  );

-- Exams: restrict insert to admins and moderators
DROP POLICY IF EXISTS "exams_insert_auth" ON exams;
CREATE POLICY "exams_insert_auth"
  ON exams FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  );

-- Add update + delete for exams (admin/mod)
DROP POLICY IF EXISTS "exams_update_admin" ON exams;
CREATE POLICY "exams_update_admin"
  ON exams FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  );

DROP POLICY IF EXISTS "exams_delete_admin" ON exams;
CREATE POLICY "exams_delete_admin"
  ON exams FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  );

-- Announcements: restrict insert to admins and moderators
DROP POLICY IF EXISTS "announcements_insert_auth" ON announcements;
CREATE POLICY "announcements_insert_auth"
  ON announcements FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  );

-- Add update + delete for announcements (admin/mod)
DROP POLICY IF EXISTS "announcements_update_admin" ON announcements;
CREATE POLICY "announcements_update_admin"
  ON announcements FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  );

DROP POLICY IF EXISTS "announcements_delete_admin" ON announcements;
CREATE POLICY "announcements_delete_admin"
  ON announcements FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  );

-- Campus locations: restrict insert to admins and moderators
DROP POLICY IF EXISTS "campus_locations_insert_auth" ON campus_locations;
CREATE POLICY "campus_locations_insert_auth"
  ON campus_locations FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  );

-- Add update + delete for campus locations (admin/mod)
DROP POLICY IF EXISTS "campus_locations_update_admin" ON campus_locations;
CREATE POLICY "campus_locations_update_admin"
  ON campus_locations FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  );

DROP POLICY IF EXISTS "campus_locations_delete_admin" ON campus_locations;
CREATE POLICY "campus_locations_delete_admin"
  ON campus_locations FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  );

-- Opportunities: add delete policy (owner only)
DROP POLICY IF EXISTS "opportunities_delete_own" ON opportunities;
CREATE POLICY "opportunities_delete_own"
  ON opportunities FOR DELETE TO authenticated
  USING (auth.uid() = posted_by);

-- Events: already have proper owner-scoped CRUD, good.

-- Resources: add delete already exists, good.

-- ============================================================
-- FIX: Profiles update policy must prevent role/verification
-- self-elevation. Add a RESTRICTIVE check.
-- ============================================================
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Users cannot change their own role or verification status
    AND role = (
      SELECT p.role FROM profiles p WHERE p.id = auth.uid()
    )
    AND is_verified_contributor = (
      SELECT p.is_verified_contributor FROM profiles p WHERE p.id = auth.uid()
    )
  );

-- ============================================================
-- FIX: Add profiles_delete_own (user can delete own profile)
-- ============================================================
DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;
CREATE POLICY "profiles_delete_own"
  ON profiles FOR DELETE TO authenticated
  USING (auth.uid() = id);

-- ============================================================
-- FIX: Add reports select for admins/moderators
-- ============================================================
DROP POLICY IF EXISTS "reports_select_own" ON reports;
CREATE POLICY "reports_select_own"
  ON reports FOR SELECT TO authenticated
  USING (
    auth.uid() = reporter_id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  );

-- Add reports update (admin/mod only, for status changes)
DROP POLICY IF EXISTS "reports_update_admin" ON reports;
CREATE POLICY "reports_update_admin"
  ON reports FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'moderator')
    )
  );
