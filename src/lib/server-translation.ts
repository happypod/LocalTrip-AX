import { cookies } from "next/headers";
import { CONTENT_TRANSLATION_LOCALES } from "@/lib/content-translation";

type ServerTranslationLocale = "ko" | (typeof CONTENT_TRANSLATION_LOCALES)[number];

function isServerTranslationLocale(value: string): value is ServerTranslationLocale {
  return value === "ko" || CONTENT_TRANSLATION_LOCALES.some((locale) => locale === value);
}

export async function getServerTranslationLocale(): Promise<ServerTranslationLocale> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("ltax_lang")?.value;
  if (lang && isServerTranslationLocale(lang)) {
    return lang;
  }
  return "ko";
}
