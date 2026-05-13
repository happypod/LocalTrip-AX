"use client";

import { StayCard } from "./stay-card";
import { usePersonaThemeStore } from "@/store/persona-theme-store";
import { sortByPersona } from "@/lib/persona-curation";
import { useIsClient } from "@/hooks/use-is-client";

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

  const sortedStays = isClient
    ? sortByPersona(stays, currentTheme, (i) => `${i.title} ${i.summary}`)
    : stays;

  return (
    <div className="flex flex-col gap-4">
      {isClient && (
        <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-persona-primary/5 px-3 py-1 text-[11px] font-extrabold text-persona-primary/80 border border-persona-primary/5">
          <span>✨ 여행 취향에 어울리는 머묾을 먼저 추천해드려요.</span>
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
          />
        ))}
      </div>
    </div>
  );
}
