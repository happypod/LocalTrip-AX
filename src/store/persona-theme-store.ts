import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PersonaThemeId, PersonaLanguageCode, defaultPersonaTheme } from "@/lib/persona-theme";

interface PersonaThemeState {
  currentTheme: PersonaThemeId;
  currentLang: PersonaLanguageCode;
  hasCompletedOnboarding: boolean;
  setTheme: (theme: PersonaThemeId) => void;
  setLang: (lang: PersonaLanguageCode) => void;
  resetTheme: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const usePersonaThemeStore = create<PersonaThemeState>()(
  persist(
    (set) => ({
      currentTheme: defaultPersonaTheme,
      currentLang: "ko", // Default language
      hasCompletedOnboarding: false,
      setTheme: (theme) => set({ currentTheme: theme }),
      setLang: (lang) => set({ currentLang: lang }),
      resetTheme: () => set({ currentTheme: defaultPersonaTheme }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),
    }),
    {
      name: "sowon-persona-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
