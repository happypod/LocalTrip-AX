import "server-only";

import { getPrisma } from "@/lib/prisma";
import { getLocalizedList } from "@/lib/content-translation-server";

export type CourseBuilderItemType =
  | "accommodation"
  | "experience"
  | "local_income_program";

export interface CourseBuilderOption {
  id: string;
  itemType: CourseBuilderItemType;
  slug: string;
  title: string;
  summary: string;
  imageUrl?: string | null;
  href: string;
  meta?: string | null;
  priceText?: string | null;
}

export interface CourseBuilderData {
  stays: CourseBuilderOption[];
  experiences: CourseBuilderOption[];
  programs: CourseBuilderOption[];
}

type LocalizableOption = CourseBuilderOption & {
  description?: string | null;
  location?: string | null;
  address?: string | null;
  capacityText?: string | null;
  durationText?: string | null;
};

function firstImage(images?: string[] | null) {
  return Array.isArray(images) && images.length > 0 ? images[0] : null;
}

function buildOption(
  item: {
    id: string;
    slug: string;
    title: string;
    summary: string | null;
    images?: string[] | null;
    address?: string | null;
    location?: string | null;
    durationText?: string | null;
    priceText?: string | null;
  },
  itemType: CourseBuilderItemType,
): LocalizableOption {
  const basePath =
    itemType === "accommodation"
      ? "/stays"
      : itemType === "experience"
        ? "/experiences"
        : "/programs";

  return {
    id: item.id,
    itemType,
    slug: item.slug,
    title: item.title,
    summary: item.summary || "",
    imageUrl: firstImage(item.images),
    href: `${basePath}/${item.slug}`,
    meta: item.address || item.location || item.durationText || null,
    priceText: item.priceText || null,
    address: item.address || null,
    location: item.location || null,
    durationText: item.durationText || null,
  };
}

function fallbackData(): CourseBuilderData {
  return {
    stays: [],
    experiences: [],
    programs: [],
  };
}

async function localizeOptions(
  data: CourseBuilderData,
  locale: string,
): Promise<CourseBuilderData> {
  const [stays, experiences, programs] = await Promise.all([
    getLocalizedList(data.stays, "accommodation", locale),
    getLocalizedList(data.experiences, "experience", locale),
    getLocalizedList(data.programs, "local_income_program", locale),
  ]);

  return { stays, experiences, programs };
}

export async function getCourseBuilderData(locale: string): Promise<CourseBuilderData> {
  try {
    const prisma = getPrisma();
    await prisma.$connect();

    const region = await prisma.region.findUnique({
      where: { slug: "sowon" },
      select: { id: true },
    });

    if (!region) {
      return localizeOptions(fallbackData(), locale);
    }

    const [stays, experiences, programs] = await Promise.all([
      prisma.accommodation.findMany({
        where: { regionId: region.id, status: "published" },
        orderBy: [{ createdAt: "desc" }],
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          images: true,
          address: true,
          priceText: true,
        },
      }),
      prisma.experience.findMany({
        where: { regionId: region.id, status: "published" },
        orderBy: [{ createdAt: "desc" }],
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          images: true,
          location: true,
          durationText: true,
          priceText: true,
        },
      }),
      prisma.localIncomeProgram.findMany({
        where: { regionId: region.id, status: "published" },
        orderBy: [{ createdAt: "desc" }],
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          images: true,
          location: true,
          durationText: true,
          priceText: true,
        },
      }),
    ]);

    const data = {
      stays: stays.map((item) => buildOption(item, "accommodation")),
      experiences: experiences.map((item) => buildOption(item, "experience")),
      programs: programs.map((item) => buildOption(item, "local_income_program")),
    };

    const hasAnyOption =
      data.stays.length + data.experiences.length + data.programs.length > 0;

    return localizeOptions(hasAnyOption ? data : fallbackData(), locale);
  } catch (error) {
    console.warn("Failed to load course builder data:", error);
    return localizeOptions(fallbackData(), locale);
  }
}
