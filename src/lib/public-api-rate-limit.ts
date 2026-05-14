import { logOperationInfo } from "./operation-log";

// Configuration for public API rate limits (MVP in-memory approach)
// Vercel Serverless environment means this memory is per-instance.
// For global enforcement, Vercel WAF must be configured.
export const RATE_LIMIT_RULES = {
  inquiries: {
    limit: 5,
    windowMs: 60 * 1000, // 60 seconds
  },
  partnerApplications: {
    limit: 3,
    windowMs: 10 * 60 * 1000, // 10 minutes
  },
  premiumPrApplications: {
    limit: 3,
    windowMs: 10 * 60 * 1000, // 10 minutes
  },
  leadEvents: {
    limit: 60,
    windowMs: 60 * 1000, // 60 seconds
  },
} as const;

type RateLimitRoute = keyof typeof RATE_LIMIT_RULES;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store
const rateLimitStore = new Map<string, RateLimitEntry>();

// Helper to mask IP for logging privacy
function maskIp(ip: string): string {
  if (!ip || ip === "unknown") return "unknown";
  const ipv4Match = ip.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.)\d{1,3}$/);
  if (ipv4Match) return `${ipv4Match[1]}xxx`;
  
  // Basic IPv6 masking
  if (ip.includes(":")) {
    const parts = ip.split(":");
    if (parts.length > 4) {
      return `${parts.slice(0, 4).join(":")}:xxxx:xxxx:xxxx:xxxx`;
    }
  }
  return "masked";
}

export function extractIp(req: Request): string {
  // First check standard proxy header (take the first IP if multiple)
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp) return firstIp;
  }
  
  // Fallback to real ip if provided by proxy/LB
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

/**
 * Checks rate limit for a given request and route.
 * Returns true if the request is ALLOWED.
 * Returns false if the request is BLOCKED.
 */
export function rateLimitCheck(req: Request, route: RateLimitRoute): boolean {
  const ip = extractIp(req);
  const rule = RATE_LIMIT_RULES[route];
  const now = Date.now();
  const key = `${route}:${ip}`;

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + rule.windowMs,
    });
    return true;
  }

  if (entry.count < rule.limit) {
    // Within limit
    entry.count += 1;
    return true;
  }

  // Limit exceeded
  logOperationInfo("rate_limit_exceeded", {
    route,
    maskedIp: maskIp(ip),
    limit: rule.limit,
    windowMs: rule.windowMs,
  });

  return false;
}
