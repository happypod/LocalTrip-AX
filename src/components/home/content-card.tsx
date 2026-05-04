"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  title: string;
  summary: string;
  priceText?: string;
  imageUrl?: string;
  href: string;
  badge?: string;
  badgeVariant?: "stay" | "experience" | "program" | "course";
}

export function ContentCard({
  title,
  summary,
  priceText,
  imageUrl,
  href,
  badge,
  badgeVariant,
}: ContentCardProps) {
  const [imgError, setImgError] = useState(false);

  const badgeStyles = {
    stay: "bg-category-stay text-white",
    experience: "bg-category-experience text-white",
    program: "bg-category-program text-white",
    course: "bg-category-course text-white",
  };

  return (
    <Link
      href={href}
      className="group block border rounded-lg bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full"
    >
      <div className="relative aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-muted-foreground text-xs font-medium">이미지 준비 중</div>
        )}
        {badge && (
          <div
            className={cn(
              "absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
              badgeVariant ? badgeStyles[badgeVariant] : "bg-primary text-primary-foreground"
            )}
          >
            {badge}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1.5">
        <h3 className="font-bold text-base leading-snug line-clamp-1">{title}</h3>
        <p className="text-muted-foreground text-xs line-clamp-2 min-h-[2rem]">
          {summary}
        </p>
        {priceText && (
          <div className="mt-1 text-sm font-semibold text-foreground">
            {priceText}
          </div>
        )}
      </div>
    </Link>
  );
}
