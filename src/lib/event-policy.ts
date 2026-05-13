export const DEFAULT_EVENT_GRADIENT = "from-blue-50 to-indigo-100/40";
export const DEFAULT_EVENT_HREF = "/stays";
export const SAFE_EVENT_FALLBACK_HREF = "/events";

export const EVENT_GRADIENT_PRESETS = [
  { label: "Blue / Indigo", value: DEFAULT_EVENT_GRADIENT },
  { label: "Emerald / Teal", value: "from-emerald-50 to-teal-100/40" },
  { label: "Teal / Emerald", value: "from-teal-50 to-emerald-100/40" },
  { label: "Amber / Orange", value: "from-amber-50 to-orange-100/40" },
  { label: "Amber / Yellow", value: "from-amber-50 to-yellow-100/40" },
  { label: "Rose / Pink", value: "from-rose-50 to-pink-100/40" },
  { label: "Violet / Purple", value: "from-violet-50 to-purple-100/40" },
  { label: "Slate / Zinc", value: "from-slate-50 to-zinc-100/40" },
  { label: "Gray / Slate", value: "from-gray-50 to-slate-100/40" },
] as const;

export const EVENT_HREF_PRESETS = [
  { label: "숙소 목록", value: "/stays" },
  { label: "체험 목록", value: "/experiences" },
  { label: "주민소득상품 목록", value: "/programs" },
  { label: "추천 코스 목록", value: "/courses" },
  { label: "로컬 지도", value: "/map" },
  { label: "입점신청", value: "/partner/apply" },
  { label: "이벤트 목록", value: "/events" },
  { label: "고객센터", value: "/customer-center" },
] as const;

const EVENT_GRADIENT_VALUES: Set<string> = new Set(
  EVENT_GRADIENT_PRESETS.map((preset) => preset.value)
);

const EVENT_HREF_VALUES: Set<string> = new Set(
  EVENT_HREF_PRESETS.map((preset) => preset.value)
);

export function isAllowedEventGradient(value: string) {
  return EVENT_GRADIENT_VALUES.has(value);
}

export function isAllowedEventHref(value: string) {
  return EVENT_HREF_VALUES.has(value);
}

export function normalizeEventGradientForDisplay(value?: string | null) {
  const gradient = value?.trim() || DEFAULT_EVENT_GRADIENT;
  return isAllowedEventGradient(gradient) ? gradient : DEFAULT_EVENT_GRADIENT;
}

export function normalizeEventHrefForDisplay(value?: string | null) {
  const href = value?.trim() || SAFE_EVENT_FALLBACK_HREF;
  return isAllowedEventHref(href) ? href : SAFE_EVENT_FALLBACK_HREF;
}
