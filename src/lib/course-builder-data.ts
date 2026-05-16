import "server-only";

import { getPrisma } from "@/lib/prisma";
import { getLocalizedList } from "@/lib/content-translation-server";
import { logOperationError } from "@/lib/operation-log";

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
  /** "db" = DB 정상 데이터, "empty" = DB 정상이나 데이터 없음, "error" = DB 연결/조회 실패 */
  source: "db" | "empty" | "error";
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

function fallbackData(source: "empty" | "error"): CourseBuilderData {
  return {
    stays: [],
    experiences: [],
    programs: [],
    source,
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

  return { stays, experiences, programs, source: data.source };
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
      logOperationError("course_builder_region_not_found", new Error("Region 'sowon' not found"), {
        route: "/course-builder",
        operation: "getCourseBuilderData",
      });
      return localizeOptions(fallbackData("empty"), locale);
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

    return localizeOptions(
      hasAnyOption ? { ...data, source: "db" as const } : fallbackData("empty"),
      locale,
    );
  } catch (error) {
    logOperationError("course_builder_db_fetch_failed", error, {
      route: "/course-builder",
      operation: "getCourseBuilderData",
    });
    return localizeOptions(fallbackData("error"), locale);
  }
}
