import { getPrisma } from "@/lib/prisma";
import { HomeClient } from "@/components/home/home-client";
import { getServerTranslationLocale } from "@/lib/server-translation";
import { getLocalizedList } from "@/lib/content-translation-server";
import { PublishStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

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
      return {
        stays: [] as HomeItem[],
        experiences: [] as HomeItem[],
        programs: [] as HomeProgramItem[],
        courses: [] as HomeItem[],
        events: [] as HomeEventItem[],
      };
    }

    const regionId = sowonRegion.id;

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
      prisma.event.findMany({
        where: { status: PublishStatus.published, regionId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const programItems = programs.map((program: HomeProgramItem) => toHomeProgramItem({
      id: program.id,
      slug: program.slug,
      title: program.title,
      summary: program.summary,
      priceText: program.priceText,
      images: program.images,
      category: program.category,
    }));

    const { foodPrograms, experiencePrograms } = splitHomePrograms(programItems);

    return {
      stays,
      experiences: [...experiences, ...experiencePrograms],
      programs: foodPrograms,
      courses,
      events,
    };
  } catch (error) {
    console.error("🚨 ERROR IN GET_HOME_DATA:", error);
    return {
      stays: [] as HomeItem[],
      experiences: [] as HomeItem[],
      programs: [] as HomeProgramItem[],
      courses: [] as HomeItem[],
      events: [] as HomeEventItem[],
    };
  }
}

export default async function Home() {
  const { stays, experiences, programs, courses, events } = await getHomeData();
  const currentLocale = await getServerTranslationLocale();

  const eventItemsForTranslation = events.map((e) => ({
    ...e,
    summary: e.subTitle,
  }));

  const [
    localizedStays,
    localizedExperiences,
    localizedPrograms,
    localizedCourses,
    localizedEventsRaw,
  ] = await Promise.all([
    getLocalizedList(stays, "accommodation", currentLocale),
    getLocalizedList(experiences, "experience", currentLocale),
    getLocalizedList(programs, "local_income_program", currentLocale),
    getLocalizedList(courses, "course", currentLocale),
    getLocalizedList(eventItemsForTranslation, "event", currentLocale),
  ]);

  const localizedEvents = localizedEventsRaw.map((e) => ({
    ...e,
    subTitle: e.summary || "",
  }));

  return (
    <HomeClient
      stays={localizedStays}
      experiences={localizedExperiences}
      programs={localizedPrograms}
      courses={localizedCourses}
      events={localizedEvents}
    />
  );
}
