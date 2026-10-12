// UniSphere — Core Type Definitions

export type UserRole = 'student' | 'contributor' | 'verified_contributor' | 'moderator' | 'admin';

export type ResourceStatus = 'under_review' | 'verified' | 'rejected' | 'archived';

export type ResourceType =
  | 'notes'
  | 'previous_year_paper'
  | 'assignment'
  | 'lab_material'
  | 'study_resource'
  | 'senior_notes'
  | 'topper_notes';

export type PostCategory =
  | 'event'
  | 'student_update'
  | 'club_update'
  | 'academic_resource'
  | 'opportunity'
  | 'campus_information';

export type SourceLabel =
  | 'Campus Update'
  | 'Student Update'
  | 'Club Update'
  | 'Verified Resource'
  | 'Verified Contributor'
  | 'Community Information';

export type EventCategory =
  | 'workshop'
  | 'hackathon'
  | 'competition'
  | 'club_event'
  | 'seminar'
  | 'campus_event'
  | 'other';

export type OpportunityCategory =
  | 'internship'
  | 'hackathon'
  | 'scholarship'
  | 'competition'
  | 'workshop'
  | 'certification'
  | 'club_recruitment';

export type LostFoundType = 'lost' | 'found';
export type LostFoundStatus = 'open' | 'resolved' | 'expired';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  university: string | null;
  college: string | null;
  course: string | null;
  branch: string | null;
  batch_start: number | null;
  graduation_year: number | null;
  current_year: number | null;
  semester: number | null;
  section: string | null;
  role: UserRole;
  is_verified_contributor: boolean;
  interests: string[];
  skills: string[];
  achievements: string[];
  certifications: string[];
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  unit: string | null;
  semester: number;
  branch: string;
  resource_type: ResourceType;
  file_url: string | null;
  file_type: string | null;
  file_size: number | null;
  status: ResourceStatus;
  contributor_id: string;
  contributor_name: string;
  contributor_verified: boolean;
  downloads: number;
  saves: number;
  created_at: string;
  updated_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: EventCategory;
  image_url: string | null;
  registration_link: string | null;
  is_saved: boolean;
  created_at: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  logo_url: string | null;
  member_count: number;
  recruitment_open: boolean;
  president: string | null;
  meeting_schedule: string | null;
  created_at: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  deadline: string;
  category: OpportunityCategory;
  eligibility: string;
  external_link: string | null;
  is_saved: boolean;
  created_at: string;
}

export interface Exam {
  id: string;
  title: string;
  exam_date: string;
  exam_type: 'internal' | 'practical' | 'semester' | 'mid_sem';
  syllabus: string | null;
  instructions: string | null;
  is_verified: boolean;
  branch: string;
  semester: number;
  created_at: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  description: string;
  category: 'academic' | 'lab' | 'library' | 'cafeteria' | 'auditorium' | 'sports' | 'club' | 'other';
  building: string;
  floor: string | null;
  room: string | null;
  x: number;
  y: number;
  created_at: string;
}

export interface Question {
  id: string;
  title: string;
  body: string;
  category: string;
  author_name: string;
  author_id: string;
  answers_count: number;
  upvotes: number;
  has_upvoted: boolean;
  created_at: string;
}

export interface Answer {
  id: string;
  question_id: string;
  body: string;
  author_name: string;
  author_id: string;
  is_helpful: boolean;
  upvotes: number;
  created_at: string;
}

export interface LostFoundItem {
  id: string;
  type: LostFoundType;
  title: string;
  description: string;
  location: string;
  date: string;
  category: string;
  image_url: string | null;
  contact_info: string;
  status: LostFoundStatus;
  created_at: string;
}

export interface Notification {
  id: string;
  type: 'event_reminder' | 'new_resource' | 'exam_reminder' | 'campus_update' | 'opportunity_deadline' | 'question_activity' | 'verification_status';
  title: string;
  body: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  is_pinned: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  target_type: 'resource' | 'event' | 'question' | 'answer' | 'lost_found' | 'post';
  target_id: string;
  reason: 'wrong_info' | 'outdated' | 'duplicate' | 'misleading' | 'inappropriate' | 'other';
  description: string | null;
  status: 'pending' | 'resolved' | 'dismissed';
  reporter_id: string;
  created_at: string;
}
