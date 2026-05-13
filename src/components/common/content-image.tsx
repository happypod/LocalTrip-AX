"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ContentImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallback: React.ReactNode;
  sizes?: string;
  priority?: boolean;
}

export function ContentImage({
  src,
  alt,
  className,
  containerClassName,
  fallback,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: ContentImageProps) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return <>{fallback}</>;
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        sizes={sizes}
        priority={priority}
        onError={() => setImgError(true)}
      />
    </div>
  );
}
