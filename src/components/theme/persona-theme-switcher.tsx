"use client";

import { usePersonaThemeStore } from "@/store/persona-theme-store";
import { PERSONA_THEMES } from "@/lib/persona-theme";
import { cn } from "@/lib/utils";

export function PersonaThemeSwitcher() {
  const currentTheme = usePersonaThemeStore((state) => state.currentTheme);
  const setTheme = usePersonaThemeStore((state) => state.setTheme);
  const resetOnboarding = usePersonaThemeStore((state) => state.resetOnboarding);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        {PERSONA_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={cn(
              "h-11 px-4 text-sm font-medium rounded-full transition-all border active:scale-95",
              currentTheme === theme.id
                ? "bg-persona-primary text-white border-persona-primary shadow-sm font-bold"
                : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
            )}
          >
            {theme.label}
          </button>
        ))}
      </div>
      
      <div className="border-t border-gray-100 pt-4">
        <button
          onClick={() => {
            // Reset the onboarding value, which triggers the global dialog to pop open immediately
            resetOnboarding();
            
            // Force closing of the locale modal if necessary by triggering an event or letting layout handle it automatically
          }}
          className="flex items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl px-4 py-3 transition-colors w-full text-left group active:scale-[0.98]"
        >
          <span className="bg-white w-7 h-7 rounded-xl flex items-center justify-center border border-gray-100 shadow-xs text-base group-hover:scale-105 transition-transform flex-shrink-0">
            ✨
          </span>
          <div className="flex-1">
            <div className="leading-tight font-extrabold text-gray-800 mb-0.5">
              취향 테스트 다시 받기
            </div>
            <div className="text-[11px] font-medium opacity-75">
              첫 방문 설문 질문을 통해 알맞은 무드를 추천받습니다.
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
