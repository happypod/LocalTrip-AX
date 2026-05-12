"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface CourseImageProps {
  src?: string | null;
  alt: string;
}

export function CourseImage({ src, alt }: CourseImageProps) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div className="w-full aspect-[16/9] bg-muted/60 flex flex-col items-center justify-center text-muted-foreground border-b">
        <ImageOff className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-xs font-medium">코스 이미지 준비 중</span>
      </div>
    );
  }

  return (
    <div className="w-full aspect-[16/9] relative overflow-hidden border-b bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
        loading="lazy"
        onError={() => setImgError(true)}
      />
    </div>
  );
}
