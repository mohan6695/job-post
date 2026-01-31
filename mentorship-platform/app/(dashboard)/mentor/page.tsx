'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { MentorService } from '@/lib/types';

const predefinedServiceTypes = [
  'resume_review',
  'mock_interview',
  'career_guidance',
  'certification_prep',
  'project_review',
  'technical_guidance',
  'code_review',
  'system_design',
  'career_coaching',
  'interview_prep',
  'portfolio_review',
  'startup_mentorship',
  'leadership_coaching',
  'personal_branding',
  'networking_strategy',
  'other'
];

export default function MentorDashboard() {
  const [services, setServices] = useState<MentorService[]>([
    {
      id: '1',
      mentor_id: 'current',
      service_type: 'resume_review',
      description: 'Get feedback on your resume',
      duration_minutes: 30,
      price_override: null,
      is_active: true
    },
    {
      id: '2',
      mentor_id: 'current',
      service_type: 'mock_interview',
      description: 'Practice coding interviews',
      duration_minutes: 60,
      price_override: null,
      is_active: true
    }
  ]);

  const addService = () => {
    const newService: MentorService = {
      id: Date.now().toString(),
      mentor_id: 'current',
      service_type: 'other',
      description: '',
      duration_minutes: 60,
      price_override: null,
      is_active: true
    };
    setServices([...services, newService]);
  };

  const removeService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
  };

  const updateService = (id: string, updates: Partial<MentorService>) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, ...updates } : service
    ));
  };

  const toggleService = (id: string) => {
    updateService(id, { 
      is_active: !services.find(service => service.id === id)?.is_active 
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Mentor Dashboard</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Services</h2>
          <button
            onClick={addService}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Service
          </button>
        </div>

        <div className="space-y-4">
          {services.map((service) => (
            <div 
              key={service.id} 
              className={`border rounded-lg p-4 ${
                service.is_active ? 'border-slate-200' : 'border-slate-100 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={service.is_active}
                  onChange={() => toggleService(service.id)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded"
                />

                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Service Type
                      </label>
                      <select
                        value={service.service_type}
                        onChange={(e) => updateService(service.id, { service_type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {predefinedServiceTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={service.duration_minutes}
                        onChange={(e) => updateService(service.id, { duration_minutes: parseInt(e.target.value) })}
                        min={15}
                        step={15}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={service.description}
                      onChange={(e) => updateService(service.id, { description: e.target.value })}
                      rows={3}
                      placeholder="Describe what you offer in this service"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      value={service.price_override || ''}
                      onChange={(e) => updateService(service.id, { 
                        price_override: e.target.value ? parseInt(e.target.value) * 100 : null 
                      })}
                      min={0}
                      max={40}
                      placeholder="Optional (max $40)"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => removeService(service.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Availability</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Add Availability Slot
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add Slot
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-slate-700 mb-3">Current Availability</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
              <div>
                <p className="font-medium">Monday, January 2025</p>
                <p className="text-sm text-slate-600">10:00 AM - 12:00 PM</p>
              </div>
              <button className="text-red-500 text-sm hover:text-red-700">
                Remove
              </button>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
              <div>
                <p className="font-medium">Wednesday, January 2025</p>
                <p className="text-sm text-slate-600">2:00 PM - 4:00 PM</p>
              </div>
              <button className="text-red-500 text-sm hover:text-red-700">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button className="px-6 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition-colors">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
