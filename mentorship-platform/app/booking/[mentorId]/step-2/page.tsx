'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { MentorProfile, MentorService } from '@/lib/types';

interface BookingStep2Props {
  params: Promise<{ mentorId: string }>;
}

export default function BookingStep2Page({ params }: BookingStep2Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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

  const selectedService = mentor?.services?.find(service => service.id === serviceId);

  const handleBack = async () => {
    const resolvedParams = await params;
    router.push(`/booking/${resolvedParams.mentorId}`);
  };

  const handleNext = async () => {
    if (!selectedDate || !selectedTime) return;
    const resolvedParams = await params;
    router.push(
      `/booking/${resolvedParams.mentorId}?step=3&service=${serviceId}&date=${selectedDate}&time=${selectedTime}`
    );
  };

  // Mock available time slots
  const availableSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ];

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!mentor || !selectedService) {
    return <div className="p-8">Mentor or service not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      {/* Header */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
      >
        <ArrowLeft size={20} />
        Back to Services
      </button>

      {/* Mentor Info */}
      <div className="mb-8 p-4 bg-slate-50 rounded-lg">
        <h1 className="text-2xl font-bold">{mentor.user?.first_name} {mentor.user?.last_name}</h1>
        <p className="text-slate-600">{mentor.headline}</p>
      </div>

      {/* Service Info */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">{selectedService.service_type.replace(/_/g, ' ')}</h2>
        <p className="text-blue-800 text-sm">{selectedService.description}</p>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1 text-sm text-blue-700">
            <Clock size={16} />
            {selectedService.duration_minutes} minutes
          </div>
          <div className="text-sm text-blue-700 font-medium">
            ${((selectedService.price_override || mentor.session_price) / 100).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Calendar Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Select Date & Time</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <CalendarIcon size={16} className="inline mr-2" />
              Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate || ''}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                Available Time Slots
              </label>
              <div className="grid grid-cols-3 gap-3">
                {availableSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTime === time
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!selectedDate || !selectedTime}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-lg transition-colors"
      >
        Continue to Confirmation
      </button>
    </div>
  );
}
