import { PublishStatus } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { FALLBACK_MAP_ITEMS, MapItem, MapItemType } from "@/lib/map-data";
import { PublicMapClient } from "@/components/map/public-map-client";
import { ChevronRight, Info } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getMapItems(): Promise<MapItem[]> {
  try {
    const prisma = getPrisma();
    await prisma.$connect();

    const sowonRegion = await prisma.region.findUnique({
      where: { slug: "sowon" },
      select: { id: true },
    });

    if (!sowonRegion) {
      return FALLBACK_MAP_ITEMS;
    }

    // Fetch all items from DB in parallel
    const [stays, experiences, programs, courses, businesses] = await Promise.all([
      prisma.accommodation.findMany({
        where: { regionId: sowonRegion.id, status: PublishStatus.published },
        select: { id: true, slug: true, title: true, summary: true, images: true, address: true, latitude: true, longitude: true, mapAddress: true }
      }),
      prisma.experience.findMany({
        where: { regionId: sowonRegion.id, status: PublishStatus.published },
        select: { id: true, slug: true, title: true, summary: true, images: true, location: true, latitude: true, longitude: true, mapAddress: true }
      }),
      prisma.localIncomeProgram.findMany({
        where: { regionId: sowonRegion.id, status: PublishStatus.published },
        select: { id: true, slug: true, title: true, summary: true, images: true, location: true, latitude: true, longitude: true, mapAddress: true }
      }),
      prisma.course.findMany({
        where: { regionId: sowonRegion.id, status: PublishStatus.published },
        select: { id: true, slug: true, title: true, summary: true, images: true }
      }),
      prisma.businessProfile.findMany({
        where: { regionId: sowonRegion.id, status: PublishStatus.published },
        select: { id: true, name: true, description: true, address: true, websiteUrl: true, latitude: true, longitude: true, mapAddress: true }
      })
    ]);

    // Very simple pseudo-normalization for MVP Map Items.
    // In a real app with precise map data, lat/lng or precise region mapping would happen here.
    // Here we'll guess the region based on slug or address/location strings.
    const guessRegion = (text: string | null) => {
      if (!text) return "소원면 전체";
      if (text.includes("만리포") || text.includes("mallipo") || text.includes("house")) return "만리포 권역";
      if (text.includes("천리포")) return "천리포 권역";
      if (text.includes("천리포") || text.includes("cheonripo") || text.includes("dining")) return "천리포 권역";
      if (text.includes("모항") || text.includes("의항")) return "모항·의항 권역";
      return "소원면 전체";
    };

    const mapItems: MapItem[] = [
      ...stays.map(s => ({
        id: s.id, slug: s.slug, title: s.title, summary: s.summary,
        itemType: "stay" as MapItemType, href: `/stays/${s.slug}`,
        regionId: sowonRegion.id, regionName: guessRegion(s.address || s.slug),
        image: s.images?.[0] || null, status: PublishStatus.published,
        latitude: s.latitude, longitude: s.longitude, mapAddress: s.mapAddress
      })),
      ...experiences.map(e => ({
        id: e.id, slug: e.slug, title: e.title, summary: e.summary,
        itemType: "experience" as MapItemType, href: `/experiences/${e.slug}`,
        regionId: sowonRegion.id, regionName: guessRegion(e.location || e.slug),
        image: e.images?.[0] || null, status: PublishStatus.published,
        latitude: e.latitude, longitude: e.longitude, mapAddress: e.mapAddress
      })),
      ...programs.map(p => ({
        id: p.id, slug: p.slug, title: p.title, summary: p.summary,
        itemType: "program" as MapItemType, href: `/programs/${p.slug}`,
        regionId: sowonRegion.id, regionName: guessRegion(p.location || p.slug),
        image: p.images?.[0] || null, status: PublishStatus.published,
        latitude: p.latitude, longitude: p.longitude, mapAddress: p.mapAddress
      })),
      ...courses.map(c => ({
        id: c.id, slug: c.slug, title: c.title, summary: c.summary,
        itemType: "course" as MapItemType, href: `/courses/${c.slug}`,
        regionId: sowonRegion.id, regionName: guessRegion(c.slug),
        image: c.images?.[0] || null, status: PublishStatus.published
      })),
      ...businesses.map(b => ({
        id: b.id, slug: b.id, title: b.name, summary: b.description,
        itemType: "business" as MapItemType, href: b.websiteUrl || `/map?business=${b.id}`,
        regionId: sowonRegion.id, regionName: guessRegion(b.mapAddress || b.address || b.name),
        image: null, status: PublishStatus.published,
        latitude: b.latitude, longitude: b.longitude, mapAddress: b.mapAddress
      }))
    ];

    if (mapItems.length === 0) {
      return FALLBACK_MAP_ITEMS;
    }

    return mapItems;
  } catch (error) {
    console.warn("Failed to fetch map items from DB, using fallback:", error);
    return FALLBACK_MAP_ITEMS;
  }
}

interface MapPageProps {
  searchParams: Promise<{
    q?: string;
    date?: string;
    guests?: string;
    type?: string;
  }>;
}

export default async function MapPage({ searchParams }: MapPageProps) {
  const { q, date, guests, type } = await searchParams;
  const items = await getMapItems();

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="px-6 py-8 sm:py-12 bg-muted/20 border-b">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link href="/" className="hover:text-foreground">홈</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">지도 탐색</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">소원권역 지도 탐색</h1>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            숙소, 체험, 주민소득상품, 추천 코스를 권역별로 살펴보세요.
          </p>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-screen-xl mx-auto w-full flex flex-col gap-6">

        {/* T-010 Rule Message */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm leading-relaxed text-foreground/80 shadow-sm flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p>
            이 지도는 <strong>차량 배차나 이동수단 예약이 아닙니다.</strong><br/>
            소원권역에서 머물 곳과 주변 도보권 및 현장 집결 중심으로 즐길 수 있는 로컬 프로그램을 탐색하기 위한 화면입니다.
          </p>
        </div>

        {/* Interactive Map Shell (Client Component) */}
        <PublicMapClient
          initialItems={items}
          initialQuery={q}
          initialDate={date}
          initialGuests={guests}
          initialType={type}
        />

      </main>
    </div>
  );
}
