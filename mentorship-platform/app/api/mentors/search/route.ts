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
