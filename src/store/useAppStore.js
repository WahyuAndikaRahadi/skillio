import { create } from "zustand";

export const useAppStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  
  selectedCareer: null,
  setSelectedCareer: (career) => set({ selectedCareer: career }),
  
  quizAnswers: [],
  setQuizAnswers: (answers) => set({ quizAnswers: answers }),
  
  quizResult: null,
  setQuizResult: (result) => set({ quizResult: result }),
  
  roadmapProgress: 0,
  setRoadmapProgress: (progress) => set({ roadmapProgress: progress }),
}));
