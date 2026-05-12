import koMasil from "../locales/ko-masil.json";
import koHaengrang from "../locales/ko-haengrang.json";
import koMeomulm from "../locales/ko-meomulm.json";
import koLocal from "../locales/ko-local.json";
import enUs from "../locales/en-us.json";
import enUsZen from "../locales/en-us-zen.json";
import zhCn from "../locales/zh-cn.json";
import zhCnZen from "../locales/zh-cn-zen.json";
import jaJp from "../locales/ja-jp.json";
import jaJpZen from "../locales/ja-jp-zen.json";

export type PersonaThemeId = "masil" | "haengrang" | "meomulm" | "local";
export type PersonaLanguageCode = "ko" | "en" | "zh-cn" | "ja-jp";

export interface PersonaDictionary {
  nav: {
    stay: string;
    experience: string;
    localProduct: string;
    course: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  section: {
    recommendedStay: string;
    popularExperience: string;
    localProduct: string;
    recommendedCourse: string;
  };
  badge: {
    stay: string;
    experience: string;
    program: string;
    course: string;
  };
  button: {
    viewAll: string;
    openMap: string;
    apply: string;
  };
}

// Typesafe assignment forcing structured interface check
export const PERSONA_DICTIONARIES: Record<string, PersonaDictionary> = {
  "ko-masil": koMasil as PersonaDictionary,
  "ko-haengrang": koHaengrang as PersonaDictionary,
  "ko-meomulm": koMeomulm as PersonaDictionary,
  "ko-local": koLocal as PersonaDictionary,
  "en-us": enUs as PersonaDictionary,
  "en-us-zen": enUsZen as PersonaDictionary,
  "zh-cn": zhCn as PersonaDictionary,
  "zh-cn-zen": zhCnZen as PersonaDictionary,
  "ja-jp": jaJp as PersonaDictionary,
  "ja-jp-zen": jaJpZen as PersonaDictionary,
};

export const DEFAULT_DICTIONARY_KEY = "ko-meomulm";

/**
 * Maps requested Language + Theme combinations to final dictionary identifiers based on availability.
 */
function resolveDictionaryKey(lang: PersonaLanguageCode, theme: PersonaThemeId): string {
  // 1. Direct mapping for Korean variants
  if (lang === "ko") {
    return `ko-${theme}`;
  }

  // 2. Direct mapping for other languages (Mapping specified in directive)
  // en + masil/local -> en-us, en + haengrang/meomulm -> en-us-zen
  const useZenVariant = theme === "haengrang" || theme === "meomulm";

  if (lang === "en") {
    return useZenVariant ? "en-us-zen" : "en-us";
  }
  if (lang === "zh-cn") {
    return useZenVariant ? "zh-cn-zen" : "zh-cn";
  }
  if (lang === "ja-jp") {
    return useZenVariant ? "ja-jp-zen" : "ja-jp";
  }

  return DEFAULT_DICTIONARY_KEY;
}

/**
 * Retrieves the appropriate persona dictionary based on language and theme.
 * Implements layered fallback hierarchy:
 * 1. Exact mapped combo
 * 2. Standard language baseline (e.g. en-us)
 * 3. Global fallback (ko-meomulm)
 */
export function getPersonaDictionary(
  lang: PersonaLanguageCode = "ko",
  theme: PersonaThemeId = "meomulm"
): PersonaDictionary {
  const resolvedKey = resolveDictionaryKey(lang, theme);
  const targetDict = PERSONA_DICTIONARIES[resolvedKey];

  if (targetDict) {
    return targetDict;
  }

  // Fallback to standard language package if available
  const fallbackLangKey = lang === "ko" ? "ko-meomulm" : lang === "en" ? "en-us" : lang === "zh-cn" ? "zh-cn" : "ja-jp";
  const langDict = PERSONA_DICTIONARIES[fallbackLangKey];
  if (langDict) {
    return langDict;
  }

  // Absolute ultimate fallback
  return PERSONA_DICTIONARIES[DEFAULT_DICTIONARY_KEY];
}
