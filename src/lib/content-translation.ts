export const CONTENT_TRANSLATION_TARGET_TYPES = [
  "accommodation",
  "experience",
  "local_income_program",
  "course",
  "training_course",
  "certification",
  "event",
] as const;

export type ContentTranslationTargetType =
  (typeof CONTENT_TRANSLATION_TARGET_TYPES)[number];

export const CONTENT_TRANSLATION_LOCALES = ["en", "zh-cn", "ja-jp"] as const;

export type ContentTranslationLocale =
  (typeof CONTENT_TRANSLATION_LOCALES)[number];

export function assertValidTranslationTargetType(
  type: string
): asserts type is ContentTranslationTargetType {
  if (
    !CONTENT_TRANSLATION_TARGET_TYPES.includes(
      type as ContentTranslationTargetType
    )
  ) {
    throw new Error(`Invalid translation target type: ${type}`);
  }
}

export function assertValidTranslationLocale(
  locale: string
): asserts locale is ContentTranslationLocale {
  if (
    !CONTENT_TRANSLATION_LOCALES.includes(locale as ContentTranslationLocale)
  ) {
    throw new Error(`Invalid translation locale: ${locale}`);
  }
}

export interface ContentTranslationFormData {
  title?: string;
  summary?: string;
  description?: string;
  address?: string;
  capacityText?: string;
  priceText?: string;
  linkedLifeService?: string;
  residentRole?: string;
  revenueUse?: string;
}

export interface ContentTranslationMetadata {
  address?: string | null;
  capacityText?: string | null;
  priceText?: string | null;
  linkedLifeService?: string | null;
  residentRole?: string | null;
  revenueUse?: string | null;
  tag?: string | null;
}

export interface ContentTranslationRecord {
  locale: string;
  title: string | null;
  summary: string | null;
  description: string | null;
  metadata?: unknown;
}

export function isContentTranslationMetadata(
  value: unknown
): value is ContentTranslationMetadata {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getMetadataText(
  metadata: unknown,
  field: keyof ContentTranslationMetadata
) {
  if (!isContentTranslationMetadata(metadata)) {
    return undefined;
  }

  const value = metadata[field];
  return typeof value === "string" && value.trim() ? value : undefined;
}

export function getLocalizedContent<
  T extends {
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
>(original: T, translations: ContentTranslationRecord[], currentLocale: string): T {
  if (currentLocale === "ko") {
    return original;
  }

  const selectedTranslation = translations.find((t) => t.locale === currentLocale);
  const englishTranslation = translations.find((t) => t.locale === "en");

  const getMetadataField = (field: keyof ContentTranslationMetadata) =>
    getMetadataText(selectedTranslation?.metadata, field) ||
    getMetadataText(englishTranslation?.metadata, field);

  return {
    ...original,
    title: selectedTranslation?.title || englishTranslation?.title || original.title,
    summary:
      selectedTranslation?.summary ||
      englishTranslation?.summary ||
      original.summary,
    ...(original.description !== undefined
      ? {
          description:
            selectedTranslation?.description ||
            englishTranslation?.description ||
            original.description,
        }
      : {}),
    ...(original.tag !== undefined
      ? {
          tag:
            getMetadataField("tag") ||
            original.tag,
        }
      : {}),
    ...(original.address !== undefined
      ? {
          address:
            getMetadataField("address") ||
            original.address,
        }
      : {}),
    ...(original.capacityText !== undefined
      ? {
          capacityText:
            getMetadataField("capacityText") ||
            original.capacityText,
        }
      : {}),
    ...(original.priceText !== undefined
      ? {
          priceText:
            getMetadataField("priceText") ||
            original.priceText,
        }
      : {}),
    ...(original.linkedLifeService !== undefined
      ? {
          linkedLifeService:
            getMetadataField("linkedLifeService") ||
            original.linkedLifeService,
        }
      : {}),
    ...(original.residentRole !== undefined
      ? {
          residentRole:
            getMetadataField("residentRole") || original.residentRole,
        }
      : {}),
    ...(original.revenueUse !== undefined
      ? { revenueUse: getMetadataField("revenueUse") || original.revenueUse }
      : {}),
  };
}

export function generateAITranslationPrompt(
  targetType: string,
  locale: string,
  title: string | null,
  summary: string | null,
  description: string | null,
  extraFields?: Pick<
    ContentTranslationFormData,
    "linkedLifeService" | "residentRole" | "revenueUse"
  >
): string {
  const localeName =
    locale === "en"
      ? "English"
      : locale === "zh-cn"
        ? "Simplified Chinese"
        : "Japanese";

  let prompt = `Translate the following tourism content into ${localeName}.\n`;
  prompt += `Target Type: ${targetType}\n\n`;

  prompt += `[Rules]\n`;
  prompt += `- Maintain the context of a tourism/connection platform.\n`;
  prompt += `- Do NOT use any expressions implying direct payment or immediate booking confirmation.\n`;
  prompt += `- Do NOT exaggerate the content.\n`;
  if (targetType === "local_income_program") {
    prompt += `- This is a Local Income Program. Preserve linked life services, resident roles, and revenue use for the local community.\n`;
  }

  prompt += `\n[Source Text]\n`;
  prompt += `Title: ${title || "(Empty)"}\n`;
  prompt += `Summary: ${summary || "(Empty)"}\n`;
  prompt += `Description: ${description || "(Empty)"}\n`;

  if (targetType === "local_income_program") {
    prompt += `Linked Life Service: ${extraFields?.linkedLifeService || "(Empty)"}\n`;
    prompt += `Resident Role: ${extraFields?.residentRole || "(Empty)"}\n`;
    prompt += `Revenue Use: ${extraFields?.revenueUse || "(Empty)"}\n`;
  }

  return prompt;
}

