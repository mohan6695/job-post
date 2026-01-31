'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { MentorProfile, MentorService } from '@/lib/types';
import BookingStep2Page from './step-2/page';
import BookingStep3Page from './step-3/page';

interface BookingProps {
  params: Promise<{ mentorId: string }>;
}

export default function BookingPage({ params }: BookingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get('step');

  if (step === '2') {
    return <BookingStep2Page params={params} />;
  }

  if (step === '3') {
    return <BookingStep3Page params={params} />;
  }

  return <BookingStep1Page params={params} />;
}

function BookingStep1Page({ params }: BookingProps) {
  const router = useRouter();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const { data: mentor, isLoading } = useQuery({
    queryKey: ['mentor', params],
    queryFn: async () => {
      const resolvedParams = await params;
      const { data, error } = await supabase
        .from('mentor_profiles')
        .select('*, services:mentor_services(*), user:users(*)')
        .eq('id', resolvedParams.mentorId)
        .single();
      if (error) throw error;
      return data as unknown as MentorProfile;
    },
  });

  const handleNext = async () => {
    if (!selectedServiceId) return;
    const resolvedParams = await params;
    router.push(
      `/booking/${resolvedParams.mentorId}?step=2&service=${selectedServiceId}`
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
        <h1 className="text-2xl font-bold">{mentor.user?.first_name} {mentor.user?.last_name}</h1>
        <p className="text-slate-600">{mentor.headline}</p>
      </div>

      {/* Services */}
      <div>
        <h2 className="text-xl font-bold mb-4">Select a Service</h2>
        <div className="space-y-3">
          {mentor.services?.map((service: MentorService) => (
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
