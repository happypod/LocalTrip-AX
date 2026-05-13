"use client";

import { ContentImage } from "@/components/common/content-image";
import { cn } from "@/lib/utils";

interface StayImageProps {
  src?: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "auto" | "4/3";
}

export function StayImage({ src, alt, className, aspectRatio = "4/3" }: StayImageProps) {
  const aspectStyles = {
    square: "aspect-square",
    video: "aspect-video",
    "4/3": "aspect-[4/3]",
    auto: "",
  };

  const fallback = (
    <div
      className={cn(
        "bg-muted flex items-center justify-center overflow-hidden",
        aspectStyles[aspectRatio],
        className
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground p-4 text-center">
        <div className="text-sm font-medium">이미지 준비 중</div>
      </div>
    </div>
  );

  return (
    <ContentImage
      src={src}
      alt={alt}
      containerClassName={cn("bg-muted", aspectStyles[aspectRatio], className)}
      className="transition-transform duration-500 ease-out group-hover:scale-105"
      fallback={fallback}
    />
  );
}
