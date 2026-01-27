# Mentorship Platform - MVP Starter Code & Project Structure

## PROJECT FOLDER STRUCTURE

```
mentorship-platform/
├── frontend/                          # Next.js 15 App
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx     # Mentor & Seeker dashboard
│   │   │   ├── profile/page.tsx       # Profile editor
│   │   │   ├── bookings/page.tsx      # Booking history
│   │   │   └── layout.tsx
│   │   ├── mentors/
│   │   │   ├── page.tsx               # Mentor discovery page
│   │   │   ├── [id]/page.tsx          # Mentor detail page
│   │   │   └── search/page.tsx        # Advanced search
│   │   ├── booking/
│   │   │   ├── [mentorId]/page.tsx    # Booking flow
│   │   │   └── confirmation/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx                   # Landing page
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── MentorCard.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── CalendarPicker.tsx
│   │   ├── PaymentForm.tsx
│   │   └── ReviewForm.tsx
│   ├── lib/
│   │   ├── supabase.ts                # Supabase client
│   │   ├── stripe.ts                  # Stripe integration
│   │   ├── api-client.ts              # API calls
│   │   └── hooks.ts                   # Custom React hooks
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useMentors.ts
│   │   ├── useBooking.ts
│   │   └── useUser.ts
│   ├── store/
│   │   └── appStore.ts                # Zustand store
│   ├── types/
│   │   └── index.ts
│   ├── .env.local
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── next.config.ts
├── backend/
│   ├── supabase/
│   │   ├── migrations/
│   │   │   └── 001_initial_schema.sql
│   │   └── functions/
│   │       ├── embed_mentor_bio.ts    # Generate embeddings
│   │       ├── process_payment.ts
│   │       └── send_email.ts
│   └── cloudflare-workers/
│       ├── rate-limiter.ts
│       └── image-optimizer.ts
├── README.md
├── docker-compose.yml
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## 1. KEY CONFIGURATION FILES

### `.env.local` (Frontend)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# LinkedIn OAuth
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your-client-id
LINKEDIN_CLIENT_SECRET=your-client-secret

# OpenAI (for embeddings)
OPENAI_API_KEY=sk-...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 2. CORE TYPESCRIPT TYPES

### `lib/types/index.ts`

```typescript
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
```

---

## 3. SUPABASE CLIENT SETUP

### `lib/supabase.ts`

```typescript
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
export const searchMentors = async (filters: MentorFilter) => {
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
```

---

## 4. STRIPE INTEGRATION

### `lib/stripe.ts`

```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || '',
  {
    apiVersion: '2024-04-10',
  }
);

// Create payment intent
export const createPaymentIntent = async (
  amountCents: number,
  mentorId: string,
  bookingId: string,
  userEmail: string
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      payment_method_types: ['card'],
      description: `Mentorship Session with ${mentorId}`,
      metadata: {
        booking_id: bookingId,
        mentor_id: mentorId,
      },
      receipt_email: userEmail,
    });

    return paymentIntent;
  } catch (error) {
    console.error('Stripe error:', error);
    throw error;
  }
};

// Confirm payment intent
export const confirmPaymentIntent = async (
  paymentIntentId: string,
  paymentMethodId: string
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(
      paymentIntentId,
      {
        payment_method: paymentMethodId,
      }
    );

    return paymentIntent;
  } catch (error) {
    console.error('Stripe confirm error:', error);
    throw error;
  }
};

// Retrieve payment intent
export const getPaymentIntent = async (paymentIntentId: string) => {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
};
```

---

## 5. CUSTOM REACT HOOKS

### `hooks/useAuth.ts`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        setUser(userData);
      }
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(userData);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  return { user, loading, logout };
};
```

### `hooks/useMentors.ts`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { searchMentors } from '@/lib/supabase';
import type { MentorProfile, MentorFilter } from '@/types';

export const useMentors = (filters: MentorFilter) => {
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err, count: totalCount } = await searchMentors(filters);
        if (err) throw err;
        setMentors(data || []);
        setCount(totalCount || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching mentors');
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [filters]);

  return { mentors, loading, error, count };
};
```

---

## 6. ZUSTAND STATE MANAGEMENT

### `store/appStore.ts`

```typescript
import { create } from 'zustand';
import type { MentorFilter } from '@/types';

interface AppState {
  // Filters
  mentorFilters: MentorFilter;
  setMentorFilters: (filters: MentorFilter) => void;
  
  // Booking
  selectedMentorId: string | null;
  setSelectedMentorId: (id: string | null) => void;
  selectedServiceId: string | null;
  setSelectedServiceId: (id: string | null) => void;
  selectedDateTime: string | null;
  setSelectedDateTime: (dt: string | null) => void;
  
  // UI
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mentorFilters: {},
  setMentorFilters: (filters) => set({ mentorFilters: filters }),
  
  selectedMentorId: null,
  setSelectedMentorId: (id) => set({ selectedMentorId: id }),
  
  selectedServiceId: null,
  setSelectedServiceId: (id) => set({ selectedServiceId: id }),
  
  selectedDateTime: null,
  setSelectedDateTime: (dt) => set({ selectedDateTime: dt }),
  
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
```

---

## 7. QUICK START

### Install & Setup

```bash
# Clone repository
git clone <repo-url>
cd mentorship-platform/frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Fill in your Supabase & Stripe keys

# Setup Supabase
npx supabase link --project-ref your-project-ref
npx supabase migration up

# Run dev server
npm run dev

# Open http://localhost:3000
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# STRIPE_SECRET_KEY
# etc.
```

---

## 8. NEXT STEPS

1. **Frontend Components**: Build UI components (MentorCard, FilterSidebar, CalendarPicker, PaymentForm)
2. **API Routes**: Create `/api/mentors`, `/api/bookings`, `/api/payments` endpoints
3. **Database Migrations**: Set up Supabase schema with migrations
4. **Testing**: Unit tests with Jest, E2E tests with Playwright
5. **Mobile App**: React Native with Expo for iOS/Android
6. **Deployment**: Set up CI/CD with GitHub Actions

---

## 9. FOLDER SETUP ONE-LINER

```bash
# Create complete folder structure
mkdir -p frontend/{app/{auth,dashboard,mentors,booking},components,lib/types,hooks,store,public} backend/{supabase/migrations,cloudflare-workers} && \
touch frontend/app/layout.tsx frontend/app/page.tsx frontend/lib/supabase.ts frontend/lib/types/index.ts frontend/hooks/useAuth.ts frontend/store/appStore.ts backend/supabase/migrations/001_initial_schema.sql
```

