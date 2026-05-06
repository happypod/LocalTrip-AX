import Link from "next/link";
import { getPrisma } from "@/lib/prisma";
import { EventSlider } from "@/components/home/event-slider";
import { HeroSearch } from "@/components/home/hero-search";
import { InteractiveSlider } from "@/components/home/interactive-slider";
import {
  FALLBACK_STAYS,
  FALLBACK_EXPERIENCES,
  FALLBACK_PROGRAMS,
  FALLBACK_COURSES,
} from "@/lib/home-data";
import {
  faChevronRight,
  faCircleCheck,
  faCompass,
  faMapLocationDot,
  faUsers,
} from "@/lib/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const dynamic = "force-dynamic";

const HOME_PREVIEW_LIMIT = 4;

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

type HomeEventDelegate = {
  findMany(args: {
    where: { status: "published" };
    orderBy: { createdAt: "desc" };
  }): Promise<HomeEventItem[]>;
};

function fillHomePreview(items: HomeItem[], fallbacks: HomeItem[]) {
  const merged = new Map<string, HomeItem>();

  for (const item of items) {
    merged.set(item.slug, item);
  }

  for (const item of fallbacks) {
    if (!merged.has(item.slug)) {
      merged.set(item.slug, item);
    }
  }

  return Array.from(merged.values()).slice(0, HOME_PREVIEW_LIMIT);
}

function fillAllHomeItems(items: HomeItem[], fallbacks: HomeItem[]) {
  const merged = new Map<string, HomeItem>();

  for (const item of items) {
    merged.set(item.slug, item);
  }

  for (const item of fallbacks) {
    if (!merged.has(item.slug)) {
      merged.set(item.slug, item);
    }
  }

  return Array.from(merged.values());
}

function toHomeProgramItem(program: HomeProgramItem): HomeProgramItem {
  let images = program.images;
  if (program.slug === "shrimp-grill-experience") {
    images = ["/images/programs/shrimp-grill.png"];
  } else if (program.slug === "fishing-village-dining-class") {
    images = ["/images/programs/dining-class.png"];
  } else if (program.slug === "shrimp-seafood-bbq") {
    images = ["/images/programs/seafood-bbq.png"];
  }

  return {
    id: program.id,
    slug: program.slug,
    title: program.title,
    summary: program.summary,
    priceText: program.priceText,
    images: images,
    category: program.category,
  };
}

function isFoodProgram(program: HomeProgramItem) {
  return (
    program.slug === "salt-farm-tour" ||
    program.slug === "village-dining" ||
    program.slug === "local-table-experience" ||
    program.category === "식생활" ||
    program.slug.includes("dining") ||
    program.slug.includes("table")
  );
}

function splitHomePrograms(programs: HomeProgramItem[]) {
  const foodPrograms = programs.filter(isFoodProgram);
  const experiencePrograms = programs.filter((program) => !isFoodProgram(program));

  return { foodPrograms, experiencePrograms };
}

async function getHomeData() {
  try {
    const prisma = getPrisma();
    await prisma.$connect();

    const sowonRegion = await prisma.region.findUnique({
      where: { slug: "sowon" },
      select: { id: true },
    });

    if (!sowonRegion) {
      const { foodPrograms, experiencePrograms } = splitHomePrograms(FALLBACK_PROGRAMS.map(toHomeProgramItem));
      return {
        stays: FALLBACK_STAYS,
        experiences: [...FALLBACK_EXPERIENCES, ...experiencePrograms].slice(0, HOME_PREVIEW_LIMIT),
        programs: foodPrograms,
        courses: FALLBACK_COURSES,
        events: [] as HomeEventItem[],
      };
    }

    const regionId = sowonRegion.id;
    const prismaWithEvent = prisma as typeof prisma & { event: HomeEventDelegate };

    const [stays, experiences, programs, courses, events] = await Promise.all([
      prisma.accommodation.findMany({
        where: { status: "published", regionId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.experience.findMany({
        where: { status: "published", regionId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.localIncomeProgram.findMany({
        where: { status: "published", regionId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.course.findMany({
        where: { status: "published", regionId },
        orderBy: { createdAt: "desc" },
      }),
      prismaWithEvent.event.findMany({
        where: { status: "published" },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const staysFilled = fillHomePreview(stays, FALLBACK_STAYS);
    const experiencesFilled = fillHomePreview(experiences, FALLBACK_EXPERIENCES);
    const programItems = programs.map((program: HomeProgramItem) => toHomeProgramItem({
      id: program.id,
      slug: program.slug,
      title: program.title,
      summary: program.summary,
      priceText: program.priceText,
      images: program.images,
    }));
    const programsFilled = fillAllHomeItems(programItems, FALLBACK_PROGRAMS.map(toHomeProgramItem));
    const coursesFilled = fillHomePreview(courses, FALLBACK_COURSES);

    const { foodPrograms, experiencePrograms } = splitHomePrograms(programsFilled);

    return {
      stays: staysFilled,
      experiences: [...experiencesFilled, ...experiencePrograms],
      programs: foodPrograms,
      courses: coursesFilled,
      events,
    };
  } catch {
    const { foodPrograms, experiencePrograms } = splitHomePrograms(FALLBACK_PROGRAMS.map(toHomeProgramItem));
    return {
      stays: FALLBACK_STAYS,
      experiences: [...FALLBACK_EXPERIENCES, ...experiencePrograms],
      programs: foodPrograms,
      courses: FALLBACK_COURSES,
      events: [] as HomeEventItem[],
    };
  }
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-black tracking-tight text-[#161d1f]">{title}</h2>
      <Link href={href} className="flex items-center gap-0.5 text-sm font-bold text-[#2b3234] hover:text-[#ae2f34]">
        전체보기 <FontAwesomeIcon icon={faChevronRight} className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export default async function Home() {
  const { stays, experiences, programs, courses, events } = await getHomeData();

  return (
    <main className="min-h-screen bg-[#f4fafd] text-[#161d1f]">
      <section
        className="relative min-h-[580px] overflow-hidden bg-cover bg-center md:min-h-[640px]"
        style={{ backgroundImage: "url('/images/hero-main.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative mx-auto flex min-h-[580px] max-w-7xl flex-col px-5 py-5 md:min-h-[640px]">
          <div className="flex flex-1 flex-col items-center justify-center pb-20 text-center text-white">
            <h1 className="text-5xl font-black tracking-tight drop-shadow-lg md:text-7xl">
              소원머묾
            </h1>
            <p className="mt-4 text-base md:text-xl font-extrabold drop-shadow leading-relaxed text-white/95">
              당신의 바람(所願)이 머무는 고요한 시간,<br className="md:hidden" /> 태안 바다에서의 특별한 하루.
            </p>

            <HeroSearch />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-6">
        <EventSlider events={events} />
        <section className="py-5">
          <SectionHeader title="추천 머묾" href="/stays" />
          <InteractiveSlider items={stays} hrefPrefix="/stays" badge="쉼" badgeVariant="stay" />
        </section>

        <section className="py-8">
          <SectionHeader title="인기 노님" href="/experiences" />
          <InteractiveSlider items={experiences} hrefPrefix="/experiences" badge="놀이" badgeVariant="experience" />
        </section>

        <section className="py-8">
          <SectionHeader title="소원 별미" href="/programs" />
          <InteractiveSlider items={programs} hrefPrefix="/programs" badge="맛" badgeVariant="program" />
        </section>

        <section className="py-8">
          <SectionHeader title="여정의 기록" href="/courses" />
          <InteractiveSlider items={courses} hrefPrefix="/courses" badge="기록" badgeVariant="course" showPrice={false} />
        </section>

        <section className="grid gap-5 py-8 md:grid-cols-2">
          <Link href="/partner/apply" className="group flex items-center justify-between rounded-2xl bg-white/80 p-7 shadow-[0_16px_50px_-32px_rgba(0,0,0,0.4)] ring-1 ring-[#dde4e6] backdrop-blur-xl transition hover:-translate-y-1">
            <div>
              <h3 className="text-xl font-black">파트너 입점 신청</h3>
              <p className="mt-2 text-sm font-medium text-[#584140]">파트너 입점 설명하고 신청합니다.</p>
              <span className="mt-5 inline-flex rounded-full bg-[#161d1f] px-5 py-2 text-sm font-black text-white group-hover:bg-[#ae2f34]">
                파트너 신청
              </span>
            </div>
            <FontAwesomeIcon icon={faCircleCheck} className="h-20 w-20 text-[#161d1f]" />
          </Link>

          <Link href="/map" className="group flex items-center justify-between rounded-2xl bg-white/80 p-7 shadow-[0_16px_50px_-32px_rgba(0,0,0,0.4)] ring-1 ring-[#dde4e6] backdrop-blur-xl transition hover:-translate-y-1">
            <div>
              <h3 className="text-xl font-black">로컬 지도 보기</h3>
              <p className="mt-2 text-sm font-medium text-[#584140]">지역의 숙소와 체험 위치를 모아봅니다.</p>
              <span className="mt-5 inline-flex rounded-full bg-[#161d1f] px-5 py-2 text-sm font-black text-white group-hover:bg-[#006a65]">
                지도 보기
              </span>
            </div>
            <FontAwesomeIcon icon={faMapLocationDot} className="h-20 w-20 text-[#161d1f]" />
          </Link>
        </section>

        <footer className="mt-7 flex flex-col gap-4 border-t border-[#dde4e6] py-7 text-sm text-[#584140] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-5">
            <span className="text-base font-black text-[#161d1f]">소원머묾</span>
            <span>관광문의</span>
            <span>010-0233-4548</span>
            <span>www.sowontrip.com</span>
          </div>
          <div className="flex items-center gap-4">
            <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
            <FontAwesomeIcon icon={faCompass} className="h-5 w-5" />
            <FontAwesomeIcon icon={faMapLocationDot} className="h-5 w-5" />
          </div>
        </footer>
      </div>
    </main>
  );
}
