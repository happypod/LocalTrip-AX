import { PublishStatus } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { ExperienceCard } from "@/components/experiences/experience-card";
import { FALLBACK_EXPERIENCES, ExperienceUI } from "@/lib/experience-data";
import { FALLBACK_PROGRAMS } from "@/lib/program-data";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type ProgramExperienceItem = {
  id: string;
  slug: string;
  href: string;
  title: string;
  summary: string;
  location?: string | null;
  priceText?: string | null;
  durationText?: string | null;
  capacityText?: string | null;
  category?: string | null;
  images: string[];
};

type ProgramExperienceSource = Omit<ProgramExperienceItem, "href"> & {
  category?: string | null;
  status?: PublishStatus | string;
};

function isFoodProgram(program: ProgramExperienceSource) {
  return (
    program.category === "식생활" ||
    program.slug === "salt-farm-tour" ||
    program.slug === "village-dining" ||
    program.slug === "local-table-experience"
  );
}

function toProgramExperience(program: ProgramExperienceSource): ProgramExperienceItem {
  return {
    id: program.id,
    slug: program.slug,
    href: `/programs/${program.slug}`,
    title: program.title,
    summary: program.summary,
    location: program.location,
    priceText: program.priceText,
    durationText: program.durationText || "1시간",
    capacityText: program.capacityText || "제한없음",
    category: "체험",
    images: program.images || [],
  };
}

async function getExperiences(): Promise<ExperienceUI[]> {
  try {
    const prisma = getPrisma();
    await prisma.$connect();

    const sowonRegion = await prisma.region.findUnique({
      where: { slug: "sowon" },
      select: { id: true },
    });

    if (!sowonRegion) {
      return FALLBACK_EXPERIENCES;
    }

    const experiences = await prisma.experience.findMany({
      where: {
        status: PublishStatus.published,
        regionId: sowonRegion.id,
      },
      orderBy: { createdAt: "desc" },
    });

    const merged = new Map<string, ExperienceUI>();
    for (const item of experiences) {
      const fb = FALLBACK_EXPERIENCES.find(f => f.slug === item.slug);
      merged.set(item.slug, {
        ...(fb || {}),
        ...item,
        category: fb?.category,
      } as ExperienceUI);
    }
    for (const item of FALLBACK_EXPERIENCES) {
      if (!merged.has(item.slug)) {
        merged.set(item.slug, item);
      }
    }

    return Array.from(merged.values());
  } catch (error) {
    console.warn("Failed to fetch experiences from DB, using fallback:", error);
    return FALLBACK_EXPERIENCES;
  }
}

async function getProgramsAsExperiences(): Promise<ProgramExperienceItem[]> {
  try {
    const prisma = getPrisma();
    await prisma.$connect();

    const sowonRegion = await prisma.region.findUnique({
      where: { slug: "sowon" },
      select: { id: true },
    });

    let dbPrograms: ProgramExperienceSource[] = [];
    if (sowonRegion) {
      const programs = await prisma.localIncomeProgram.findMany({
        where: {
          status: PublishStatus.published,
          regionId: sowonRegion.id,
        },
      });
      dbPrograms = programs.map((program) => ({
        id: program.id,
        slug: program.slug,
        title: program.title,
        summary: program.summary,
        location: program.location,
        priceText: program.priceText,
        images: program.images,
      }));
    }

    const merged = new Map<string, ProgramExperienceSource>();
    // 1. DB Items (with fallback enrichment)
    for (const item of dbPrograms) {
      const fb = FALLBACK_PROGRAMS.find(f => f.slug === item.slug);
      merged.set(item.slug, {
        ...(fb || {}),
        ...item,
        category: item.category || fb?.category,
      } as ProgramExperienceSource);
    }
    // 2. Fallbacks
    const publishedFallbacks = FALLBACK_PROGRAMS.filter(p => p.status === PublishStatus.published);
    for (const item of publishedFallbacks) {
      if (!merged.has(item.slug)) {
        merged.set(item.slug, item as ProgramExperienceSource);
      }
    }

    const rawPrograms = Array.from(merged.values());
    return rawPrograms.filter((program) => !isFoodProgram(program)).map(toProgramExperience);
  } catch {
    const nonFoodPrograms = FALLBACK_PROGRAMS.filter(
      p => p.status === PublishStatus.published && !isFoodProgram(p)
    );

    return nonFoodPrograms.map(toProgramExperience);
  }
}

export default async function ExperiencesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: queryCategory } = await searchParams;
  const activeCategory = queryCategory || "전체";

  const experiencesOnly = await getExperiences();
  const programExperiences = await getProgramsAsExperiences();
  let allExperiences = [...experiencesOnly, ...programExperiences];
  
  // Simple categories from data for the filter UI
  const categories = ["전체", ...new Set(allExperiences.map(e => e.category).filter(Boolean) as string[])];

  // Filter logic
  const filteredExperiences = activeCategory === "전체"
    ? allExperiences
    : allExperiences.filter(e => e.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="px-6 py-12 bg-muted/30 border-b">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground">홈</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">노님</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight">소원머묾 로컬노님</h1>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            고요한 바닷바람을 맞으며 만나는 나만의 예술적이고 감성적인 체험.
            해변, 어촌, 공방에서 만나는 특별한 시간을 직접 문의해보세요.
          </p>
        </div>
      </header>

      <main className="px-6 py-8 max-w-screen-xl mx-auto w-full flex flex-col gap-8">
        {/* URL Driven Filter UI */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={cat === "전체" ? "/experiences" : `/experiences?category=${encodeURIComponent(cat)}`}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                activeCategory === cat 
                  ? "bg-category-experience text-white" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat}
            </Link>
          ))}
        </div>

        {filteredExperiences.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                title={exp.title}
                summary={exp.summary}
                location={exp.location}
                durationText={exp.durationText}
                priceText={exp.priceText}
                capacityText={exp.capacityText}
                category={exp.category}
                imageUrl={exp.images?.[0]}
                slug={exp.slug}
                href={"href" in exp ? exp.href : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl">
            <p className="text-muted-foreground">
              {activeCategory} 카테고리에 해당하는 노님이 없습니다.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
