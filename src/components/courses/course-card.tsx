import Link from "next/link";
import { CourseImage } from "./course-image";
import { Compass, CalendarHeart, Bed, Leaf, HeartHandshake } from "lucide-react";

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
}: CourseCardProps) {
  const totalItems = linkedStayCount + linkedExpCount + linkedProgCount;

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
              {targetType}
            </div>
          )}
          {durationType && (
            <div className="px-2 py-1 bg-background/90 text-foreground text-[10px] font-bold rounded shadow-sm">
              {durationType}
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
                <div className="flex items-center gap-1" title="포함된 숙소">
                  <Bed className="w-3.5 h-3.5 text-category-stay" />
                  <span>{linkedStayCount}</span>
                </div>
              )}
              {linkedExpCount > 0 && (
                <div className="flex items-center gap-1" title="포함된 체험">
                  <Leaf className="w-3.5 h-3.5 text-category-experience" />
                  <span>{linkedExpCount}</span>
                </div>
              )}
              {linkedProgCount > 0 && (
                <div className="flex items-center gap-1" title="포함된 주민소득상품">
                  <HeartHandshake className="w-3.5 h-3.5 text-category-program" />
                  <span>{linkedProgCount}</span>
                </div>
              )}
              <div className="ml-auto flex items-center gap-1 font-medium text-foreground/70">
                <Compass className="w-3.5 h-3.5" />
                <span>총 {totalItems}개 코스</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CalendarHeart className="w-3.5 h-3.5" />
              체류형 코스
            </span>
            <span className="text-xs font-bold text-category-course group-hover:underline">
              코스 보기
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
