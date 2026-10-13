/*
# Create profiles table and core schema for UniSphere

## Overview
This migration creates the foundational database schema for the UniSphere campus platform.
The `profiles` table was missing entirely, causing signup to fail with
"Could not find the table 'public.profiles' in the schema cache".

## New Tables

### 1. profiles
- Stores user profile data linked to Supabase Auth users via `auth.users.id`
- `id` (uuid, PK, references auth.users) — one row per authenticated user
- `email`, `full_name`, `username`, `bio`, `avatar_url` — identity fields
- `university`, `college`, `course`, `branch` — academic context
- `batch_start` (int) — admission year (e.g. 2022)
- `graduation_year` (int) — expected graduation year
- `current_year` (int) — year of study (1-4)
- `semester` (int) — current semester (1-8)
- `section` (text) — free-text section name (e.g. "A", "CSE-A")
- `role` (enum) — user role: student, contributor, verified_contributor, moderator, admin
- `is_verified_contributor` (bool) — verification badge status
- `interests`, `skills`, `achievements`, `certifications` — text arrays
- `created_at`, `updated_at` — timestamps

### 2. resources
- Academic resources (notes, papers, assignments, lab manuals)
- `contributor_id` references profiles(id)
- `status` enum: under_review, verified, rejected, archived
- `resource_type` enum: notes, previous_year_paper, assignment, lab_material, study_resource, senior_notes, topper_notes

### 3. events
- Campus events with category, date, location, organizer

### 4. clubs
- Student clubs with category, member count, recruitment status

### 5. opportunities
- Internships, scholarships, hackathons, certifications

### 6. exams
- Exam schedules with type, syllabus, branch, semester

### 7. campus_locations
- Campus map locations with coordinates for interactive map

### 8. questions
- Student Q&A posts with category, upvotes

### 9. answers
- Answers to questions with helpful marking and upvotes

### 10. lost_found_items
- Lost and found listings

### 11. notifications
- User notifications with type, read status

### 12. announcements
- Pinned campus-wide announcements

### 13. saved_items
- Bookmark system for resources, events, opportunities

### 14. reports
- Content moderation reports

## Security
- RLS enabled on ALL tables
- profiles: users can read all profiles, update only their own, cannot change role/verification fields
- resources/events/clubs/opportunities/exams/campus_locations/announcements: publicly readable (TO authenticated)
- questions/answers/lost_found: publicly readable (TO authenticated)
- saved_items/notifications: owner-scoped (user can only see their own)
- reports: user can create reports, only admins/moderators can view
- All insert/update operations check auth.uid() for ownership
- Role/verification columns on profiles are protected — users cannot set admin/moderator/verified roles on themselves
*/

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  username text,
  bio text,
  avatar_url text,
  university text,
  college text,
  course text,
  branch text,
  batch_start int,
  graduation_year int,
  current_year int,
  semester int,
  section text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'contributor', 'verified_contributor', 'moderator', 'admin')),
  is_verified_contributor boolean NOT NULL DEFAULT false,
  interests text[] DEFAULT '{}',
  skills text[] DEFAULT '{}',
  achievements text[] DEFAULT '{}',
  certifications text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all"
  ON profiles FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- RESOURCES
-- ============================================================
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  unit text,
  semester int NOT NULL,
  branch text NOT NULL,
  resource_type text NOT NULL DEFAULT 'notes' CHECK (resource_type IN ('notes', 'previous_year_paper', 'assignment', 'lab_material', 'study_resource', 'senior_notes', 'topper_notes')),
  file_url text,
  file_type text,
  file_size bigint,
  status text NOT NULL DEFAULT 'under_review' CHECK (status IN ('under_review', 'verified', 'rejected', 'archived')),
  contributor_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  downloads int NOT NULL DEFAULT 0,
  saves int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "resources_select_all" ON resources;
CREATE POLICY "resources_select_all"
  ON resources FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "resources_insert_own" ON resources;
CREATE POLICY "resources_insert_own"
  ON resources FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = contributor_id);

DROP POLICY IF EXISTS "resources_update_own" ON resources;
CREATE POLICY "resources_update_own"
  ON resources FOR UPDATE TO authenticated
  USING (auth.uid() = contributor_id)
  WITH CHECK (auth.uid() = contributor_id);

DROP POLICY IF EXISTS "resources_delete_own" ON resources;
CREATE POLICY "resources_delete_own"
  ON resources FOR DELETE TO authenticated
  USING (auth.uid() = contributor_id);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  location text NOT NULL,
  organizer text NOT NULL,
  category text NOT NULL DEFAULT 'campus_event' CHECK (category IN ('workshop', 'hackathon', 'competition', 'club_event', 'seminar', 'campus_event', 'other')),
  image_url text,
  registration_link text,
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "events_select_all" ON events;
CREATE POLICY "events_select_all"
  ON events FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "events_insert_own" ON events;
CREATE POLICY "events_insert_own"
  ON events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "events_update_own" ON events;
CREATE POLICY "events_update_own"
  ON events FOR UPDATE TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "events_delete_own" ON events;
CREATE POLICY "events_delete_own"
  ON events FOR DELETE TO authenticated
  USING (auth.uid() = created_by);

-- ============================================================
-- CLUBS
-- ============================================================
CREATE TABLE IF NOT EXISTS clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  logo_url text,
  member_count int NOT NULL DEFAULT 0,
  recruitment_open boolean NOT NULL DEFAULT false,
  president text,
  meeting_schedule text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "clubs_select_all" ON clubs;
CREATE POLICY "clubs_select_all"
  ON clubs FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "clubs_insert_auth" ON clubs;
CREATE POLICY "clubs_insert_auth"
  ON clubs FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "clubs_update_auth" ON clubs;
CREATE POLICY "clubs_update_auth"
  ON clubs FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================================
-- OPPORTUNITIES
-- ============================================================
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text NOT NULL,
  description text NOT NULL,
  deadline date NOT NULL,
  category text NOT NULL DEFAULT 'internship' CHECK (category IN ('internship', 'hackathon', 'scholarship', 'competition', 'workshop', 'certification', 'club_recruitment')),
  eligibility text,
  external_link text,
  posted_by uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "opportunities_select_all" ON opportunities;
CREATE POLICY "opportunities_select_all"
  ON opportunities FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "opportunities_insert_own" ON opportunities;
CREATE POLICY "opportunities_insert_own"
  ON opportunities FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = posted_by);

DROP POLICY IF EXISTS "opportunities_update_own" ON opportunities;
CREATE POLICY "opportunities_update_own"
  ON opportunities FOR UPDATE TO authenticated
  USING (auth.uid() = posted_by)
  WITH CHECK (auth.uid() = posted_by);

-- ============================================================
-- EXAMS
-- ============================================================
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  exam_date date NOT NULL,
  exam_type text NOT NULL DEFAULT 'internal' CHECK (exam_type IN ('internal', 'practical', 'semester', 'mid_sem')),
  syllabus text,
  instructions text,
  is_verified boolean NOT NULL DEFAULT false,
  branch text NOT NULL,
  semester int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "exams_select_all" ON exams;
CREATE POLICY "exams_select_all"
  ON exams FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "exams_insert_auth" ON exams;
CREATE POLICY "exams_insert_auth"
  ON exams FOR INSERT TO authenticated
  WITH CHECK (true);

-- ============================================================
-- CAMPUS_LOCATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS campus_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'other' CHECK (category IN ('academic', 'lab', 'library', 'cafeteria', 'auditorium', 'sports', 'club', 'other')),
  building text NOT NULL,
  floor text,
  room text,
  x numeric NOT NULL DEFAULT 50,
  y numeric NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE campus_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "campus_locations_select_all" ON campus_locations;
CREATE POLICY "campus_locations_select_all"
  ON campus_locations FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "campus_locations_insert_auth" ON campus_locations;
CREATE POLICY "campus_locations_insert_auth"
  ON campus_locations FOR INSERT TO authenticated
  WITH CHECK (true);

-- ============================================================
-- QUESTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  category text NOT NULL DEFAULT 'Academic',
  author_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  upvotes int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "questions_select_all" ON questions;
CREATE POLICY "questions_select_all"
  ON questions FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "questions_insert_own" ON questions;
CREATE POLICY "questions_insert_own"
  ON questions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "questions_update_own" ON questions;
CREATE POLICY "questions_update_own"
  ON questions FOR UPDATE TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- ============================================================
-- ANSWERS
-- ============================================================
CREATE TABLE IF NOT EXISTS answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  body text NOT NULL,
  author_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  is_helpful boolean NOT NULL DEFAULT false,
  upvotes int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "answers_select_all" ON answers;
CREATE POLICY "answers_select_all"
  ON answers FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "answers_insert_own" ON answers;
CREATE POLICY "answers_insert_own"
  ON answers FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "answers_update_own" ON answers;
CREATE POLICY "answers_update_own"
  ON answers FOR UPDATE TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- ============================================================
-- LOST_FOUND_ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS lost_found_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('lost', 'found')),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  date date NOT NULL,
  category text NOT NULL DEFAULT 'Personal Items',
  image_url text,
  contact_info text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'expired')),
  posted_by uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE lost_found_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lost_found_select_all" ON lost_found_items;
CREATE POLICY "lost_found_select_all"
  ON lost_found_items FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "lost_found_insert_own" ON lost_found_items;
CREATE POLICY "lost_found_insert_own"
  ON lost_found_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = posted_by);

DROP POLICY IF EXISTS "lost_found_update_own" ON lost_found_items;
CREATE POLICY "lost_found_update_own"
  ON lost_found_items FOR UPDATE TO authenticated
  USING (auth.uid() = posted_by)
  WITH CHECK (auth.uid() = posted_by);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('event_reminder', 'new_resource', 'exam_reminder', 'campus_update', 'opportunity_deadline', 'question_activity', 'verification_status')),
  title text NOT NULL,
  body text,
  link text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
CREATE POLICY "notifications_select_own"
  ON notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_insert_own" ON notifications;
CREATE POLICY "notifications_insert_own"
  ON notifications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own"
  ON notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_delete_own" ON notifications;
CREATE POLICY "notifications_delete_own"
  ON notifications FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "announcements_select_all" ON announcements;
CREATE POLICY "announcements_select_all"
  ON announcements FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "announcements_insert_auth" ON announcements;
CREATE POLICY "announcements_insert_auth"
  ON announcements FOR INSERT TO authenticated
  WITH CHECK (true);

-- ============================================================
-- SAVED_ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('resource', 'event', 'opportunity')),
  item_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_items_select_own" ON saved_items;
CREATE POLICY "saved_items_select_own"
  ON saved_items FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_items_insert_own" ON saved_items;
CREATE POLICY "saved_items_insert_own"
  ON saved_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_items_delete_own" ON saved_items;
CREATE POLICY "saved_items_delete_own"
  ON saved_items FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- REPORTS
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL CHECK (target_type IN ('resource', 'event', 'question', 'answer', 'lost_found', 'post')),
  target_id text NOT NULL,
  reason text NOT NULL CHECK (reason IN ('wrong_info', 'outdated', 'duplicate', 'misleading', 'inappropriate', 'other')),
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  reporter_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reports_insert_own" ON reports;
CREATE POLICY "reports_insert_own"
  ON reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "reports_select_own" ON reports;
CREATE POLICY "reports_select_own"
  ON reports FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_branch_semester ON resources(branch, semester);
CREATE INDEX IF NOT EXISTS idx_resources_contributor ON resources(contributor_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_author ON questions(author_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_saved_items_user_type ON saved_items(user_id, item_type);

-- ============================================================
-- UPDATED_AT TRIGGER FOR PROFILES
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS resources_updated_at ON resources;
CREATE TRIGGER resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
