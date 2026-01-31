'use client';

import { useState } from 'react';
import { MentorCard } from '@/components/MentorCard';
import type { MentorFilter, MentorProfile } from '@/lib/types';

// Dummy data for testing
const dummyData: MentorProfile[] = [
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

export default function MentorsPage() {
  const [filters, setFilters] = useState<MentorFilter>({
    page: 1,
    limit: 20,
    sortBy: 'rating',
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

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyData.map((mentor, index) => {
            console.log(`Rendering mentor ${index}:`, mentor);
            return <MentorCard key={mentor.id} mentor={mentor} />;
          })}
        </div>
      </div>
    </div>
  );
}
