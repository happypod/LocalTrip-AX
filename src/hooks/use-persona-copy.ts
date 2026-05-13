"use client";

import { usePersonaThemeStore } from "@/store/persona-theme-store";
import { getPersonaDictionary, PersonaDictionary } from "@/lib/persona-theme";
import { useIsClient } from "@/hooks/use-is-client";

export function usePersonaCopy(): PersonaDictionary {
  const currentTheme = usePersonaThemeStore((state) => state.currentTheme);
  const currentLang = usePersonaThemeStore((state) => state.currentLang);
  const isClient = useIsClient();

  if (!isClient) {
    return getPersonaDictionary("ko", "masil");
  }

  return getPersonaDictionary(currentLang, currentTheme);
}
