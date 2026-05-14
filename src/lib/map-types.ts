export type MapMarkerType = "stay" | "experience" | "program" | "business";

export type MapMarkerItem = {
  id: string;
  type: MapMarkerType;
  title: string;
  summary: string;
  href: string;
  imageUrl?: string;
  latitude: number | null;
  longitude: number | null;
  address?: string | null;
  mapPlaceId?: string | null;
  mapProvider?: string | null;
};

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
