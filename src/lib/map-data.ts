import { PublishStatus } from "@prisma/client";
import { FALLBACK_STAYS } from "./stay-data";
import { FALLBACK_EXPERIENCES } from "./experience-data";
import { FALLBACK_PROGRAMS } from "./program-data";
import { FALLBACK_COURSES } from "./course-data";

export type MapItemType = "stay" | "experience" | "program" | "course" | "business";

export interface MapItem {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  itemType: MapItemType;
  href: string;
  regionId: string;
  regionName: string; // e.g. "만리포", "천리포", etc.
  latitude?: number | null;
  longitude?: number | null;
  mapAddress?: string | null;
  tags?: string[];
  image?: string | null;
  status: string;
}

export interface MapRegionUI {
  id: string;
  name: string;
  summary: string;
  lat: number;
  lng: number;
}

export const MAP_REGIONS: MapRegionUI[] = [
  { id: "mallipo", name: "만리포 권역", summary: "서핑과 노을의 중심", lat: 36.7865, lng: 126.1362 },
  { id: "cheonlipo", name: "천리포 권역", summary: "수목원, 해식동굴, 어촌 밥상", lat: 36.7977, lng: 126.1481 },
  { id: "mohang", name: "모항·의항 권역", summary: "항구의 활기와 수산물", lat: 36.7725, lng: 126.1511 },
];

// Combine fallback data into normalized MapItems
// Note: In real DB, regionName might be stored or inferred. For fallback we assign manually.
export const FALLBACK_MAP_ITEMS: MapItem[] = [
  // Stays
  ...FALLBACK_STAYS.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    itemType: "stay" as MapItemType,
    href: `/stays/${s.slug}`,
    regionId: "sowon",
    regionName: s.slug.includes("cheonripo") ? "천리포 권역" : "만리포 권역",
    image: s.images?.[0] || null,
    status: s.status,
  })),
  // Experiences
  ...FALLBACK_EXPERIENCES.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    summary: e.summary,
    itemType: "experience" as MapItemType,
    href: `/experiences/${e.slug}`,
    regionId: "sowon",
    regionName: "만리포 권역", // default to mallipo for fallback
    image: e.images?.[0] || null,
    status: e.status,
  })),
  // Programs
  ...FALLBACK_PROGRAMS.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    itemType: "program" as MapItemType,
    href: `/programs/${p.slug}`,
    regionId: "sowon",
    regionName: p.slug.includes("village-dining") ? "천리포 권역" : "모항·의항 권역",
    image: p.images?.[0] || null,
    status: p.status,
  })),
  // Courses
  ...FALLBACK_COURSES.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    summary: c.summary,
    itemType: "course" as MapItemType,
    href: `/courses/${c.slug}`,
    regionId: "sowon",
    regionName: c.slug.includes("sunset") ? "만리포 권역" : (c.slug.includes("artistic") ? "천리포 권역" : "소원면 전체"),
    image: c.images?.[0] || null,
    status: c.status,
  })),
].filter(i => i.status === PublishStatus.published);
