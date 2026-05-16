import { getPrisma } from "@/lib/prisma";
import { StayGridClient } from "@/components/stays/stay-grid-client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getServerTranslationLocale } from "@/lib/server-translation";
import { getLocalizedList } from "@/lib/content-translation-server";
import { logOperationError } from "@/lib/operation-log";
import { cn } from "@/lib/utils";
import { getStaticLabels, getLocalizedCategory } from "@/lib/static-translations";

export const dynamic = "force-dynamic";

function inferStayCategory(title: string): string {
  if (title.includes("한옥")) return "한옥";
  if (title.includes("민박")) return "민박";
  if (title.includes("글램핑")) return "글램핑";
  if (title.includes("펜션")) return "펜션";
  return "기타";
}

async function getStays() {
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

    return await prisma.accommodation.findMany({
      where: {
        status: "published",
        regionId: sowonRegion.id,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    logOperationError("stays_db_fetch_failed", error, { route: "/stays", operation: "getStays" });
    return [];
  }
}

export default async function StaysPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: queryCategory } = await searchParams;
  const activeCategory = queryCategory || "전체";

  const currentLocale = await getServerTranslationLocale();
  const labels = getStaticLabels(currentLocale);

  const rawStays = await getStays();
  const localizedStays = await getLocalizedList(rawStays, "accommodation", currentLocale);
  
  // Augment stays with explicit or inferred category
  const allStays = localizedStays.map(stay => ({
    ...stay,
    category: stay.category || inferStayCategory(stay.title),
  }));

  // Dynamically extract categories present in the DB
  const categories = ["전체", ...new Set(allStays.map(s => s.category))];

  // Filter active stays
  const filteredStays = activeCategory === "전체"
    ? allStays
    : allStays.filter(s => s.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="px-6 py-12 bg-muted/30 border-b">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground">{labels.home}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{labels.tabStay}</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight">{labels.allStayTitle}</h1>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            {labels.allStayDesc}
          </p>
        </div>
      </header>

      <main className="px-6 py-8 max-w-screen-xl mx-auto w-full flex flex-col gap-8">
        
        {/* URL Driven Filter UI */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={cat === "전체" ? "/stays" : `/stays?category=${encodeURIComponent(cat)}`}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                activeCategory === cat 
                  ? "bg-category-stay text-white" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {getLocalizedCategory(cat, currentLocale)}
            </Link>
          ))}
        </div>

        {filteredStays.length > 0 ? (
          <StayGridClient stays={filteredStays} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl">
            <p className="text-muted-foreground">
              {labels.allStayEmpty}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
