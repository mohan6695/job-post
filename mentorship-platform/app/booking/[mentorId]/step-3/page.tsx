'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { MentorProfile, MentorService } from '@/lib/types';

interface BookingStep3Props {
  params: Promise<{ mentorId: string }>;
}

export default function BookingStep3Page({ params }: BookingStep3Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');
  const selectedDate = searchParams.get('date');
  const selectedTime = searchParams.get('time');

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
    router.push(`/booking/${resolvedParams.mentorId}?step=2&service=${serviceId}`);
  };

  const handleConfirm = async () => {
    // Here we would typically create the booking in the database
    // and redirect to a success page or payment page
    const resolvedParams = await params;
    router.push(`/booking/${resolvedParams.mentorId}/success`);
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!mentor || !selectedService || !selectedDate || !selectedTime) {
    return <div className="p-8">Invalid booking details</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      {/* Header */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
      >
        <ArrowLeft size={20} />
        Back to Calendar
      </button>

      {/* Confirmation Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6">Confirm Booking</h1>

        <div className="space-y-4">
          {/* Mentor Info */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">{mentor.user?.first_name} {mentor.user?.last_name}</h2>
            <p className="text-slate-600 text-sm">{mentor.headline}</p>
          </div>

          {/* Service Info */}
          <div className="p-4 bg-blue-50 rounded-lg">
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

          {/* Date & Time */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Date & Time</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CalendarIcon size={16} />
                <span>{selectedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Clock size={16} />
                <span>{selectedTime}:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-slate-50 rounded-lg p-4 mb-8">
        <p className="text-sm text-slate-600 mb-4">
          By confirming this booking, you agree to our terms and conditions. 
          Please review the cancellation policy and payment terms before confirming.
        </p>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="terms" className="w-4 h-4 text-blue-600 rounded" />
          <label htmlFor="terms" className="text-sm text-slate-700">
            I agree to the terms and conditions
          </label>
        </div>
      </div>

      {/* Confirmation Button */}
      <button
        onClick={handleConfirm}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <CheckCircle size={20} />
        Confirm Booking
      </button>
    </div>
  );
}
