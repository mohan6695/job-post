'use client';

import { useRouter, useParams } from 'next/navigation';
import { CheckCircle, Calendar, Clock, User, Mail } from 'lucide-react';

export default function BookingSuccessPage() {
  const router = useRouter();
  const params = useParams();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Booking Confirmed!</h1>
        <p className="text-slate-600 mb-8">
          Your session has been successfully booked. You will receive a confirmation email with all the details.
        </p>

        <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Mentor</p>
                <p className="text-slate-600">John Doe</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Date</p>
                <p className="text-slate-600">January 20, 2025</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Time</p>
                <p className="text-slate-600">10:00 AM - 11:00 AM</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Mail size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Email</p>
                <p className="text-slate-600">john.doe@example.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Go to Home
          </button>
          
          <button
            onClick={() => router.push(`/mentors/${params.mentorId}`)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-lg transition-colors"
          >
            View Mentor Profile
          </button>
        </div>
      </div>
    </div>
  );
}
