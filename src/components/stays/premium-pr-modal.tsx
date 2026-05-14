"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { isAllowedPremiumPrIframeUrl } from "@/lib/premium-pr";

interface PremiumPrModalProps {
  title: string;
  url: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumPrModal({
  title,
  url,
  isOpen,
  onClose,
}: PremiumPrModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !isAllowedPremiumPrIframeUrl(url)) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="relative flex h-[82vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-5">
          <h2 className="line-clamp-1 text-sm font-black text-gray-950 sm:text-base">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <iframe
          src={url ?? undefined}
          title={title}
          className="min-h-0 flex-1 border-0"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          allow="autoplay; fullscreen; xr-spatial-tracking; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
