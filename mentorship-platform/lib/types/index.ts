export type UserRole = 'mentor' | 'seeker' | 'both';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  bio: string | null;
  linkedin_id: string | null;
  role: UserRole;
  verified: boolean;
  created_at: string;
}

export interface MentorProfile {
  id: string;
  user_id: string;
  headline: string;
  company: string;
  job_title: string;
  years_of_experience: number;
  bio: string;
  expertise_tags: string[];
  avg_rating: number;
  total_sessions: number;
  session_price: number; // in cents
  is_available: boolean;
  user?: User;
  services?: MentorService[];
  reviews?: Review[];
}

export interface MentorService {
  id: string;
  mentor_id: string;
  service_type: 'resume_review' | 'mock_interview' | 'career_guidance' | 'certification_prep' | 'project_review' | 'other';
  description: string;
  duration_minutes: number;
  price_override: number | null;
  is_active: boolean;
}

export interface AvailabilitySlot {
  id: string;
  mentor_id: string;
  day_of_week: number; // 0-6
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  timezone: string;
  is_active: boolean;
}

export interface Booking {
  id: string;
  mentor_id: string;
  seeker_id: string;
  service_id: string;
  scheduled_at: string; // ISO 8601
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  zoom_link: string | null;
  amount_cents: number;
  stripe_payment_intent_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  seeker_id: string;
  mentor_id: string;
  rating: number; // 1-5
  review_text: string;
  created_at: string;
}

export interface MentorFilter {
  searchQuery?: string;
  companies?: string[];
  jobTitles?: string[];
  yearsOfExp?: { min?: number; max?: number };
  services?: string[];
  priceRange?: { min?: number; max?: number };
  minRating?: number;
  timezone?: string;
  sortBy?: 'rating' | 'price' | 'recent' | 'popular';
  page?: number;
  limit?: number;
}
