"use client";

import { ExperienceCard } from "./experience-card";
import { usePersonaThemeStore } from "@/store/persona-theme-store";
import { sortByPersona } from "@/lib/persona-curation";
import { useIsClient } from "@/hooks/use-is-client";

export type ExperienceGridItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  location?: string | null;
  priceText?: string | null;
  durationText?: string | null;
  capacityText?: string | null;
  category?: string | null;
  images: string[];
  href?: string;
};

interface ExperienceGridClientProps {
  experiences: ExperienceGridItem[];
}

export function ExperienceGridClient({ experiences }: ExperienceGridClientProps) {
  const currentTheme = usePersonaThemeStore((state) => state.currentTheme);
  const isClient = useIsClient();

  const sortedExperiences = isClient
    ? sortByPersona(experiences, currentTheme, (i) => `${i.title} ${i.summary} ${i.category || ""}`)
    : experiences;

  return (
    <div className="flex flex-col gap-4">
      {isClient && (
        <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-persona-primary/5 px-3 py-1 text-[11px] font-extrabold text-persona-primary/80 border border-persona-primary/5">
          <span>✨ 여행 취향에 어울리는 노님을 먼저 추천해드려요.</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedExperiences.map((exp) => (
          <ExperienceCard
            key={exp.id}
            title={exp.title}
            summary={exp.summary}
            location={exp.location}
            durationText={exp.durationText}
            priceText={exp.priceText}
            capacityText={exp.capacityText}
            category={exp.category}
            imageUrl={exp.images?.[0]}
            slug={exp.slug}
            href={"href" in exp ? exp.href : undefined}
          />
        ))}
      </div>
    </div>
  );
}
