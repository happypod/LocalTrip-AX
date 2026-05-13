"use client";

import { ImageOff } from "lucide-react";
import { ContentImage } from "@/components/common/content-image";

interface ProgramImageProps {
  src?: string | null;
  alt: string;
}

export function ProgramImage({ src, alt }: ProgramImageProps) {
  const fallback = (
    <div className="w-full aspect-[4/3] bg-muted/60 flex flex-col items-center justify-center text-muted-foreground border-b">
      <ImageOff className="w-8 h-8 mb-2 opacity-50" />
      <span className="text-xs font-medium">이미지 준비 중</span>
    </div>
  );

  return (
    <ContentImage
      src={src}
      alt={alt}
      containerClassName="w-full aspect-[4/3] border-b bg-muted"
      className="transition-transform duration-500 ease-out group-hover:scale-105"
      fallback={fallback}
    />
  );
}
