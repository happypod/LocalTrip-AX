import { getPrisma } from "@/lib/prisma";
import { HomeClient } from "@/components/home/home-client";
import {
  FALLBACK_STAYS,
  FALLBACK_EXPERIENCES,
  FALLBACK_PROGRAMS,
  FALLBACK_COURSES,
} from "@/lib/home-data";

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
    const coursesFilled = fillAllHomeItems(courses, FALLBACK_COURSES);

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

export default async function Home() {
  const { stays, experiences, programs, courses, events } = await getHomeData();

  return (
    <HomeClient
      stays={stays}
      experiences={experiences}
      programs={programs}
      courses={courses}
      events={events}
    />
  );
}
