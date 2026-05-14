import type { CourseItemUI } from "@/lib/course-data";
import { Bed, Leaf, HeartHandshake, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStaticLabels, getLocalizedCategory } from "@/lib/static-translations";

const COURSE_ITEM_TYPE = {
  accommodation: "accommodation",
  experience: "experience",
  localIncomeProgram: "local_income_program",
} as const satisfies Record<string, CourseItemUI["itemType"]>;

interface CourseRouteProps {
  items: CourseItemUI[];
  locale?: string;
}

function getItemIcon(type: CourseItemUI["itemType"]) {
  switch (type) {
    case COURSE_ITEM_TYPE.accommodation:
      return <Bed className="w-4 h-4 text-category-stay" />;
    case COURSE_ITEM_TYPE.experience:
      return <Leaf className="w-4 h-4 text-category-experience" />;
    case COURSE_ITEM_TYPE.localIncomeProgram:
      return <HeartHandshake className="w-4 h-4 text-category-program" />;
    default:
      return <MapPin className="w-4 h-4 text-muted-foreground" />;
  }
}

function getItemLabel(type: CourseItemUI["itemType"], locale: string = "ko") {
  switch (type) {
    case COURSE_ITEM_TYPE.accommodation:
      return getLocalizedCategory("숙소", locale);
    case COURSE_ITEM_TYPE.experience:
      return getLocalizedCategory("체험", locale);
    case COURSE_ITEM_TYPE.localIncomeProgram:
      return getLocalizedCategory("주민소득상품", locale);
    default:
      return getLocalizedCategory("스팟", locale);
  }
}

export function CourseRoute({ items, locale = "ko" }: CourseRouteProps) {
  const t = getStaticLabels(locale);

  if (!items || items.length === 0) {
    return (
      <div className="bg-muted/50 rounded-xl p-8 text-center border border-dashed">
        <p className="text-muted-foreground text-sm">{t.emptyCourseRoute}</p>
      </div>
    );
  }

  // Sort just in case
  const sortedItems = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="relative pl-6 sm:pl-8">
      {/* Vertical Line */}
      <div className="absolute left-[11px] sm:left-[15px] top-4 bottom-4 w-0.5 bg-border rounded-full" />

      <div className="flex flex-col gap-6">
        {sortedItems.map((item, index) => {
          return (
            <div key={item.id} className="relative">
              {/* Timeline Node */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-background border-2 border-border flex items-center justify-center z-10 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              </div>

              <div className="flex flex-col gap-1.5 bg-card border rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                {/* Visual Category Indicator */}
                <div 
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-1.5 opacity-80",
                    item.itemType === COURSE_ITEM_TYPE.accommodation && "bg-category-stay",
                    item.itemType === COURSE_ITEM_TYPE.experience && "bg-category-experience",
                    item.itemType === COURSE_ITEM_TYPE.localIncomeProgram && "bg-category-program",
                  )}
                />
                
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-muted rounded-md text-[10px] font-bold text-muted-foreground">
                      {getItemIcon(item.itemType)}
                      {getItemLabel(item.itemType, locale)}
                    </span>
                    {item.time && (
                      <span className="text-xs font-semibold text-primary">{item.time}</span>
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground bg-muted/50 w-5 h-5 flex items-center justify-center rounded-full">
                    {index + 1}
                  </div>
                </div>

                <h4 className="font-bold text-base text-foreground leading-snug">
                  {item.title}
                </h4>

                {item.note && (
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                    {getLocalizedCategory(item.note, locale)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
