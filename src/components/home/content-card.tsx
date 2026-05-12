"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@/lib/fontawesome";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/context/wishlist-context";

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
  const { toggleItem, isInWishlist } = useWishlist();
  
  const isFavorited = isInWishlist(href);

  const badgeStyles = {
    stay: "bg-white text-[#161d1f]",
    experience: "bg-white text-[#161d1f]",
    program: "bg-white text-[#161d1f]",
    course: "bg-white text-[#161d1f]",
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({ href, title, summary, priceText, imageUrl, badge });
  };

  return (
    <Link href={href} className="group block min-w-[220px] sm:min-w-0">
      <article className="overflow-hidden rounded-2xl bg-white transition duration-300 hover:-translate-y-1">
        <div className="relative aspect-[1.35] overflow-hidden rounded-2xl bg-[#dde4e6]">
          {imageUrl && !imgError ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(min-width: 768px) 25vw, 220px"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#584140]">
              이미지 준비 중
            </div>
          )}

          {badge && (
            <span
              className={cn(
                "absolute left-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide shadow-sm",
                badgeVariant ? badgeStyles[badgeVariant] : "bg-white text-[#161d1f]",
              )}
            >
              {badge}
            </span>
          )}

          <button 
            type="button"
            onClick={handleWishlistClick}
            className={cn(
              "absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-sm backdrop-blur-md transition duration-300 active:scale-90",
              isFavorited ? "bg-[#ff4b4b] text-white" : "bg-white/80 text-gray-400 hover:bg-white hover:text-[#ff4b4b]"
            )}
          >
            <FontAwesomeIcon icon={faHeart} className={cn("h-3.5 w-3.5 transition", isFavorited && "scale-110")} />
          </button>
        </div>

        <div className="px-1.5 py-3">
          <h3 className="line-clamp-1 text-base font-extrabold leading-snug text-[#161d1f]">{title}</h3>
          <p className="mt-1 line-clamp-2 min-h-[2.25rem] text-xs leading-relaxed text-[#584140]">
            {summary}
          </p>
          {priceText && (
            <div className="mt-2 text-sm font-black text-[#161d1f]">
              {priceText}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
