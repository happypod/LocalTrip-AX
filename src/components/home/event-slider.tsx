"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faCompass, faStar, faTicket } from "@/lib/fontawesome";

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

export function EventSlider({ events: dbEvents }: EventSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const fallbackEvents = [
    {
      id: "fallback-1",
      tag: "매주 화·수·금 오전 10시 오픈!",
      title: "놀라운 소원 특가 등장",
      subTitle: "주중 힐링 스테이 오픈런",
      description: "인기 숙소 초특가 선착순 한정수량 할인",
      gradient: "from-blue-50 to-indigo-100/40",
      bgImage: "/images/stays/stay-01.jpg",
      href: "/stays",
    },
    {
      id: "fallback-2",
      tag: "매월 단 10일만 열리는 특가!",
      title: "더블쿠폰 핫세일",
      subTitle: "전체 체험 최대 50% 할인",
      description: "소원면 인기 서핑/체험 전용 쿠폰 패키지",
      gradient: "from-rose-50 to-pink-100/40",
      bgImage: "/images/experiences/exp-01.jpg",
      href: "/experiences",
    },
    {
      id: "fallback-3",
      tag: "소원트립 단독 혜택!",
      title: "매달 도전! 로컬 트립",
      subTitle: "5월 소원 리뷰왕 이벤트",
      description: "주민소득상품 우수 리뷰어 상품권 및 무료 숙박권 증정",
      gradient: "from-amber-50 to-yellow-100/40",
      bgImage: "/images/programs/prog-01.jpg",
      href: "/programs",
    },
    {
      id: "fallback-4",
      tag: "신규 수산 미식 상품 론칭!",
      title: "대하·해산물 미식 기행",
      subTitle: "직접 굽고 나누는 바비큐 파티",
      description: "대하 손질·구이 및 바비큐 프로그램 특별 할인 혜택",
      gradient: "from-emerald-50 to-teal-100/40",
      bgImage: "/images/programs/shrimp-grill.png",
      href: "/programs",
    },
  ];

  const displayEvents = dbEvents && dbEvents.length > 0 ? dbEvents.map((ev) => {
    let bgImage = "/images/stays/stay-01.jpg";
    if (ev.href.includes("experience")) {
      bgImage = "/images/experiences/exp-01.jpg";
    } else if (ev.href.includes("program") || ev.href.includes("course")) {
      bgImage = "/images/programs/prog-01.jpg";
    }
    return {
      ...ev,
      bgImage,
    };
  }) : fallbackEvents;

  // Auto-scrolling interval logic
  useEffect(() => {
    if (isDragging || displayEvents.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % displayEvents.length;
        scrollToIndex(next);
        return next;
      });
    }, 4500); // Looping cycle of 4.5 seconds

    return () => clearInterval(interval);
  }, [isDragging, displayEvents.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // Prevent browser's native dragstart behavior
      const handleDragStart = (e: DragEvent) => {
        e.preventDefault();
      };
      container.addEventListener("dragstart", handleDragStart);

      return () => {
        container.removeEventListener("dragstart", handleDragStart);
      };
    }
  }, []);

  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const cards = container.children;
    if (cards && cards[index]) {
      const card = cards[index] as HTMLElement;
      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft - (container.clientWidth - card.clientWidth) / 2,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (isDragging || !containerRef.current) return;
    const container = containerRef.current;
    const { scrollLeft } = container;
    const cards = container.children;
    let closestIndex = 0;
    let minDiff = Infinity;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const targetLeft = card.offsetLeft - container.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
      const diff = Math.abs(targetLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    setActiveIndex(closestIndex);
  };

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
    if (isDragging) {
      setIsDragging(false);
      // Snap to closest card on mouse up
      setTimeout(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const { scrollLeft } = container;
        const cards = container.children;
        let closestIndex = 0;
        let minDiff = Infinity;

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i] as HTMLElement;
          const targetLeft = card.offsetLeft - container.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
          const diff = Math.abs(targetLeft - scrollLeft);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
          }
        }
        setActiveIndex(closestIndex);
        scrollToIndex(closestIndex);
      }, 50);
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section className="py-8 md:py-12">
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .hide-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}} />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-black tracking-tight text-[#161d1f]">이벤트</h2>
          <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-black text-[#ae2f34] uppercase tracking-wider animate-pulse">
            Hot Promotion
          </span>
        </div>
        <Link 
          href="/events" 
          className="flex items-center gap-0.5 text-sm font-bold text-gray-500 hover:text-[#ae2f34] transition-colors"
        >
          <span>더보기</span>
          <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
        </Link>
      </div>

      {/* Slider / Cards Row */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onScroll={handleScroll}
        onClickCapture={handleClickCapture}
        className={`flex gap-6 overflow-x-auto pb-4 cursor-grab select-none hide-scrollbar w-full ${
          isDragging ? "cursor-grabbing" : ""
        }`}
        style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
      >
        {displayEvents.map((event) => {
          return (
            <div key={event.id} className="min-w-[290px] w-[85%] md:w-[382px] flex-shrink-0">
              <Link
                href={event.href}
                className={`group relative flex justify-between items-center h-full overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br ${event.gradient} p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md`}
              >
                <div className="flex flex-col text-left max-w-[65%]">
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500 mb-1.5">{event.tag}</span>
                  <h3 className="text-lg font-black text-gray-900 leading-snug group-hover:text-[#ae2f34] transition-colors">
                    {event.title}
                  </h3>
                  <h4 className="text-sm font-extrabold text-gray-700 mt-0.5 leading-snug">
                    {event.subTitle}
                  </h4>
                  <p className="text-xs text-gray-500 mt-2 font-medium leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Graphic element with beautiful local scenic image */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl shadow-sm ring-4 ring-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2">
                  <img
                    src={event.bgImage}
                    alt={event.title}
                    className="h-full w-full object-cover select-none"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-black/5" />
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#161d1f] text-[10px] font-bold text-white shadow-sm">
                    Go
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Dot Pagination matching the reference image */}
      <div className="mt-4 flex justify-center gap-2">
        {displayEvents.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              scrollToIndex(index);
            }}
            aria-label={`슬라이드 ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              activeIndex === index ? "w-6 bg-[#161d1f]" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
