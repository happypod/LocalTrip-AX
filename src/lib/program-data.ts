import { LocalIncomeProgram, PublishStatus } from "@prisma/client";

export interface LocalIncomeProgramUI extends Partial<LocalIncomeProgram> {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string | null;
  linkedLifeService: string;
  residentRole: string;
  revenueUse: string;
  location?: string | null;
  priceText?: string | null;
  images: string[];
  phone?: string | null;
  kakaoUrl?: string | null;
  naverBookingUrl?: string | null;
  websiteUrl?: string | null;
  status: PublishStatus;
  regionId: string;
  // Extended fields for fallback/future use similar to experience
  durationText?: string | null;
  capacityText?: string | null;
  meetingPoint?: string | null;
  preparation?: string | null;
  includes?: string | null;
  excludes?: string | null;
  safetyNotice?: string | null;
  category?: string | null;
}

// Seed/Fallback arrays are moved to prisma/seed-data.ts to isolate runtime bundles.
export const FALLBACK_PROGRAMS: LocalIncomeProgramUI[] = [];
