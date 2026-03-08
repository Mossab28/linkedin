// ============================================================
// LinkBoost Database Types
// ============================================================

// -- Enums --

export type ExperienceLevel =
  | "stage"
  | "alternance"
  | "junior"
  | "intermediaire"
  | "senior";

export type RemotePreference = "on_site" | "remote" | "hybrid" | "flexible";

export type ApplicationStatus =
  | "draft"
  | "sent"
  | "pending"
  | "interview"
  | "follow_up"
  | "rejected"
  | "accepted"
  | "withdrawn";

export type MessageType =
  | "cold_outreach"
  | "job_response"
  | "follow_up"
  | "thank_you";

export type MessageTone =
  | "professional"
  | "casual"
  | "enthusiastic"
  | "concise";

// -- Tables --

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  current_title: string | null;
  experience_level: ExperienceLevel;
  education: string | null;
  skills: string[];
  linkedin_url: string | null;
  bio: string | null;
  city: string | null;
  country: string;
  remote_preference: RemotePreference;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface SearchProfile {
  id: string;
  user_id: string;
  name: string;
  keywords: string[];
  job_titles: string[];
  locations: string[];
  remote_preference: RemotePreference | null;
  experience_level: ExperienceLevel | null;
  salary_min: number | null;
  salary_max: number | null;
  contract_types: string[];
  industries: string[];
  company_sizes: string[];
  is_active: boolean;
  last_searched_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedJob {
  id: string;
  user_id: string;
  search_profile_id: string | null;
  external_id: string;
  source: string;
  title: string;
  company_name: string;
  company_logo_url: string | null;
  location: string | null;
  remote_type: RemotePreference | null;
  description: string | null;
  salary_range: string | null;
  job_url: string;
  posted_at: string | null;
  expires_at: string | null;
  match_score: number | null;
  is_bookmarked: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  saved_job_id: string | null;
  company_name: string;
  job_title: string;
  job_url: string | null;
  status: ApplicationStatus;
  applied_at: string | null;
  response_at: string | null;
  interview_date: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_linkedin: string | null;
  cover_letter: string | null;
  notes: string | null;
  follow_up_count: number;
  last_follow_up_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeneratedMessage {
  id: string;
  user_id: string;
  application_id: string | null;
  message_type: MessageType;
  tone: MessageTone;
  recipient_name: string | null;
  recipient_title: string | null;
  company_name: string | null;
  job_title: string | null;
  context: string | null;
  generated_content: string;
  edited_content: string | null;
  is_used: boolean;
  ai_model: string;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  search_frequency: string;
  preferred_language: string;
  default_tone: MessageTone;
  auto_follow_up: boolean;
  follow_up_delay_days: number;
  theme: "light" | "dark" | "system";
  created_at: string;
  updated_at: string;
}

// -- Dashboard Stats --

export interface DashboardStats {
  total_applications: number;
  applications_by_status: Record<ApplicationStatus, number>;
  total_saved_jobs: number;
  total_messages: number;
  active_search_profiles: number;
  recent_applications: Application[];
  weekly_application_count: number;
}
