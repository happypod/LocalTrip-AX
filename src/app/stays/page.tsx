import { getPrisma } from "@/lib/prisma";
import { StayGridClient } from "@/components/stays/stay-grid-client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

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

export default async function StaysPage() {
  const stays = await getStays();

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

      <main className="px-6 py-12 max-w-screen-xl mx-auto w-full">
        {stays.length > 0 ? (
          <StayGridClient stays={stays} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground">현재 등록된 머묾 공간이 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}
