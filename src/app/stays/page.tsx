import { getPrisma } from "@/lib/prisma";
import { StayGridClient } from "@/components/stays/stay-grid-client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getServerTranslationLocale } from "@/lib/server-translation";
import { getLocalizedList } from "@/lib/content-translation-server";

import { cn } from "@/lib/utils";

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
    console.warn("Failed to fetch stays from DB:", error);
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

  const rawStays = await getStays();
  const currentLocale = await getServerTranslationLocale();
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
            <Link href="/" className="hover:text-foreground">홈</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">머묾</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight">소원머묾 머무는 곳</h1>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            주민이 직접 운영하는 따뜻한 민박부터 파도가 보이는 오션뷰 펜션까지.
            당신만의 고요한 &apos;머묾&apos; 공간을 찾아 직접 문의해보세요.
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
              {cat}
            </Link>
          ))}
        </div>

        {filteredStays.length > 0 ? (
          <StayGridClient stays={filteredStays} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl">
            <p className="text-muted-foreground">
              {activeCategory} 카테고리에 해당하는 머묾 공간이 없습니다.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
