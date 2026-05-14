"use client";

import type { CourseItemUI } from "@/lib/course-data";
import { Bed, Leaf, HeartHandshake, ExternalLink } from "lucide-react";
import Link from "next/link";
import { trackLeadEvent } from "@/lib/lead-event";
import { getStaticLabels } from "@/lib/static-translations";

const COURSE_ITEM_TYPE = {
  accommodation: "accommodation",
  experience: "experience",
  localIncomeProgram: "local_income_program",
} as const satisfies Record<string, CourseItemUI["itemType"]>;

interface CourseLinkedItemsProps {
  courseId: string;
  courseSlug: string;
  items: CourseItemUI[];
  locale?: string;
}

export function CourseLinkedItems({ courseId, courseSlug, items, locale = "ko" }: CourseLinkedItemsProps) {
  const t = getStaticLabels(locale);
  const linkedItems = items.filter(i => i.slug);

  const handleTrack = (targetSlug: string, targetType: string) => {
    trackLeadEvent({
      itemType: "course",
      itemId: courseId,
      itemSlug: courseSlug,
      actionType: "detail_click",
      targetUrl: `/${targetType}s/${targetSlug}`,
    });
  };

  if (linkedItems.length === 0) {
    return (
      <div className="bg-muted/30 rounded-xl p-6 text-center border border-dashed">
        <p className="text-muted-foreground text-sm">{t.emptyLinkedItems}</p>
      </div>
    );
  }

  // Group items by type to show categorized lists
  const stays = linkedItems.filter((i) => i.itemType === COURSE_ITEM_TYPE.accommodation);
  const experiences = linkedItems.filter((i) => i.itemType === COURSE_ITEM_TYPE.experience);
  const programs = linkedItems.filter((i) => i.itemType === COURSE_ITEM_TYPE.localIncomeProgram);

  return (
    <div className="flex flex-col gap-4">
      {stays.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-category-stay" />
            {t.linkedStay}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {stays.map(item => (
              <Link 
                key={item.id} 
                href={`/stays/${item.slug}`}
                onClick={() => handleTrack(item.slug!, "stay")}
                className="group flex items-center justify-between p-3 border rounded-lg hover:border-category-stay transition-colors bg-card"
              >
                <span className="text-sm font-medium line-clamp-1">{item.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-category-stay shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {experiences.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-category-experience" />
            {t.linkedExperience}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {experiences.map(item => (
              <Link 
                key={item.id} 
                href={`/experiences/${item.slug}`}
                onClick={() => handleTrack(item.slug!, "experience")}
                className="group flex items-center justify-between p-3 border rounded-lg hover:border-category-experience transition-colors bg-card"
              >
                <span className="text-sm font-medium line-clamp-1">{item.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-category-experience shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {programs.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-category-program" />
            {t.linkedProgram}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {programs.map(item => (
              <Link 
                key={item.id} 
                href={`/programs/${item.slug}`}
                onClick={() => handleTrack(item.slug!, "program")}
                className="group flex items-center justify-between p-3 border rounded-lg hover:border-category-program transition-colors bg-card"
              >
                <span className="text-sm font-medium line-clamp-1">{item.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-category-program shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
