"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@/lib/fontawesome";
import { usePersonaThemeStore } from "@/store/persona-theme-store";
import { getStaticLabels } from "@/lib/static-translations";
import {
  normalizeEventGradientForDisplay,
  normalizeEventHrefForDisplay,
} from "@/lib/event-policy";

interface EventItem {
  id: string;
  tag: string;
  title: string;
  subTitle: string;
  description: string;
  gradient: string;
  href: string;
  bgImage?: string;
}

interface EventSliderProps {
  events?: EventItem[];
}

function getEventImage(href: string) {
  if (href.startsWith("/experiences")) {
    return "/images/experiences/exp-01.jpg";
  }
  if (href.startsWith("/programs")) {
    return "/images/programs/prog-01.jpg";
  }
  if (href.startsWith("/courses")) {
    return "/images/courses/course-01.jpg";
  }
  return "/images/stays/stay-01.jpg";
}

export function EventSlider({ events = [] }: EventSliderProps) {
  const currentLang = usePersonaThemeStore((state) => state.currentLang);
  const currentTheme = usePersonaThemeStore((state) => state.currentTheme);
  const labels = getStaticLabels(currentLang, currentTheme);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const displayEvents = events.map((event) => {
    const href = normalizeEventHrefForDisplay(event.href);
    return {
      ...event,
      href,
      gradient: normalizeEventGradientForDisplay(event.gradient),
      bgImage: event.bgImage || getEventImage(href),
    };
  });

  useEffect(() => {
    if (isDragging || displayEvents.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % displayEvents.length;
        scrollToIndex(next);
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isDragging, displayEvents.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleDragStart = (event: DragEvent) => {
      event.preventDefault();
    };
    container.addEventListener("dragstart", handleDragStart);

    return () => {
      container.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const cards = container.children;
    if (cards[index]) {
      const card = cards[index] as HTMLElement;
      container.scrollTo({
        left:
          card.offsetLeft -
          container.offsetLeft -
          (container.clientWidth - card.clientWidth) / 2,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (isDragging || !containerRef.current) return;
    const container = containerRef.current;
    const cards = container.children;
    let closestIndex = 0;
    let minDiff = Infinity;

    for (let index = 0; index < cards.length; index += 1) {
      const card = cards[index] as HTMLElement;
      const targetLeft =
        card.offsetLeft -
        container.offsetLeft -
        (container.clientWidth - card.clientWidth) / 2;
      const diff = Math.abs(targetLeft - container.scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    }
    setActiveIndex(closestIndex);
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(event.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    event.preventDefault();
    const x = event.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);

    setTimeout(() => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const cards = container.children;
      let closestIndex = 0;
      let minDiff = Infinity;

      for (let index = 0; index < cards.length; index += 1) {
        const card = cards[index] as HTMLElement;
        const targetLeft =
          card.offsetLeft -
          container.offsetLeft -
          (container.clientWidth - card.clientWidth) / 2;
        const diff = Math.abs(targetLeft - container.scrollLeft);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      }
      setActiveIndex(closestIndex);
      scrollToIndex(closestIndex);
    }, 50);
  };

  const handleClickCapture = (event: React.MouseEvent) => {
    if (hasMoved) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <section className="py-8 md:py-12">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hide-scrollbar::-webkit-scrollbar { display: none !important; }
            .hide-scrollbar {
              -ms-overflow-style: none !important;
              scrollbar-width: none !important;
            }
          `,
        }}
      />

      <div className="mb-6 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-black tracking-tight text-[#161d1f]">
            {labels.eventTitle}
          </h2>
          <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#ae2f34]">
            Sowon Offers
          </span>
        </div>
        <Link
          href="/events"
          className="flex items-center gap-0.5 text-sm font-bold text-gray-500 transition-colors hover:text-[#ae2f34]"
        >
          <span>{labels.viewMore}</span>
          <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
        </Link>
      </div>

      {displayEvents.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
          <p className="text-sm font-black text-gray-600">
            {labels.eventEmpty}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {labels.eventEmptyDesc}
          </p>
        </div>
      ) : (
        <>
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onScroll={handleScroll}
            onClickCapture={handleClickCapture}
            className={`hide-scrollbar flex w-full select-none gap-6 overflow-x-auto pb-4 ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
          >
            {displayEvents.map((event) => (
              <div
                key={event.id}
                className="w-[85%] min-w-[290px] flex-shrink-0 md:w-[382px]"
              >
                <Link
                  href={event.href}
                  className={`group relative flex h-full items-center justify-between overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br ${event.gradient} p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md`}
                >
                  <div className="flex max-w-[65%] flex-col text-left">
                    <span className="mb-1.5 text-[10px] font-bold text-gray-500 sm:text-xs">
                      {event.tag}
                    </span>
                    <h3 className="text-lg font-black leading-snug text-gray-900 transition-colors group-hover:text-[#ae2f34]">
                      {event.title}
                    </h3>
                    <h4 className="mt-0.5 text-sm font-extrabold leading-snug text-gray-700">
                      {event.subTitle}
                    </h4>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">
                      {event.description}
                    </p>
                  </div>

                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl shadow-sm ring-4 ring-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2">
                    {event.bgImage && !failedImageIds[event.id] ? (
                      <>
                        <Image
                          src={event.bgImage}
                          alt={event.title}
                          fill
                          sizes="80px"
                          className="select-none object-cover"
                          draggable={false}
                          onError={() =>
                            setFailedImageIds((prev) => ({
                              ...prev,
                              [event.id]: true,
                            }))
                          }
                        />
                        <div className="absolute inset-0 bg-black/5" />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/70 text-[10px] font-black text-[#584140]">
                        {labels.eventTitle}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#161d1f] text-[10px] font-bold text-white shadow-sm">
                      Go
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {displayEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  scrollToIndex(index);
                }}
                aria-label={`${labels.slideLabel} ${index + 1}`}
                className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                  activeIndex === index ? "w-6 bg-[#161d1f]" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
