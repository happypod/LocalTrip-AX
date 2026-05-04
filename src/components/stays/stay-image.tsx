"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface StayImageProps {
  src?: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "auto" | "4/3";
}

export function StayImage({ src, alt, className, aspectRatio = "4/3" }: StayImageProps) {
  const [imgError, setImgError] = useState(false);

  const aspectStyles = {
    square: "aspect-square",
    video: "aspect-video",
    "4/3": "aspect-[4/3]",
    auto: "",
  };

  return (
    <div
      className={cn(
        "relative bg-muted flex items-center justify-center overflow-hidden",
        aspectStyles[aspectRatio],
        className
      )}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground p-4 text-center">
          <div className="text-sm font-medium">이미지 준비 중</div>
        </div>
      )}
    </div>
  );
}
