import { create } from "zustand";

export const useAppStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  
  selectedCareer: null,
  setSelectedCareer: (career) => set({ selectedCareer: career }),
  
  roadmapProgress: 0,
  setRoadmapProgress: (progress) => set({ roadmapProgress: progress }),
}));
