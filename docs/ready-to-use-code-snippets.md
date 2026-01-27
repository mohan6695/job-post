# Key Components & Code Snippets - Ready to Use

## 1. MENTOR DISCOVERY PAGE (Next.js + React Query)

### `app/mentors/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilterSidebar } from '@/components/FilterSidebar';
import { MentorCard } from '@/components/MentorCard';
import { searchMentors } from '@/lib/supabase';
import type { MentorFilter } from '@/types';

export default function MentorsPage() {
  const [filters, setFilters] = useState<MentorFilter>({
    page: 1,
    limit: 20,
    sortBy: 'rating',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['mentors', filters],
    queryFn: () => searchMentors(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Find Your Mentor</h1>
          <p className="text-slate-600 mt-2">
            Connect with experienced professionals for guidance and growth
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <FilterSidebar 
              filters={filters} 
              onFiltersChange={setFilters}
            />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-slate-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                Failed to load mentors. Please try again.
              </div>
            ) : data?.data?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No mentors found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.data?.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {data?.count && data.count > filters.limit! && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setFilters(p => ({ ...p, page: Math.max(1, p.page! - 1) }))}
                  disabled={filters.page === 1}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {filters.page} of {Math.ceil(data.count / filters.limit!)}
                </span>
                <button
                  onClick={() => setFilters(p => ({ ...p, page: p.page! + 1 }))}
                  disabled={(filters.page! * filters.limit!) >= data.count}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
```

---

## 2. MENTOR CARD COMPONENT

### `components/MentorCard.tsx`

```typescript
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import type { MentorProfile } from '@/types';

interface MentorCardProps {
  mentor: MentorProfile;
}

export function MentorCard({ mentor }: MentorCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    // TODO: Implement save/wishlist functionality
    setIsSaved(!isSaved);
  };

  const price = (mentor.session_price / 100).toFixed(2);

  return (
    <Link href={`/mentors/${mentor.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
        {/* Header with avatar */}
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-teal-500">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white"
          >
            <Heart
              size={20}
              className={isSaved ? 'fill-red-500 text-red-500' : 'text-slate-400'}
            />
          </button>
        </div>

        {/* Avatar */}
        <div className="relative px-4 -mt-12 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-slate-200">
            {mentor.user?.avatar_url ? (
              <Image
                src={mentor.user.avatar_url}
                alt={mentor.user.first_name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-300 flex items-center justify-center">
                <span className="text-slate-600 font-bold text-lg">
                  {mentor.user?.first_name?.[0]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          {/* Name & Role */}
          <div className="mb-2">
            <h3 className="text-lg font-bold text-slate-900">
              {mentor.user?.first_name} {mentor.user?.last_name}
            </h3>
            <p className="text-sm text-slate-600">{mentor.headline}</p>
          </div>

          {/* Company & Experience */}
          <div className="flex gap-2 mb-3 text-xs text-slate-500">
            <span className="bg-slate-100 px-2 py-1 rounded">{mentor.company}</span>
            <span className="bg-slate-100 px-2 py-1 rounded">
              {mentor.years_of_experience} yrs exp
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(mentor.avg_rating) ? '⭐' : '☆'} />
              ))}
            </div>
            <span className="text-sm text-slate-600">
              {mentor.avg_rating.toFixed(1)} ({mentor.total_sessions} sessions)
            </span>
          </div>

          {/* Services */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {mentor.services?.slice(0, 3).map((service) => (
                <span
                  key={service.id}
                  className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {service.service_type.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-slate-900">${price}</span>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Book Session
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

---

## 3. FILTER SIDEBAR COMPONENT

### `components/FilterSidebar.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { MentorFilter } from '@/types';

interface FilterSidebarProps {
  filters: MentorFilter;
  onFiltersChange: (filters: MentorFilter) => void;
}

const COMPANIES = [
  'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple',
  'Tesla', 'Netflix', 'Uber', 'Stripe', 'Airbnb',
];

const SERVICE_TYPES = [
  { id: 'resume_review', label: 'Resume Review' },
  { id: 'mock_interview', label: 'Mock Interview' },
  { id: 'career_guidance', label: 'Career Guidance' },
  { id: 'certification_prep', label: 'Certification Prep' },
  { id: 'project_review', label: 'Project Review' },
];

const JOB_TITLES = [
  'Data Engineer', 'Software Engineer', 'Frontend Engineer',
  'Backend Engineer', 'Product Manager', 'DevOps Engineer',
  'Solutions Architect', 'Tech Lead',
];

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    company: true,
    service: true,
    experience: true,
    price: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(p => ({ ...p, [section]: !p[section] }));
  };

  const handleCompanyChange = (company: string) => {
    const newCompanies = filters.companies?.includes(company)
      ? filters.companies.filter(c => c !== company)
      : [...(filters.companies || []), company];
    onFiltersChange({ ...filters, companies: newCompanies, page: 1 });
  };

  const handleServiceChange = (service: string) => {
    const newServices = filters.services?.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...(filters.services || []), service];
    onFiltersChange({ ...filters, services: newServices, page: 1 });
  };

  const handlePriceChange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      priceRange: { min, max },
      page: 1,
    });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      minRating: filters.minRating === rating ? 0 : rating,
      page: 1,
    });
  };

  return (
    <div className="space-y-6 sticky top-4">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search mentors..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            onFiltersChange({ ...filters, searchQuery: e.target.value, page: 1 })
          }
        />
      </div>

      {/* Company Filter */}
      <div>
        <button
          onClick={() => toggleSection('company')}
          className="w-full flex justify-between items-center py-2 font-semibold text-slate-900 hover:text-slate-600"
        >
          Company
          <ChevronDown
            size={18}
            className={expandedSections.company ? 'rotate-180' : ''}
          />
        </button>
        {expandedSections.company && (
          <div className="mt-2 space-y-2">
            {COMPANIES.map((company) => (
              <label key={company} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.companies?.includes(company) || false}
                  onChange={() => handleCompanyChange(company)}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-slate-700 text-sm">{company}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Service Type Filter */}
      <div>
        <button
          onClick={() => toggleSection('service')}
          className="w-full flex justify-between items-center py-2 font-semibold text-slate-900 hover:text-slate-600"
        >
          Services
          <ChevronDown
            size={18}
            className={expandedSections.service ? 'rotate-180' : ''}
          />
        </button>
        {expandedSections.service && (
          <div className="mt-2 space-y-2">
            {SERVICE_TYPES.map((service) => (
              <label key={service.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.services?.includes(service.id) || false}
                  onChange={() => handleServiceChange(service.id)}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-slate-700 text-sm">{service.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Experience Filter */}
      <div>
        <button
          onClick={() => toggleSection('experience')}
          className="w-full flex justify-between items-center py-2 font-semibold text-slate-900 hover:text-slate-600"
        >
          Experience
          <ChevronDown
            size={18}
            className={expandedSections.experience ? 'rotate-180' : ''}
          />
        </button>
        {expandedSections.experience && (
          <div className="mt-2 space-y-2">
            {[
              { label: '0-2 years', min: 0, max: 2 },
              { label: '3-5 years', min: 3, max: 5 },
              { label: '5-10 years', min: 5, max: 10 },
              { label: '10+ years', min: 10, max: 50 },
            ].map(({ label, min, max }) => (
              <button
                key={label}
                onClick={() => handlePriceChange(min, max)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  filters.yearsOfExp?.min === min && filters.yearsOfExp?.max === max
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex justify-between items-center py-2 font-semibold text-slate-900 hover:text-slate-600"
        >
          Price/Session
          <ChevronDown
            size={18}
            className={expandedSections.price ? 'rotate-180' : ''}
          />
        </button>
        {expandedSections.price && (
          <div className="mt-2 space-y-2">
            {[
              { label: '$0 - $50', min: 0, max: 50 },
              { label: '$50 - $100', min: 50, max: 100 },
              { label: '$100 - $150', min: 100, max: 150 },
              { label: '$150+', min: 150, max: 10000 },
            ].map(({ label, min, max }) => (
              <button
                key={label}
                onClick={() => handlePriceChange(min, max)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  filters.priceRange?.min === min && filters.priceRange?.max === max
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div>
        <p className="font-semibold text-slate-900 py-2">Minimum Rating</p>
        <div className="space-y-2">
          {[5, 4, 3].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`w-full text-left px-3 py-2 rounded text-sm ${
                filters.minRating === rating
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-slate-100'
              }`}
            >
              {'⭐'.repeat(rating)} {rating}+ Stars
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => onFiltersChange({ page: 1, limit: 20, sortBy: 'rating' })}
        className="w-full px-4 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium"
      >
        Clear All Filters
      </button>
    </div>
  );
}
```

---

## 4. BOOKING FLOW - STEP 1: SERVICE SELECTION

### `app/booking/[mentorId]/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BookingStep1Props {
  params: { mentorId: string };
}

export default function BookingPage({ params }: BookingStep1Props) {
  const router = useRouter();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const { data: mentor, isLoading } = useQuery({
    queryKey: ['mentor', params.mentorId],
    queryFn: () => supabase
      .from('mentor_profiles')
      .select('*, services:mentor_services(*), user:users(*)')
      .eq('id', params.mentorId)
      .single(),
  });

  const handleNext = () => {
    if (!selectedServiceId) return;
    router.push(
      `/booking/${params.mentorId}?step=2&service=${selectedServiceId}`
    );
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!mentor) {
    return <div className="p-8">Mentor not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      {/* Header */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Mentor Info */}
      <div className="mb-8 p-4 bg-slate-50 rounded-lg">
        <h1 className="text-2xl font-bold">{mentor.user.first_name} {mentor.user.last_name}</h1>
        <p className="text-slate-600">{mentor.headline}</p>
      </div>

      {/* Services */}
      <div>
        <h2 className="text-xl font-bold mb-4">Select a Service</h2>
        <div className="space-y-3">
          {mentor.services?.map((service) => (
            <label
              key={service.id}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedServiceId === service.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="service"
                value={service.id}
                checked={selectedServiceId === service.id}
                onChange={() => setSelectedServiceId(service.id)}
                className="hidden"
              />
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {service.service_type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-slate-600 text-sm">{service.description}</p>
                  <p className="text-slate-600 text-sm mt-1">
                    {service.duration_minutes} minutes
                  </p>
                </div>
                <p className="font-bold text-lg">
                  ${((service.price_override || mentor.session_price) / 100).toFixed(2)}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!selectedServiceId}
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-lg transition-colors"
      >
        Continue to Calendar
      </button>
    </div>
  );
}
```

---

## 5. DATABASE MIGRATION TEMPLATE

### `supabase/migrations/001_initial_schema.sql`

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  linkedin_id VARCHAR(255) UNIQUE,
  linkedin_url VARCHAR(500),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  location VARCHAR(100),
  role VARCHAR(50) DEFAULT 'seeker' CHECK (role IN ('mentor', 'seeker', 'both')),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mentor profiles
CREATE TABLE mentor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  headline VARCHAR(200),
  company VARCHAR(100),
  job_title VARCHAR(100),
  years_of_experience INTEGER,
  bio TEXT,
  expertise_tags TEXT[],
  avg_rating DECIMAL(3, 2) DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  session_price INTEGER,
  bio_embedding VECTOR(1536),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mentor services
CREATE TABLE mentor_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES mentor_profiles(id) ON DELETE CASCADE,
  service_type VARCHAR(50) NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 30,
  price_override INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Availability slots
CREATE TABLE availability_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES mentor_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME,
  end_time TIME,
  timezone VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES mentor_profiles(id),
  seeker_id UUID NOT NULL REFERENCES users(id),
  service_id UUID NOT NULL REFERENCES mentor_services(id),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  zoom_link VARCHAR(500),
  google_calendar_event_id VARCHAR(255),
  amount_cents INTEGER,
  stripe_payment_intent_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  seeker_id UUID NOT NULL REFERENCES users(id),
  mentor_id UUID NOT NULL REFERENCES mentor_profiles(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES users(id),
  referred_user_id UUID REFERENCES users(id),
  referral_code VARCHAR(50) UNIQUE,
  discount_percent INTEGER DEFAULT 10,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved mentors
CREATE TABLE saved_mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seeker_id UUID NOT NULL REFERENCES users(id),
  mentor_id UUID NOT NULL REFERENCES mentor_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(seeker_id, mentor_id)
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  sender_id UUID NOT NULL REFERENCES users(id),
  receiver_id UUID NOT NULL REFERENCES users(id),
  message_text TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_mentor_profiles_bio_embedding ON mentor_profiles USING ivfflat (bio_embedding vector_cosine_ops);
CREATE INDEX idx_mentor_profiles_company ON mentor_profiles(company);
CREATE INDEX idx_mentor_profiles_job_title ON mentor_profiles(job_title);
CREATE INDEX idx_bookings_mentor_id ON bookings(mentor_id);
CREATE INDEX idx_bookings_seeker_id ON bookings(seeker_id);
CREATE INDEX idx_bookings_scheduled_at ON bookings(scheduled_at);
CREATE INDEX idx_messages_booking_id ON messages(booking_id);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);

-- Row level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Mentors can read their own profile" ON mentor_profiles
  FOR SELECT USING (user_id = auth.uid() OR is_available = TRUE);

CREATE POLICY "Mentors can update their own profile" ON mentor_profiles
  FOR UPDATE USING (user_id = auth.uid());
```

---

## 6. API ROUTE: Search Mentors

### `app/api/mentors/search/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const companies = searchParams.getAll('companies');
    const jobTitles = searchParams.getAll('jobTitles');
    const minRating = searchParams.get('minRating');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'rating';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabase
      .from('mentor_profiles')
      .select(`
        *,
        user:users(*),
        services:mentor_services(*),
        reviews:reviews(count)
      `)
      .eq('is_available', true);

    // Apply filters
    if (companies.length > 0) {
      query = query.in('company', companies);
    }

    if (jobTitles.length > 0) {
      query = query.in('job_title', jobTitles);
    }

    if (minRating) {
      query = query.gte('avg_rating', parseFloat(minRating));
    }

    if (minPrice) {
      query = query.gte('session_price', parseInt(minPrice) * 100);
    }

    if (maxPrice) {
      query = query.lte('session_price', parseInt(maxPrice) * 100);
    }

    // Sorting
    if (sortBy === 'price') {
      query = query.order('session_price', { ascending: true });
    } else if (sortBy === 'rating') {
      query = query.order('avg_rating', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Pagination
    const offset = (page - 1) * limit;
    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      count,
      page,
      limit,
    });
  } catch (error) {
    console.error('Search mentors error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search mentors' },
      { status: 500 }
    );
  }
}
```

---

## QUICK COPY-PASTE CHECKLIST

```bash
# 1. Clone Next.js project
npx create-next-app@latest mentorship --typescript --tailwind --app

# 2. Install dependencies
cd mentorship
npm install \
  @supabase/supabase-js \
  stripe \
  @tanstack/react-query \
  zustand \
  lucide-react \
  dayjs

# 3. Set environment variables
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
STRIPE_SECRET_KEY=your-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-key
EOF

# 4. Create folder structure
mkdir -p app/{auth,dashboard,mentors,booking} \
         components lib/types hooks store

# 5. Start developing!
npm run dev
```

That's it! You now have:
✅ Complete system design
✅ Database schema with migrations
✅ Frontend architecture (Next.js)
✅ Component templates (copy-paste ready)
✅ API routes
✅ Mobile roadmap
✅ Implementation timeline

Happy building! 🚀

