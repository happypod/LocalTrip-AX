import Link from "next/link";
import { ProgramImage } from "./program-image";
import { Users, HeartHandshake } from "lucide-react";
import { getStaticLabels, getLocalizedCategory } from "@/lib/static-translations";

interface ProgramCardProps {
  title: string;
  summary: string;
  linkedLifeService: string;
  residentRole: string;
  priceText?: string | null;
  durationText?: string | null;
  category?: string | null;
  imageUrl?: string;
  slug: string;
  lang?: string;
}

export function ProgramCard({
  title,
  summary,
  linkedLifeService,
  residentRole,
  priceText,
  durationText,
  category,
  imageUrl,
  slug,
  lang = "ko",
}: ProgramCardProps) {
  const labels = getStaticLabels(lang);
  
  return (
    <Link
      href={`/programs/${slug}`}
      className="group block border rounded-xl bg-card overflow-hidden shadow-sm hover:shadow-md transition-all h-full"
    >
      <div className="relative">
        <ProgramImage src={imageUrl} alt={title} />
        {category && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-category-program text-white text-[10px] font-bold rounded uppercase tracking-wider shadow-sm">
            {getLocalizedCategory(category, lang)}
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-lg leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 min-h-[2.5rem]">
            {summary}
          </p>
        </div>

        {/* Emphasize local connection in the card */}
        <div className="bg-muted/40 rounded-lg p-3 flex flex-col gap-2 border">
          <div className="flex items-start gap-2 text-xs text-foreground/80">
            <HeartHandshake className="w-3.5 h-3.5 mt-0.5 text-category-program shrink-0" />
            <span className="line-clamp-2 leading-tight">
              <span className="font-semibold text-foreground">{labels.lifeServiceTitle}:</span> {linkedLifeService}
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs text-foreground/80">
            <Users className="w-3.5 h-3.5 mt-0.5 text-category-program shrink-0" />
            <span className="line-clamp-2 leading-tight">
              <span className="font-semibold text-foreground">{labels.residentRoleTitle}:</span> {residentRole}
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between border-t pt-3">
          <div className="flex flex-col">
            {priceText ? (
              <span className="text-base font-bold text-foreground">{priceText}</span>
            ) : (
              <span className="text-sm text-muted-foreground italic">{labels.pgRequiredInquiry}</span>
            )}
            {durationText && (
              <span className="text-[10px] text-muted-foreground">{durationText} {labels.pgDurationTook}</span>
            )}
          </div>
          <span className="text-xs font-semibold text-category-program group-hover:underline">
            {labels.pgViewDetail}
          </span>
        </div>
      </div>
    </Link>
  );
}
