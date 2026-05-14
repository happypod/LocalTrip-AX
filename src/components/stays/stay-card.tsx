import Link from "next/link";
import { StayImage } from "./stay-image";
import { MapPin, Users } from "lucide-react";

import { getStaticLabels } from "@/lib/static-translations";

interface StayCardProps {
  title: string;
  summary: string;
  address?: string | null;
  priceText?: string | null;
  capacityText?: string | null;
  imageUrl?: string;
  slug: string;
  lang?: string;
}

export function StayCard({
  title,
  summary,
  address,
  priceText,
  capacityText,
  imageUrl,
  slug,
  lang = "ko",
}: StayCardProps) {
  const labels = getStaticLabels(lang);
  
  return (
    <Link
      href={`/stays/${slug}`}
      className="group block border rounded-xl bg-card overflow-hidden shadow-sm hover:shadow-md transition-all h-full"
    >
      <StayImage src={imageUrl} alt={title} />
      <div className="p-5 flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-lg leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 min-h-[2.5rem]">
            {summary}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 mt-2">
          {address && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{address}</span>
            </div>
          )}
          {capacityText && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{capacityText}</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          {priceText ? (
            <span className="text-base font-bold text-foreground">{priceText}</span>
          ) : (
            <span className="text-sm text-muted-foreground italic">{labels.pgRequiredInquiry}</span>
          )}
          <span className="text-xs font-semibold text-primary group-hover:underline">
            {labels.pgViewDetail}
          </span>
        </div>
      </div>
    </Link>
  );
}
