"use client";

import { useMemo, useState } from "react";
import { CourseCard } from "@/components/courses/course-card";
import { cn } from "@/lib/utils";
import { usePersonaThemeStore } from "@/store/persona-theme-store";
import { sortByPersona } from "@/lib/persona-curation";
import { useIsClient } from "@/hooks/use-is-client";

import { getStaticLabels, getLocalizedCategory } from "@/lib/static-translations";

export type CourseFilterItem = {
  id: string;
  title: string;
  summary: string;
  targetType?: string | null;
  durationType?: string | null;
  imageUrl?: string;
  slug: string;
  linkedStayCount: number;
  linkedExpCount: number;
  linkedProgCount: number;
};

const TARGET_FILTERS = ["가족", "커플", "개인/커플", "단체/가족", "아이동반"];
const DURATION_FILTERS = ["기본", "1박 2일", "반나절", "당일"];

function normalizeFilter(value?: string | null) {
  return value?.trim() || "";
}

function matchesTargetFilter(course: CourseFilterItem, filter: string) {
  if (filter === "전체") return true;

  const targetType = normalizeFilter(course.targetType);
  if (!targetType) return false;
  if (targetType === filter) return true;

  if (filter === "개인/커플") {
    return targetType === "커플/개인" || (targetType.includes("개인") && targetType.includes("커플"));
  }

  if (filter === "단체/가족") {
    return targetType.includes("단체") && targetType.includes("가족");
  }

  return targetType
    .split(/[\/,·\s]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .includes(filter);
}

function matchesDurationFilter(course: CourseFilterItem, filter: string) {
  if (filter === "전체") return true;
  return normalizeFilter(course.durationType) === filter;
}

function FilterButton({
  label,
  active,
  ariaLabel,
  onClick,
}: {
  label: string;
  active: boolean;
  ariaLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-10 rounded-full border px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-category-course/60 focus-visible:ring-offset-2",
        active
          ? "border-category-course bg-category-course text-white shadow-sm"
          : "border-border bg-muted/60 text-muted-foreground hover:border-category-course/40 hover:bg-category-course/10 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

export function CourseFilterGrid({ courses }: { courses: CourseFilterItem[] }) {
  const [selectedTarget, setSelectedTarget] = useState("전체");
  const [selectedDuration, setSelectedDuration] = useState("전체");

  const currentTheme = usePersonaThemeStore((state) => state.currentTheme);
  const isClient = useIsClient();
  const currentLang = usePersonaThemeStore((state) => state.currentLang);
  
  const effectiveLang = isClient ? currentLang : "ko";
  const labels = getStaticLabels(effectiveLang);

  const targetFilters = useMemo(
    () => TARGET_FILTERS.filter((filter) => courses.some((course) => matchesTargetFilter(course, filter))),
    [courses],
  );

  const durationFilters = useMemo(
    () => DURATION_FILTERS.filter((filter) => courses.some((course) => matchesDurationFilter(course, filter))),
    [courses],
  );

  // 1. Perform active category filter
  const activeFiltered = useMemo(
    () =>
      courses.filter(
        (course) =>
          matchesTargetFilter(course, selectedTarget) &&
          matchesDurationFilter(course, selectedDuration),
      ),
    [courses, selectedDuration, selectedTarget],
  );

  const filteredCourses = useMemo(() => {
    if (!isClient) return activeFiltered;
    return sortByPersona(activeFiltered, currentTheme, (i) => `${i.title} ${i.summary} ${i.targetType || ""}`);
  }, [activeFiltered, currentTheme, isClient]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {/* Filter Row 1: Target Audience */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground/70 pl-1">{labels.allCourseFilterTarget}</span>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <FilterButton
              label={getLocalizedCategory("전체", effectiveLang) || "전체"}
              active={selectedTarget === "전체"}
              ariaLabel="Category all"
              onClick={() => setSelectedTarget("전체")}
            />
            {targetFilters.map((filter) => (
              <FilterButton
                key={`target-${filter}`}
                label={getLocalizedCategory(filter, effectiveLang) || filter}
                active={selectedTarget === filter}
                ariaLabel={`Filter ${filter}`}
                onClick={() => setSelectedTarget(filter)}
              />
            ))}
          </div>
        </div>

        {/* Filter Row 2: Duration */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground/70 pl-1">{labels.allCourseFilterDuration}</span>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <FilterButton
              label={getLocalizedCategory("전체", effectiveLang) || "전체"}
              active={selectedDuration === "전체"}
              ariaLabel="Duration all"
              onClick={() => setSelectedDuration("전체")}
            />
            {durationFilters.map((filter) => (
              <FilterButton
                key={`duration-${filter}`}
                label={getLocalizedCategory(filter, effectiveLang) || filter}
                active={selectedDuration === filter}
                ariaLabel={`Filter ${filter}`}
                onClick={() => setSelectedDuration(filter)}
              />
            ))}
          </div>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="flex flex-col gap-4">
          {isClient && (
            <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-persona-primary/5 px-3 py-1 text-[11px] font-extrabold text-persona-primary/80 border border-persona-primary/5">
              <span>✨ {labels.allCourseRecomTip}</span>
            </div>
          )}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              summary={course.summary}
              targetType={course.targetType}
              durationType={course.durationType}
              imageUrl={course.imageUrl}
              slug={course.slug}
              linkedStayCount={course.linkedStayCount}
              linkedExpCount={course.linkedExpCount}
              linkedProgCount={course.linkedProgCount}
              lang={effectiveLang}
            />
          ))}
        </div>
      </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <p className="text-muted-foreground">{labels.allCourseEmptyDesc}</p>
          <button
            type="button"
            onClick={() => {
              setSelectedTarget("전체");
              setSelectedDuration("전체");
            }}
            className="mt-4 rounded-full bg-category-course px-5 py-2 text-sm font-bold text-white"
          >
            {getLocalizedCategory("전체", effectiveLang)}
          </button>
        </div>
      )}
    </div>
  );
}
