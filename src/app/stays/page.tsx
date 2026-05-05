import { getPrisma } from "@/lib/prisma";
import { StayCard } from "@/components/stays/stay-card";
import { FALLBACK_STAYS } from "@/lib/stay-data";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

function mergeStaysWithFallback<T extends { slug: string }>(items: T[]) {
  const merged = new Map<string, T | (typeof FALLBACK_STAYS)[number]>();

  for (const item of items) {
    merged.set(item.slug, item);
  }

  for (const item of FALLBACK_STAYS) {
    if (!merged.has(item.slug)) {
      merged.set(item.slug, item);
    }
  }

  return Array.from(merged.values());
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
      return FALLBACK_STAYS;
    }

    const stays = await prisma.accommodation.findMany({
      where: {
        status: "published",
        regionId: sowonRegion.id,
      },
      orderBy: { createdAt: "desc" },
    });

    return stays.length > 0 ? mergeStaysWithFallback(stays) : FALLBACK_STAYS;
  } catch (error) {
    console.warn("Failed to fetch stays from DB, using fallback:", error);
    return FALLBACK_STAYS;
  }
}

export default async function StaysPage() {
  const stays = await getStays();

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="px-6 py-12 bg-muted/30 border-b">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground">홈</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">숙소</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight">소원권역 숙소</h1>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            주민이 직접 운영하는 따뜻한 민박부터 파도가 보이는 오션뷰 펜션까지.
            원하시는 숙소를 찾아 직접 문의해보세요.
          </p>
        </div>
      </header>

      <main className="px-6 py-12 max-w-screen-xl mx-auto w-full">
        {stays.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stays.map((stay) => (
              <StayCard
                key={stay.id}
                title={stay.title}
                summary={stay.summary}
                address={stay.address}
                priceText={stay.priceText}
                capacityText={stay.capacityText}
                imageUrl={stay.images?.[0]}
                slug={stay.slug}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground">현재 등록된 숙소가 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}
