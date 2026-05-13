"use client";

import { ProgramCard } from "./program-card";
import { usePersonaThemeStore } from "@/store/persona-theme-store";
import { sortByPersona } from "@/lib/persona-curation";
import { useIsClient } from "@/hooks/use-is-client";

export type ProgramGridItem = {
  id: string;
  title: string;
  summary: string;
  linkedLifeService?: string | null;
  residentRole?: string | null;
  priceText?: string | null;
  durationText?: string | null;
  category?: string | null;
  images?: string[];
  slug: string;
};

interface ProgramGridClientProps {
  programs: ProgramGridItem[];
}

export function ProgramGridClient({ programs }: ProgramGridClientProps) {
  const currentTheme = usePersonaThemeStore((state) => state.currentTheme);
  const isClient = useIsClient();

  const sortedPrograms = isClient
    ? sortByPersona(programs, currentTheme, (i) => `${i.title} ${i.summary} ${i.category || ""}`)
    : programs;

  return (
    <div className="flex flex-col gap-4">
      {isClient && (
        <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-persona-primary/5 px-3 py-1 text-[11px] font-extrabold text-persona-primary/80 border border-persona-primary/5">
          <span>✨ 여행 취향에 어울리는 소원 별미를 먼저 추천해드려요.</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedPrograms.map((prog) => (
          <ProgramCard
            key={prog.id}
            title={prog.title}
            summary={prog.summary}
            linkedLifeService={prog.linkedLifeService || ""}
            residentRole={prog.residentRole || ""}
            priceText={prog.priceText}
            durationText={prog.durationText}
            category={prog.category}
            imageUrl={prog.images?.[0]}
            slug={prog.slug}
          />
        ))}
      </div>
    </div>
  );
}
