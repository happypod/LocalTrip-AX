export type LeadActionType =
  | "view"
  | "detail_click"
  | "phone_click"
  | "kakao_click"
  | "naver_booking_click"
  | "homepage_click"
  | "inquiry_submit"
  | "map_click"
  | "share_click"
  | "premium_pr_matterport_click"
  | "premium_pr_host_video_click"
  | "premium_pr_drone_video_click";

export type LeadItemType = 
  | "accommodation" 
  | "experience" 
  | "local_income_program" 
  | "course" 
  | "region" 
  | "general";

export interface TrackLeadEventPayload {
  regionId?: string; // defaults to "sowon" in API if not provided
  itemType: LeadItemType;
  itemId?: string;
  itemSlug?: string;
  actionType: LeadActionType;
  sourcePath?: string;
  targetUrl?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

/**
 * Sends a tracking event to the lead-events API.
 * Uses fire-and-forget approach to ensure it never blocks user navigation.
 */
export function trackLeadEvent(payload: TrackLeadEventPayload): void {
  if (typeof window === "undefined") {
    return; // Only run on client side
  }

  // Auto-fill source path if not provided
  const finalPayload = {
    ...payload,
    sourcePath: payload.sourcePath || window.location.pathname,
  };

  fetch("/api/lead-events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(finalPayload),
    // Use keepalive to ensure the request finishes even if the page unloads
    keepalive: true, 
  }).catch((err) => {
    // Silent fail to preserve user experience
    console.debug("[Tracking] LeadEvent failed to send:", err);
  });
}
