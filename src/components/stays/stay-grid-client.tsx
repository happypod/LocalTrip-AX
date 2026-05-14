"use client";

import { StayCard } from "./stay-card";
import { usePersonaThemeStore } from "@/store/persona-theme-store";
import { sortByPersona } from "@/lib/persona-curation";
import { useIsClient } from "@/hooks/use-is-client";

import { getStaticLabels } from "@/lib/static-translations";

type StayData = {
  id: string;
  title: string;
  summary: string;
  address?: string | null;
  priceText?: string | null;
  capacityText?: string | null;
  images?: string[];
  slug: string;
};

interface StayGridClientProps {
  stays: StayData[];
}

export function StayGridClient({ stays }: StayGridClientProps) {
  const currentTheme = usePersonaThemeStore((state) => state.currentTheme);
  const isClient = useIsClient();
  const currentLang = usePersonaThemeStore((state) => state.currentLang);
  
  const effectiveLang = isClient ? currentLang : "ko";
  const labels = getStaticLabels(effectiveLang);

  const sortedStays = isClient
    ? sortByPersona(stays, currentTheme, (i) => `${i.title} ${i.summary}`)
    : stays;

  return (
    <div className="flex flex-col gap-4">
      {isClient && (
        <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-persona-primary/5 px-3 py-1 text-[11px] font-extrabold text-persona-primary/80 border border-persona-primary/5">
          <span>✨ {labels.allStayRecomTip}</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedStays.map((stay) => (
          <StayCard
            key={stay.id}
            title={stay.title}
            summary={stay.summary}
            address={stay.address}
            priceText={stay.priceText}
            capacityText={stay.capacityText}
            imageUrl={stay.images?.[0]}
            slug={stay.slug}
            lang={effectiveLang}
          />
        ))}
      </div>
    </div>
  );
}
