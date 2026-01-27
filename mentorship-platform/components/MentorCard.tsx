'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import type { MentorProfile } from '@/lib/types';

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
