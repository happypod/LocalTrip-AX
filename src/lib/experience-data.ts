import { Experience, PublishStatus } from "@prisma/client";

export interface ExperienceUI extends Partial<Experience> {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string | null;
  location?: string | null;
  durationText?: string | null;
  priceText?: string | null;
  capacityText?: string | null;
  images: string[];
  phone?: string | null;
  kakaoUrl?: string | null;
  naverBookingUrl?: string | null;
  websiteUrl?: string | null;
  status: PublishStatus;
  regionId: string;
  // Extended fields for fallback/future use
  category?: string | null;
  meetingPoint?: string | null;
  preparation?: string | null;
  includes?: string | null;
  excludes?: string | null;
  safetyNotice?: string | null;
}

// Seed/Fallback arrays are moved to prisma/seed-data.ts to isolate runtime bundles.
export const FALLBACK_EXPERIENCES: ExperienceUI[] = [];
