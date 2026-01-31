import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/database';

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

// Helper: Search mentors with filters
export const searchMentors = async (filters: any) => {
  console.log('searchMentors called with filters:', filters);
  
  // Dummy data for testing
  const dummyData = [
    {
      id: '1',
      user_id: 'u1',
      headline: 'Senior Software Engineer at Google',
      company: 'Google',
      job_title: 'Senior Software Engineer',
      years_of_experience: 8,
      bio: 'I help developers level up their skills',
      expertise_tags: ['JavaScript', 'React', 'Node.js'],
      session_price: 10000,
      avg_rating: 4.8,
      total_sessions: 50,
      is_available: true,
      user: {
        id: 'u1',
        first_name: 'John',
        last_name: 'Doe',
        avatar_url: null,
        email: 'john@example.com',
        role: 'mentor' as const,
        verified: true,
        created_at: new Date().toISOString(),
        bio: null,
        linkedin_id: null
      },
      services: [
        { 
          id: 's1', 
          mentor_id: '1', 
          service_type: 'resume_review' as const, 
          description: 'Get feedback on your resume', 
          duration_minutes: 30, 
          price_override: null, 
          is_active: true 
        },
        { 
          id: 's2', 
          mentor_id: '1', 
          service_type: 'mock_interview' as const, 
          description: 'Practice coding interviews', 
          duration_minutes: 60, 
          price_override: null, 
          is_active: true 
        }
      ]
    },
    {
      id: '2',
      user_id: 'u2',
      headline: 'Product Manager at Microsoft',
      company: 'Microsoft',
      job_title: 'Product Manager',
      years_of_experience: 6,
      bio: 'I help product managers succeed',
      expertise_tags: ['Product Management', 'Agile', 'User Research'],
      session_price: 15000,
      avg_rating: 4.5,
      total_sessions: 30,
      is_available: true,
      user: {
        id: 'u2',
        first_name: 'Jane',
        last_name: 'Smith',
        avatar_url: null,
        email: 'jane@example.com',
        role: 'mentor' as const,
        verified: true,
        created_at: new Date().toISOString(),
        bio: null,
        linkedin_id: null
      },
      services: [
        { 
          id: 's3', 
          mentor_id: '2', 
          service_type: 'career_guidance' as const, 
          description: 'Plan your career path', 
          duration_minutes: 60, 
          price_override: null, 
          is_active: true 
        },
        { 
          id: 's4', 
          mentor_id: '2', 
          service_type: 'certification_prep' as const, 
          description: 'Learn product management', 
          duration_minutes: 90, 
          price_override: null, 
          is_active: true 
        }
      ]
    },
    {
      id: '3',
      user_id: 'u3',
      headline: 'Data Scientist at Amazon',
      company: 'Amazon',
      job_title: 'Data Scientist',
      years_of_experience: 5,
      bio: 'I help data scientists excel',
      expertise_tags: ['Machine Learning', 'Data Analysis', 'Python'],
      session_price: 12000,
      avg_rating: 4.7,
      total_sessions: 40,
      is_available: true,
      user: {
        id: 'u3',
        first_name: 'Bob',
        last_name: 'Johnson',
        avatar_url: null,
        email: 'bob@example.com',
        role: 'mentor' as const,
        verified: true,
        created_at: new Date().toISOString(),
        bio: null,
        linkedin_id: null
      },
      services: [
        { 
          id: 's5', 
          mentor_id: '3', 
          service_type: 'project_review' as const, 
          description: 'Learn ML concepts', 
          duration_minutes: 60, 
          price_override: null, 
          is_active: true 
        },
        { 
          id: 's6', 
          mentor_id: '3', 
          service_type: 'other' as const, 
          description: 'Master data visualization', 
          duration_minutes: 30, 
          price_override: null, 
          is_active: true 
        }
      ]
    }
  ];

  await new Promise(resolve => setTimeout(resolve, 500));

  console.log('searchMentors returning:', { 
    data: dummyData, 
    error: null, 
    count: dummyData.length 
  });

  return { 
    data: dummyData, 
    error: null, 
    count: dummyData.length 
  };
};

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
