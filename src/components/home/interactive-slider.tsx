"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ContentCard } from "./content-card";

type HomeItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  priceText?: string | null;
  images?: string[];
  href?: string;
};

interface InteractiveSliderProps {
  items: HomeItem[];
  hrefPrefix: string;
  badge: string;
  badgeVariant: "stay" | "experience" | "program" | "course";
  showPrice?: boolean;
}

export function InteractiveSlider({
  items,
  hrefPrefix,
  badge,
  badgeVariant,
  showPrice = true,
}: InteractiveSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
      window.addEventListener("resize", checkScroll);

      const handleDragStart = (e: DragEvent) => {
        e.preventDefault();
      };
      container.addEventListener("dragstart", handleDragStart);

      return () => {
        container.removeEventListener("scroll", checkScroll);
        container.removeEventListener("dragstart", handleDragStart);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [items]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const { clientWidth } = containerRef.current;
    const scrollAmount = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
    containerRef.current.scrollTo({
      left: containerRef.current.scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/slider w-full">
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .hide-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}} />

      {/* Left Arrow Button (PC Mode only, hidden on Mobile) */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-white border border-[#dde4e6] shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-[#161d1f] hover:bg-[#ae2f34] hover:text-white transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Right Arrow Button (PC Mode only, hidden on Mobile) */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-white border border-[#dde4e6] shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-[#161d1f] hover:bg-[#ae2f34] hover:text-white transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Draggable & Scrollable Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onClickCapture={handleClickCapture}
        className={`flex gap-5 overflow-x-auto pb-4 cursor-grab select-none hide-scrollbar w-full ${
          isDragging ? "cursor-grabbing" : ""
        }`}
        style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
      >
        {items.map((item) => (
          <div key={item.id} className="w-[280px] flex-shrink-0">
            <ContentCard
              title={item.title}
              summary={item.summary}
              imageUrl={item.images?.[0]}
              href={item.href ?? `${hrefPrefix}/${item.slug}`}
              priceText={showPrice ? item.priceText ?? undefined : undefined}
              badge={badge}
              badgeVariant={badgeVariant}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
