import { PublishStatus } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { ProgramGridClient, type ProgramGridItem } from "@/components/programs/program-grid-client";
import type { LocalIncomeProgramUI } from "@/lib/program-data";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getServerTranslationLocale } from "@/lib/server-translation";
import { getLocalizedList } from "@/lib/content-translation-server";
import { cn } from "@/lib/utils";
import { getStaticLabels, getLocalizedCategory } from "@/lib/static-translations";

export const dynamic = "force-dynamic";

async function getPrograms(): Promise<LocalIncomeProgramUI[]> {
  try {
    const prisma = getPrisma();
    await prisma.$connect();

    const sowonRegion = await prisma.region.findUnique({
      where: { slug: "sowon" },
      select: { id: true },
    });

    if (!sowonRegion) {
      return [];
    }

    return await prisma.localIncomeProgram.findMany({
      where: {
        status: PublishStatus.published,
        regionId: sowonRegion.id,
      },
      orderBy: { createdAt: "desc" },
    }) as LocalIncomeProgramUI[];
  } catch (error) {
    console.warn("Failed to fetch programs from DB:", error);
    return [];
  }
}

const FOOD_PROGRAM_SLUGS = new Set([
  "salt-farm-tour",
  "village-dining",
  "local-table-experience",
  "shrimp-grill-experience",
  "fishing-village-dining-class",
  "shrimp-seafood-bbq",
]);

function isFoodProgram(program: LocalIncomeProgramUI) {
  const slug = program.slug || "";
  return (
    program.category === "식생활" ||
    FOOD_PROGRAM_SLUGS.has(slug) ||
    slug.includes("dining") ||
    slug.includes("table")
  );
}

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: queryCategory } = await searchParams;
  const activeCategory = queryCategory || "전체";

  const currentLocale = await getServerTranslationLocale();
  const labels = getStaticLabels(currentLocale);
  
  const rawPrograms = await getPrograms();
  const allPrograms = await getLocalizedList(rawPrograms, "local_income_program", currentLocale);
  const programs: ProgramGridItem[] = allPrograms.filter(isFoodProgram);
  
  // Simple categories from data for the filter UI
  const categories = ["전체", ...new Set(programs.map(p => p.category).filter(Boolean) as string[])];

  const filteredPrograms = activeCategory === "전체"
    ? programs
    : programs.filter(p => p.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="px-6 py-12 bg-muted/30 border-b">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground">{labels.home}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{labels.tabProgram}</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight">{labels.pgTitle}</h1>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            {labels.pgDesc}
          </p>
        </div>
      </header>

      <main className="px-6 py-8 max-w-screen-xl mx-auto w-full flex flex-col gap-8">
        
        {/* Required Message Block */}
        <div className="bg-category-program/10 border border-category-program/20 rounded-xl p-5 text-sm leading-relaxed text-foreground/80 shadow-sm">
          <p>
            <strong className="text-category-program font-bold">{labels.pgBannerBold}</strong><br/>
            {labels.pgBannerText}
          </p>
        </div>

        {/* Simple Filter UI */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={cat === "전체" ? "/programs" : `/programs?category=${encodeURIComponent(cat)}`}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap border",
                activeCategory === cat 
                  ? "bg-category-program text-white border-category-program" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {getLocalizedCategory(cat, currentLocale)}
            </Link>
          ))}
        </div>

        {filteredPrograms.length > 0 ? (
          <ProgramGridClient programs={filteredPrograms} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl">
            <p className="text-muted-foreground">
              {labels.pgEmpty}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
