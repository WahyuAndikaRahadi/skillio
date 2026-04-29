import { create } from "zustand";

export const useAppStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  stats: { xp: 0, streak: 0, isActiveToday: false },
  setStats: (stats) => set({ stats }),
  refreshStats: async () => {
    try {
      const res = await fetch("/api/user/stats");
      if (res.ok) {
        const data = await res.json();
        set({ stats: data });
      }
    } catch (err) {
      console.error("Failed to refresh stats", err);
    }
  },

  selectedCareer: null,
  setSelectedCareer: (career) => set({ selectedCareer: career }),

  quizAnswers: [],
  setQuizAnswers: (answers) => set({ quizAnswers: answers }),

  quizResult: null,
  setQuizResult: (result) => set({ quizResult: result }),

  roadmapProgress: 0,
  setRoadmapProgress: (progress) => set({ roadmapProgress: progress }),

  isImmersiveMode: false,
  setIsImmersiveMode: (mode) => set({ isImmersiveMode: mode }),

  deferredPrompt: null,
  setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
  isInstalled: false,
  setIsInstalled: (installed) => set({ isInstalled: installed }),
}));
