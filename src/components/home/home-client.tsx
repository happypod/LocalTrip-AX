"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { EventSlider } from "@/components/home/event-slider";
import { HeroSearch } from "@/components/home/hero-search";
import { InteractiveSlider } from "@/components/home/interactive-slider";
import { usePersonaCopy } from "@/hooks/use-persona-copy";
import { useIsClient } from "@/hooks/use-is-client";
import { usePersonaThemeStore } from "@/store/persona-theme-store";
import { sortByPersona, getPersonaSectionOrder } from "@/lib/persona-curation";
import {
  faChevronRight,
  faCircleCheck,
  faCompass,
  faMapLocationDot,
  faUser,
  faUsers,
} from "@/lib/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getStaticLabels } from "@/lib/static-translations";

type HomeItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  priceText?: string | null;
  images?: string[];
};

type HomeProgramItem = HomeItem & {
  category?: string | null;
};

type HomeEventItem = {
  id: string;
  tag: string;
  title: string;
  subTitle: string;
  description: string;
  gradient: string;
  href: string;
};

interface HomeClientProps {
  stays: HomeItem[];
  experiences: HomeItem[];
  programs: HomeProgramItem[];
  courses: HomeItem[];
  events: HomeEventItem[];
}

const HERO_SLIDES = [
  "/images/hero-slide-1.png",
  "/images/hero-slide-2.png",
  "/images/hero-slide-3.png",
  "/images/hero-slide-4.png",
];

function SectionHeader({ title, href, viewAllText }: { title: string; href: string; viewAllText: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-black tracking-tight text-[#161d1f] font-persona-display">{title}</h2>
      <Link href={href} className="flex items-center gap-0.5 text-sm font-bold text-[#2b3234] hover:text-persona-primary">
        {viewAllText} <FontAwesomeIcon icon={faChevronRight} className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export function HomeClient({ stays, experiences, programs, courses, events }: HomeClientProps) {
  const copy = usePersonaCopy();
  const currentTheme = usePersonaThemeStore((state) => state.currentTheme);
  const currentLang = usePersonaThemeStore((state) => state.currentLang);
  const labels = getStaticLabels(currentLang);
  const isClient = useIsClient();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sortedStays = isClient
    ? sortByPersona(stays, currentTheme, (i) => `${i.title} ${i.summary}`)
    : stays;

  const sortedExperiences = isClient
    ? sortByPersona(experiences, currentTheme, (i) => `${i.title} ${i.summary}`)
    : experiences;

  const sortedPrograms = isClient
    ? sortByPersona(programs, currentTheme, (i) => `${i.title} ${i.summary} ${i.category || ""}`)
    : programs;

  const sortedCourses = isClient
    ? sortByPersona(courses, currentTheme, (i) => `${i.title} ${i.summary}`)
    : courses;

  // 2. Section rendering map
  const renderMap: Record<string, React.ReactNode> = {
    stay: (
      <section key="stay" className="py-5 transition-all duration-500">
        <SectionHeader title={copy.section.recommendedStay} href="/stays" viewAllText={copy.button.viewAll} />
        <InteractiveSlider items={sortedStays} hrefPrefix="/stays" badge={copy.badge.stay} badgeVariant="stay" />
      </section>
    ),
    experience: (
      <section key="experience" className="py-8 transition-all duration-500">
        <SectionHeader title={copy.section.popularExperience} href="/experiences" viewAllText={copy.button.viewAll} />
        <InteractiveSlider items={sortedExperiences} hrefPrefix="/experiences" badge={copy.badge.experience} badgeVariant="experience" />
      </section>
    ),
    program: (
      <section key="program" className="py-8 transition-all duration-500">
        <SectionHeader title={copy.section.localProduct} href="/programs" viewAllText={copy.button.viewAll} />
        <InteractiveSlider items={sortedPrograms} hrefPrefix="/programs" badge={copy.badge.program} badgeVariant="program" />
      </section>
    ),
    course: (
      <section key="course" className="py-8 transition-all duration-500">
        <SectionHeader title={copy.section.recommendedCourse} href="/courses" viewAllText={copy.button.viewAll} />
        <InteractiveSlider items={sortedCourses} hrefPrefix="/courses" badge={copy.badge.course} badgeVariant="course" showPrice={false} />
      </section>
    ),
  };

  const sectionOrder = isClient
    ? getPersonaSectionOrder(currentTheme) 
    : ["stay", "experience", "program", "course"];

  return (
    <main className="min-h-screen bg-persona-bg text-persona-text transition-colors duration-200">
      <section className="relative min-h-[580px] overflow-hidden md:min-h-[640px]">
        {/* Auto-Rotating Slider Backgrounds */}
        {HERO_SLIDES.map((src, index) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url('${src}')`,
              transition: "opacity 1500ms ease-in-out, transform 1500ms ease-in-out",
              opacity: index === currentSlide ? 1 : 0,
              transform: index === currentSlide ? "scale(1)" : "scale(1.05)",
              zIndex: 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/35 backdrop-brightness-90 z-10" />
        <div className="relative z-20 mx-auto flex min-h-[580px] max-w-7xl flex-col px-5 py-5 md:min-h-[640px]">
          <div className="flex flex-1 flex-col items-center justify-center pb-20 text-center text-white">
            <h1 className="text-5xl font-black tracking-tight drop-shadow-lg md:text-7xl font-persona-display">
              {copy.hero.title}
            </h1>
            <p className="mt-4 text-base md:text-xl font-extrabold drop-shadow leading-relaxed text-white/95">
              {copy.hero.subtitle}
            </p>

            <HeroSearch />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-6">
        <EventSlider events={events} />
        
        {/* Subtle UI indicator explaining the personalized ordering */}
        {isClient && (
          <div className="mt-6 mb-2 inline-flex items-center gap-1.5 rounded-full bg-persona-primary/10 border border-persona-primary/10 px-3 py-1 text-xs font-extrabold text-persona-primary select-none transition-all hover:bg-persona-primary/15">
            <span className="text-xs">✨</span>
            <span>{labels.personaDesc}</span>
          </div>
        )}

        {/* Render reordered sections */}
        <div className="flex flex-col">
          {sectionOrder.map((key) => renderMap[key])}
        </div>

        <section className="grid gap-5 py-8 md:grid-cols-2">
          <Link href="/partner/apply" className="group flex items-center justify-between rounded-persona bg-persona-surface/80 p-7 shadow-[0_16px_50px_-32px_rgba(0,0,0,0.4)] ring-1 ring-[#dde4e6] backdrop-blur-xl transition hover:-translate-y-1">
            <div>
              <h3 className="text-xl font-black font-persona-display">{labels.partnerTitle}</h3>
              <p className="mt-2 text-sm font-medium text-[#584140]">{labels.partnerDesc}</p>
              <span className="mt-5 inline-flex rounded-full bg-[#161d1f] px-5 py-2 text-sm font-black text-white group-hover:bg-persona-primary">
                {copy.button.apply}
              </span>
            </div>
            <FontAwesomeIcon icon={faCircleCheck} className="h-20 w-20 text-[#161d1f]" />
          </Link>

          <Link href="/map" className="group flex items-center justify-between rounded-persona bg-persona-surface/80 p-7 shadow-[0_16px_50px_-32px_rgba(0,0,0,0.4)] ring-1 ring-[#dde4e6] backdrop-blur-xl transition hover:-translate-y-1">
            <div>
              <h3 className="text-xl font-black font-persona-display">{labels.mapTitle}</h3>
              <p className="mt-2 text-sm font-medium text-[#584140]">{labels.mapDesc}</p>
              <span className="mt-5 inline-flex rounded-full bg-[#161d1f] px-5 py-2 text-sm font-black text-white group-hover:bg-[#006a65]">
                {copy.button.openMap}
              </span>
            </div>
            <FontAwesomeIcon icon={faMapLocationDot} className="h-20 w-20 text-[#161d1f]" />
          </Link>
        </section>

        <footer className="mt-7 flex flex-col gap-4 border-t border-[#dde4e6] py-7 text-sm text-persona-muted md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-base font-black text-persona-text font-persona-display">{copy.hero.title}</span>
            <span>{labels.touristInquiry}</span>
            <a href="tel:010-0233-4548" className="hover:underline hover:text-persona-primary transition-colors">010-0233-4548</a>
            <a href="https://www.sowontrip.com" target="_blank" rel="noreferrer" className="hover:underline hover:text-persona-primary transition-colors">www.sowontrip.com</a>
            <Link href="/customer-center" className="hover:underline hover:text-persona-primary transition-colors">{labels.navCustomerCenter}</Link>
            <Link href="/partner/apply" className="hover:underline hover:text-persona-primary transition-colors">{labels.partnerTitle}</Link>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/admin"
              aria-label="관리자 전용 페이지로 이동 (오픈 전 한시 허용)"
              title="관리자 페이지 (운영 전용)"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-persona-primary/25 bg-white/75 px-4 text-sm font-black text-persona-text shadow-sm transition hover:border-persona-primary hover:bg-white hover:text-persona-primary"
            >
              <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
              관리자 페이지 (운영 전용)
            </Link>
            <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
            <FontAwesomeIcon icon={faCompass} className="h-5 w-5" />
            <FontAwesomeIcon icon={faMapLocationDot} className="h-5 w-5" />
          </div>
        </footer>
      </div>
    </main>
  );
}
