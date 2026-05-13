import { MapItemType } from "./map-data";

type MapAction = "marker_click" | "detail_click" | "directions_click";
type TrackableMapType = MapItemType | "business";

export function trackMapLeadEvent({
  action,
  targetId,
  targetType,
  targetSlug,
  targetTitle,
  regionId = "sowon",
}: {
  action: MapAction;
  targetId?: string;
  targetType: TrackableMapType;
  targetSlug?: string;
  targetTitle?: string;
  regionId?: string;
}) {
  // Convert map item type to lead event target type
  let apiTargetType = targetType as string;
  if (targetType === "stay") apiTargetType = "accommodation";
  if (targetType === "program") apiTargetType = "local_income_program";
  if (targetType === "business") apiTargetType = "business_profile";
  
  // Exclude content types that do not have a map LeadEvent policy yet.
  if (targetType === "course") {
    return;
  }

  const payload = {
    action,
    targetId,
    targetType: apiTargetType,
    targetSlug,
    targetTitle,
    regionId,
  };

  try {
    const url = "/api/lead-events/map";
    const data = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      // sendBeacon requires Blob to set content-type
      const blob = new Blob([data], { type: "application/json" });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
        keepalive: true,
      }).catch(() => {
        // fail silently
      });
    }
  } catch {
    // best-effort, fail silently to not block UX
  }
}
