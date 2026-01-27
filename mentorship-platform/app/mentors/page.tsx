'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilterSidebar } from '@/components/FilterSidebar';
import { MentorCard } from '@/components/MentorCard';
import { searchMentors } from '@/lib/supabase';
import type { MentorFilter } from '@/lib/types';

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
