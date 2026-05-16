import "server-only";

import { PublishStatus } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { logOperationError } from "@/lib/operation-log";
import { MapItem, MapItemType } from "./map-types";

export * from "./map-types";

export interface MapFetchResult {
  items: MapItem[];
  isFallback: boolean;
  /** "db" = DB 정상 데이터, "empty" = DB 정상이나 데이터 없음, "error" = DB 연결/조회 실패 */
  source: "db" | "empty" | "error";
}

export async function getMapItems(): Promise<MapFetchResult> {
  try {
    const prisma = getPrisma();
    await prisma.$connect();

    const sowonRegion = await prisma.region.findUnique({
      where: { slug: "sowon" },
      select: { id: true },
    });

    if (!sowonRegion) {
      logOperationError("map_region_not_found", new Error("Region 'sowon' not found"), {
        route: "/map",
        operation: "getMapItems",
      });
      return { items: [], isFallback: true, source: "empty" };
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

    const guessRegion = (text: string | null) => {
      if (!text) return "소원면 전체";
      const lower = text.toLowerCase();
      if (lower.includes("만리포") || lower.includes("mallipo") || lower.includes("house")) return "만리포 권역";
      if (lower.includes("천리포") || lower.includes("cheonripo") || lower.includes("dining")) return "천리포 권역";
      if (lower.includes("모항") || lower.includes("의항") || lower.includes("mohang") || lower.includes("uihang")) return "모항·의항 권역";
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

    return { items: mapItems, isFallback: mapItems.length === 0, source: mapItems.length > 0 ? "db" : "empty" };
  } catch (error) {
    logOperationError("map_db_fetch_failed", error, {
      route: "/map",
      operation: "getMapItems",
    });
    return { items: [], isFallback: true, source: "error" };
  }
}
