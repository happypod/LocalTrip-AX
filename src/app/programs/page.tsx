import { PublishStatus } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { ProgramGridClient, type ProgramGridItem } from "@/components/programs/program-grid-client";
import { FALLBACK_PROGRAMS, LocalIncomeProgramUI } from "@/lib/program-data";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
      return FALLBACK_PROGRAMS.filter(p => p.status === PublishStatus.published);
    }

    const programs = await prisma.localIncomeProgram.findMany({
      where: {
        status: PublishStatus.published,
        regionId: sowonRegion.id,
      },
      orderBy: { createdAt: "desc" },
    });

    const merged = new Map<string, LocalIncomeProgramUI>();
    // 1. Add DB items (with fallback enrichment)
    for (const item of programs) {
      const fb = FALLBACK_PROGRAMS.find(f => f.slug === item.slug);
      merged.set(item.slug, {
        ...(fb || {}),
        ...item,
        category: fb?.category, // DB model lacks category, explicitly copy from fallback
      } as LocalIncomeProgramUI);
    }
    // 2. Add Fallbacks (Published only)
    const publishedFallbacks = FALLBACK_PROGRAMS.filter(p => p.status === PublishStatus.published);
    for (const item of publishedFallbacks) {
      if (!merged.has(item.slug)) {
        merged.set(item.slug, item);
      }
    }

    return Array.from(merged.values());
  } catch (error) {
    console.warn("Failed to fetch programs from DB, using fallback:", error);
    return FALLBACK_PROGRAMS.filter(p => p.status === PublishStatus.published);
  }
}

function isFoodProgram(program: LocalIncomeProgramUI) {
  const slug = program.slug || "";
  return (
    program.category === "식생활" ||
    slug === "salt-farm-tour" ||
    slug === "village-dining" ||
    slug === "local-table-experience" ||
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

  const allPrograms = await getPrograms();
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
            <Link href="/" className="hover:text-foreground">홈</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">소원 별미</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight">소원머묾 로컬 별미</h1>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            주민들이 정성스레 길러내고 만든 태안 소원면의 향토 특산품이자 특별한 별미를 소개합니다.
          </p>
        </div>
      </header>

      <main className="px-6 py-8 max-w-screen-xl mx-auto w-full flex flex-col gap-8">
        
        {/* Required Message Block */}
        <div className="bg-category-program/10 border border-category-program/20 rounded-xl p-5 text-sm leading-relaxed text-foreground/80 shadow-sm">
          <p>
            <strong className="text-category-program font-bold">이 프로그램은 일반 관광상품이 아닙니다.</strong><br/>
            주민이 직접 운영하고, 그 수익이 지역 생활서비스의 지속 가능성(노인 돌봄, 환경 정화 등)과 연결되는 특별한 소득활동입니다.
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
              {cat}
            </Link>
          ))}
        </div>

        {filteredPrograms.length > 0 ? (
          <ProgramGridClient programs={filteredPrograms} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl">
            <p className="text-muted-foreground">
              {activeCategory} 카테고리에 해당하는 소원 별미가 없습니다.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
