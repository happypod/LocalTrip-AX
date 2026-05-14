export type PremiumPrFeatureKey =
  | "matterportUrl"
  | "hostVideoUrl"
  | "droneViewUrl";

export type PremiumPrFeatureType = "matterport" | "host_video" | "drone_video";

export type PremiumPrFeatures = Record<PremiumPrFeatureKey, string | null>;

export type PremiumPrDisplay = {
  badgeLabel: string;
};

export type PremiumPrContract = {
  packageName: string | null;
  expiresAt: string | null;
};

export type PremiumPrConfig = {
  isPremium: boolean;
  features: PremiumPrFeatures;
  display: PremiumPrDisplay;
  contract: PremiumPrContract;
};

export const DEFAULT_PREMIUM_PR: PremiumPrConfig = {
  isPremium: false,
  features: {
    matterportUrl: null,
    hostVideoUrl: null,
    droneViewUrl: null,
  },
  display: {
    badgeLabel: "3D 숙소 투어",
  },
  contract: {
    packageName: null,
    expiresAt: null,
  },
};

export const PREMIUM_PR_ALLOWED_IFRAME_ORIGINS = [
  "https://my.matterport.com",
  "https://www.youtube.com",
  "https://www.youtube-nocookie.com",
  "https://player.vimeo.com",
] as const;

const PREMIUM_PR_ALLOWED_PATH_PREFIXES: Record<string, string[]> = {
  "my.matterport.com": ["/show/"],
  "www.youtube.com": ["/embed/"],
  "www.youtube-nocookie.com": ["/embed/"],
  "player.vimeo.com": ["/video/"],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanOptionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function cleanBadgeLabel(value: unknown) {
  const label = cleanOptionalText(value);
  return label ?? DEFAULT_PREMIUM_PR.display.badgeLabel;
}

export function isAllowedPremiumPrIframeUrl(value: string | null | undefined) {
  if (!value) return false;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;

    const pathPrefixes = PREMIUM_PR_ALLOWED_PATH_PREFIXES[url.hostname];
    if (!pathPrefixes) return false;

    return pathPrefixes.some((prefix) => url.pathname.startsWith(prefix));
  } catch {
    return false;
  }
}

export function normalizePremiumPr(value: unknown): PremiumPrConfig {
  if (!isRecord(value)) {
    return DEFAULT_PREMIUM_PR;
  }

  const features = isRecord(value.features) ? value.features : {};
  const display = isRecord(value.display) ? value.display : {};
  const contract = isRecord(value.contract) ? value.contract : {};

  return {
    isPremium: value.isPremium === true,
    features: {
      matterportUrl: cleanOptionalText(features.matterportUrl),
      hostVideoUrl: cleanOptionalText(features.hostVideoUrl),
      droneViewUrl: cleanOptionalText(features.droneViewUrl),
    },
    display: {
      badgeLabel: cleanBadgeLabel(display.badgeLabel),
    },
    contract: {
      packageName: cleanOptionalText(contract.packageName),
      expiresAt: cleanOptionalText(contract.expiresAt),
    },
  };
}

export function isPremiumPrEnabled(value: unknown) {
  const premiumPr = normalizePremiumPr(value);

  if (!premiumPr.isPremium) {
    return false;
  }

  return Object.values(premiumPr.features).some((url) =>
    isAllowedPremiumPrIframeUrl(url)
  );
}

export function getPremiumPrFeatureType(
  key: PremiumPrFeatureKey
): PremiumPrFeatureType {
  if (key === "matterportUrl") return "matterport";
  if (key === "hostVideoUrl") return "host_video";
  return "drone_video";
}
