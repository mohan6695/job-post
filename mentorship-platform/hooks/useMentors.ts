'use client';

import { useEffect, useState } from 'react';
import { searchMentors } from '@/lib/supabase';
import type { MentorProfile, MentorFilter } from '@/lib/types';

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
