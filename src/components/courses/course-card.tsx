import Link from "next/link";
import { CourseImage } from "./course-image";
import { Compass, CalendarHeart, Bed, Leaf, HeartHandshake } from "lucide-react";

import { getStaticLabels, getLocalizedCategory } from "@/lib/static-translations";

interface CourseCardProps {
  title: string;
  summary: string;
  targetType?: string | null;
  durationType?: string | null;
  imageUrl?: string;
  slug: string;
  linkedStayCount: number;
  linkedExpCount: number;
  linkedProgCount: number;
  lang?: string;
}

export function CourseCard({
  title,
  summary,
  targetType,
  durationType,
  imageUrl,
  slug,
  linkedStayCount,
  linkedExpCount,
  linkedProgCount,
  lang = "ko",
}: CourseCardProps) {
  const totalItems = linkedStayCount + linkedExpCount + linkedProgCount;
  const labels = getStaticLabels(lang);

  return (
    <Link
      href={`/courses/${slug}`}
      className="group block border rounded-xl bg-card overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col"
    >
      <div className="relative">
        <CourseImage src={imageUrl} alt={title} />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {targetType && (
            <div className="px-2 py-1 bg-category-course/90 text-white text-[10px] font-bold rounded shadow-sm">
              {getLocalizedCategory(targetType, lang)}
            </div>
          )}
          {durationType && (
            <div className="px-2 py-1 bg-background/90 text-foreground text-[10px] font-bold rounded shadow-sm">
              {getLocalizedCategory(durationType, lang)}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {summary}
          </p>
        </div>

        <div className="mt-auto pt-4 flex flex-col gap-3">
          {/* Linked Item Summary */}
          {totalItems > 0 && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border">
              {linkedStayCount > 0 && (
                <div className="flex items-center gap-1" title={labels.tabStay}>
                  <Bed className="w-3.5 h-3.5 text-category-stay" />
                  <span>{linkedStayCount}</span>
                </div>
              )}
              {linkedExpCount > 0 && (
                <div className="flex items-center gap-1" title={labels.tabExperience}>
                  <Leaf className="w-3.5 h-3.5 text-category-experience" />
                  <span>{linkedExpCount}</span>
                </div>
              )}
              {linkedProgCount > 0 && (
                <div className="flex items-center gap-1" title={labels.tabProgram}>
                  <HeartHandshake className="w-3.5 h-3.5 text-category-program" />
                  <span>{linkedProgCount}</span>
                </div>
              )}
              <div className="ml-auto flex items-center gap-1 font-medium text-foreground/70">
                <Compass className="w-3.5 h-3.5" />
                <span>{labels.allCourseTotalItems.replace("{count}", String(totalItems))}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CalendarHeart className="w-3.5 h-3.5" />
              {labels.allCourseStayCourseLabel}
            </span>
            <span className="text-xs font-bold text-category-course group-hover:underline">
              {labels.allCourseViewCTA}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
