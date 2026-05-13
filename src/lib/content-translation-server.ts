import "server-only";

import { getPrisma } from "@/lib/prisma";
import { ContentTranslationTargetType, getLocalizedContent } from "./content-translation";

export async function getLocalizedList<
  T extends {
    id: string;
    title: string;
    summary: string | null;
    description?: string | null;
    address?: string | null;
    capacityText?: string | null;
    priceText?: string | null;
    linkedLifeService?: string | null;
    residentRole?: string | null;
    revenueUse?: string | null;
    tag?: string | null;
  },
>(originalList: T[], targetType: ContentTranslationTargetType, locale: string): Promise<T[]> {
  if (locale === "ko" || originalList.length === 0) {
    return originalList;
  }

  try {
    const prisma = getPrisma();
    const itemIds = originalList.map((item) => item.id);

    const translations = await prisma.contentTranslation.findMany({
      where: {
        targetType,
        targetId: { in: itemIds },
        locale: { in: [locale, "en"] },
      },
    });

    return originalList.map((item) => {
      const itemTranslations = translations.filter((t) => t.targetId === item.id);
      return getLocalizedContent(item, itemTranslations, locale);
    });
  } catch (error) {
    console.warn(`Failed to batch localize ${targetType} list:`, error);
    return originalList;
  }
}
