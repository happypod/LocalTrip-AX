import Link from "next/link";
import { ExperienceImage } from "./experience-image";
import { MapPin, Clock, Users } from "lucide-react";

interface ExperienceCardProps {
  title: string;
  summary: string;
  location?: string | null;
  durationText?: string | null;
  priceText?: string | null;
  capacityText?: string | null;
  category?: string | null;
  imageUrl?: string;
  slug: string;
  href?: string;
}

export function ExperienceCard({
  title,
  summary,
  location,
  durationText,
  priceText,
  capacityText,
  category,
  imageUrl,
  slug,
  href,
}: ExperienceCardProps) {
  return (
    <Link
      href={href || `/experiences/${slug}`}
      className="group block border rounded-xl bg-card overflow-hidden shadow-sm hover:shadow-md transition-all h-full"
    >
      <div className="relative">
        <ExperienceImage src={imageUrl} alt={title} />
        {category && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-category-experience text-white text-[10px] font-bold rounded uppercase tracking-wider">
            {category}
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-lg leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 min-h-[2.5rem]">
            {summary}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-1.5 mt-2">
          {location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
          {durationText && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{durationText}</span>
            </div>
          )}
          {capacityText && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{capacityText}</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between border-t pt-3">
          {priceText ? (
            <span className="text-base font-bold text-foreground">{priceText}</span>
          ) : (
            <span className="text-sm text-muted-foreground italic">문의 필요</span>
          )}
          <span className="text-xs font-semibold text-primary group-hover:underline">
            상세보기
          </span>
        </div>
      </div>
    </Link>
  );
}
