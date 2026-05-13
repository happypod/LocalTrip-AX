import { PersonaThemeId } from "./persona-theme";

/**
 * Persona keywords for content scoring.
 */
export const PERSONA_CURATION_KEYWORDS: Record<PersonaThemeId, string[]> = {
  masil: ["가족", "아이", "갯벌", "체험", "밥상", "마을", "쉬운", "초보", "가족여행", "어린이", "학습", "놀이"],
  haengrang: ["한옥", "정갈", "전통", "조용", "쉼", "밥상", "환대", "마을", "고택", "휴식", "프리미엄", "단아한"],
  meomulm: ["감성", "바다", "노을", "조용", "워케이션", "산책", "머묾", "여유", "사색", "힐링", "혼자", "커플"],
  local: ["주민", "마을", "어촌", "밥상", "장터", "특산", "소금", "로컬", "현지", "사투리", "토속", "인심"],
};

/**
 * Preferred order of home sections based on the persona.
 * sections are: stay, experience, program, course
 */
export const PERSONA_SECTION_PRIORITY: Record<PersonaThemeId, string[]> = {
  masil: ["experience", "program", "stay", "course"],
  haengrang: ["stay", "program", "course", "experience"],
  meomulm: ["stay", "course", "experience", "program"],
  local: ["program", "experience", "course", "stay"],
};

/**
 * Pure stable sorting function based on keyword matching for a specific persona theme.
 * 
 * @param items Original array to be sorted
 * @param theme Active persona theme
 * @param getText A function that extracts searchable string content from an item
 */
export function sortByPersona<T>(
  items: T[],
  theme: PersonaThemeId,
  getText: (item: T) => string | null | undefined
): T[] {
  if (!items || items.length === 0) return [];

  const keywords = PERSONA_CURATION_KEYWORDS[theme] || [];
  
  // Map items to hold their original index for fully stable sorting
  const itemsWithScores = items.map((item, originalIndex) => {
    const text = (getText(item) || "").toLowerCase();
    let score = 0;
    
    if (text) {
      keywords.forEach(keyword => {
        // We use split to count occurrences of keyword
        const kw = keyword.toLowerCase();
        const matches = text.split(kw).length - 1;
        score += matches;
      });
    }
    
    return { item, score, originalIndex };
  });

  // Sort desc by score, then asc by original index to ensure stable behavior
  itemsWithScores.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score; // High score first
    }
    return a.originalIndex - b.originalIndex; // Preserve order
  });

  return itemsWithScores.map(x => x.item);
}

/**
 * Returns the section priority order for the current theme.
 */
export function getPersonaSectionOrder(theme: PersonaThemeId): string[] {
  return PERSONA_SECTION_PRIORITY[theme] || ["stay", "experience", "program", "course"];
}
