import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  }
);

// Helper: Get current session
export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

// Helper: Sign in with LinkedIn
export const signInWithLinkedIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
  return { data, error };
};

// Helper: Get current user
export const getCurrentUser = async () => {
  const session = await getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return { data, error };
};

// Helper: Get mentor profile
export const getMentorProfile = async (mentorId: string) => {
  const { data, error } = await supabase
    .from('mentor_profiles')
    .select(`
      *,
      user:users(*),
      services:mentor_services(*),
      reviews:reviews(*)
    `)
    .eq('id', mentorId)
    .single();

  return { data, error };
};

// Helper: Search mentors with filters
export const searchMentors = async (filters: any) => {
  let query = supabase
    .from('mentor_profiles')
    .select(`
      *,
      user:users(*),
      services:mentor_services(*),
      avg_rating
    `)
    .eq('is_available', true);

  // Apply filters
  if (filters.companies?.length) {
    query = query.in('company', filters.companies);
  }

  if (filters.jobTitles?.length) {
    query = query.in('job_title', filters.jobTitles);
  }

  if (filters.yearsOfExp?.min) {
    query = query.gte('years_of_experience', filters.yearsOfExp.min);
  }

  if (filters.yearsOfExp?.max) {
    query = query.lte('years_of_experience', filters.yearsOfExp.max);
  }

  if (filters.priceRange?.min) {
    query = query.gte('session_price', filters.priceRange.min * 100);
  }

  if (filters.priceRange?.max) {
    query = query.lte('session_price', filters.priceRange.max * 100);
  }

  if (filters.minRating) {
    query = query.gte('avg_rating', filters.minRating);
  }

  // Sorting
  if (filters.sortBy === 'rating') {
    query = query.order('avg_rating', { ascending: false });
  } else if (filters.sortBy === 'price') {
    query = query.order('session_price', { ascending: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  // Pagination
  const offset = ((filters.page || 1) - 1) * (filters.limit || 20);
  query = query.range(offset, offset + (filters.limit || 20) - 1);

  const { data, error, count } = await query;

  return { data, error, count };
};

// Helper: Create booking
export const createBooking = async (
  mentorId: string,
  seekerId: string,
  serviceId: string,
  scheduledAt: string,
  amountCents: number,
  notes?: string
) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        mentor_id: mentorId,
        seeker_id: seekerId,
        service_id: serviceId,
        scheduled_at: scheduledAt,
        status: 'pending',
        amount_cents: amountCents,
        notes,
      },
    ])
    .select()
    .single();

  return { data, error };
};

// Helper: Update booking status
export const updateBookingStatus = async (
  bookingId: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  zoomLink?: string
) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      status,
      ...(zoomLink && { zoom_link: zoomLink }),
    })
    .eq('id', bookingId)
    .select()
    .single();

  return { data, error };
};
