"use server";

import { requireAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  assertValidTranslationLocale,
  assertValidTranslationTargetType,
  ContentTranslationFormData,
} from "@/lib/content-translation";

export async function saveContentTranslation(
  targetType: string,
  targetId: string,
  locale: string,
  data: ContentTranslationFormData
) {
  await requireAdminSession();

  assertValidTranslationTargetType(targetType);
  assertValidTranslationLocale(locale);

  if (!targetId) {
    throw new Error("Target ID is required.");
  }

  const prisma = getPrisma();
  let regionId: string | undefined;

  // Verify existence and get regionId
  switch (targetType) {
    case "accommodation": {
      const entity = await prisma.accommodation.findUnique({ where: { id: targetId }, select: { regionId: true } });
      if (!entity) throw new Error("Accommodation not found");
      regionId = entity.regionId;
      break;
    }
    case "experience": {
      const entity = await prisma.experience.findUnique({ where: { id: targetId }, select: { regionId: true } });
      if (!entity) throw new Error("Experience not found");
      regionId = entity.regionId;
      break;
    }
    case "local_income_program": {
      const entity = await prisma.localIncomeProgram.findUnique({ where: { id: targetId }, select: { regionId: true } });
      if (!entity) throw new Error("Local Income Program not found");
      regionId = entity.regionId;
      break;
    }
    case "course": {
      const entity = await prisma.course.findUnique({ where: { id: targetId }, select: { regionId: true } });
      if (!entity) throw new Error("Course not found");
      regionId = entity.regionId;
      break;
    }
    case "training_course": {
      const entity = await prisma.trainingCourse.findUnique({ where: { id: targetId }, select: { regionId: true } });
      if (!entity) throw new Error("Training Course not found");
      regionId = entity.regionId;
      break;
    }
    case "certification": {
      const entity = await prisma.certification.findUnique({ where: { id: targetId }, select: { regionId: true } });
      if (!entity) throw new Error("Certification not found");
      regionId = entity.regionId;
      break;
    }
    case "event": {
      const entity = await prisma.event.findUnique({ where: { id: targetId }, select: { regionId: true } });
      if (!entity) throw new Error("Event not found");
      regionId = entity.regionId;
      break;
    }
    default:
      throw new Error("Invalid target type");
  }

  if (!regionId) {
    throw new Error("Region ID not found for target");
  }

  const safeTrim = (str?: string) => str?.trim() || null;

  const metadata = {
    address: safeTrim(data.address),
    capacityText: safeTrim(data.capacityText),
    priceText: safeTrim(data.priceText),
    durationText: safeTrim(data.durationText),
    linkedLifeService: safeTrim(data.linkedLifeService),
    residentRole: safeTrim(data.residentRole),
    revenueUse: safeTrim(data.revenueUse),
  };

  // Remove empty values from metadata
  Object.keys(metadata).forEach(key => {
    if (metadata[key as keyof typeof metadata] === null) {
      delete metadata[key as keyof typeof metadata];
    }
  });

  // Upsert the translation
  await prisma.contentTranslation.upsert({
    where: {
      targetType_targetId_locale: {
        targetType,
        targetId,
        locale,
      },
    },
    update: {
      title: safeTrim(data.title),
      summary: safeTrim(data.summary),
      description: safeTrim(data.description),
      metadata: Object.keys(metadata).length > 0 ? metadata : Prisma.DbNull,
    },
    create: {
      regionId,
      targetType,
      targetId,
      locale,
      title: safeTrim(data.title),
      summary: safeTrim(data.summary),
      description: safeTrim(data.description),
      metadata: Object.keys(metadata).length > 0 ? metadata : Prisma.DbNull,
    },
  });

  // Revalidate paths to update cache
  revalidatePath("/admin/[category]/[id]/edit", "page");
  revalidatePath("/", "layout");
}
