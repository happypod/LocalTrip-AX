import { PublishStatus } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { ProgramCard } from "@/components/programs/program-card";
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

    return (programs.length > 0 ? programs : FALLBACK_PROGRAMS.filter(p => p.status === PublishStatus.published)) as LocalIncomeProgramUI[];
  } catch (error) {
    console.warn("Failed to fetch programs from DB, using fallback:", error);
    return FALLBACK_PROGRAMS.filter(p => p.status === PublishStatus.published);
  }
}

export default async function ProgramsPage() {
  const programs = await getPrograms();
  
  // Simple categories from data for the filter UI
  const categories = ["전체", ...new Set(programs.map(p => p.category).filter(Boolean) as string[])];

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="px-6 py-12 bg-muted/30 border-b">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground">홈</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">주민소득상품</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight">주민이 운영하는 로컬 프로그램</h1>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            소원권역의 생활서비스와 주민소득을 함께 키우는 체류형 프로그램입니다.
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
            <button
              key={cat}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                cat === "전체" 
                  ? "bg-category-program text-white" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80 border"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {programs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((prog) => (
              <ProgramCard
                key={prog.id}
                title={prog.title}
                summary={prog.summary}
                linkedLifeService={prog.linkedLifeService}
                residentRole={prog.residentRole}
                priceText={prog.priceText}
                durationText={prog.durationText}
                category={prog.category}
                imageUrl={prog.images?.[0]}
                slug={prog.slug}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl">
            <p className="text-muted-foreground">현재 등록된 주민소득상품이 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}
