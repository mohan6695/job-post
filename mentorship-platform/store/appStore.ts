import { create } from 'zustand';
import type { MentorFilter } from '@/lib/types';

interface AppState {
  // Filters
  mentorFilters: MentorFilter;
  setMentorFilters: (filters: MentorFilter) => void;
  
  // Booking
  selectedMentorId: string | null;
  setSelectedMentorId: (id: string | null) => void;
  selectedServiceId: string | null;
  setSelectedServiceId: (id: string | null) => void;
  selectedDateTime: string | null;
  setSelectedDateTime: (dt: string | null) => void;
  
  // UI
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mentorFilters: {},
  setMentorFilters: (filters) => set({ mentorFilters: filters }),
  
  selectedMentorId: null,
  setSelectedMentorId: (id) => set({ selectedMentorId: id }),
  
  selectedServiceId: null,
  setSelectedServiceId: (id) => set({ selectedServiceId: id }),
  
  selectedDateTime: null,
  setSelectedDateTime: (dt) => set({ selectedDateTime: dt }),
  
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
