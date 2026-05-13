"use client";

import { useEffect } from "react";
import { usePersonaThemeStore } from "@/store/persona-theme-store";
import { PERSONA_THEMES } from "@/lib/persona-theme";

export function PersonaThemeProvider({ children }: { children: React.ReactNode }) {
  const currentTheme = usePersonaThemeStore((state) => state.currentTheme);

  useEffect(() => {
    const themeClasses = PERSONA_THEMES.map((t) => `theme-${t.id}`);
    document.body.classList.remove(...themeClasses);
    document.body.classList.add(`theme-${currentTheme}`);
    document.body.setAttribute("data-persona-theme", currentTheme);
  }, [currentTheme]);

  return <>{children}</>;
}
