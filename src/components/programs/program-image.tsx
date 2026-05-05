import { ImageOff } from "lucide-react";

interface ProgramImageProps {
  src?: string | null;
  alt: string;
}

export function ProgramImage({ src, alt }: ProgramImageProps) {
  if (!src) {
    return (
      <div className="w-full aspect-[4/3] bg-muted/60 flex flex-col items-center justify-center text-muted-foreground border-b">
        <ImageOff className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-xs font-medium">이미지 준비 중</span>
      </div>
    );
  }

  return (
    <div className="w-full aspect-[4/3] relative overflow-hidden border-b bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
        loading="lazy"
      />
    </div>
  );
}
