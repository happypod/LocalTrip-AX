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
