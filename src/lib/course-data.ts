import { Course, CourseItemType, PublishStatus } from "@prisma/client";

export interface CourseItemUI {
  id: string;
  itemType: CourseItemType;
  sortOrder: number;
  note?: string | null;
  time?: string; // Optional time display like "10:00" or "Day 1"
  title: string; // The display title of the step
  description?: string;
  slug?: string; // Link to the actual item if it exists
}

export interface CourseUI extends Partial<Course> {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string | null;
  images: string[];
  status: PublishStatus;
  regionId: string;
  // Extended fields for fallback/UI
  targetType?: string | null;
  durationType?: string | null;
  season?: string | null;
  routeItems: CourseItemUI[];
  linkedStayCount: number;
  linkedExpCount: number;
  linkedProgCount: number;
}

// Seed/Fallback arrays are moved to prisma/seed-data.ts to isolate runtime bundles.
export const FALLBACK_COURSES: CourseUI[] = [];
