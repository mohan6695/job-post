'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { MentorFilter } from '@/lib/types';

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
