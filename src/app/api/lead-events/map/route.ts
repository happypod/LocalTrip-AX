import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import {
  isPublicApiValidationError,
  readEnumField,
  readJsonRecord,
  readStringField,
} from "@/lib/public-api-validation";
import { logOperationError, logOperationInfo } from "@/lib/operation-log";

const REGION_REF_PATTERN = /^[a-zA-Z0-9_-]+$/;
const MAP_ACTION_TYPES = ["marker_click", "detail_click", "directions_click"] as const;
const MAP_TARGET_TYPES = ["accommodation", "experience", "local_income_program", "business_profile"] as const;

export async function POST(req: Request) {
  try {
    const body = await readJsonRecord(req);
    
    // Validate inputs
    const regionRef = readStringField(body, "regionId", {
      max: 64,
      pattern: REGION_REF_PATTERN,
      code: "INVALID_REGION",
    }) ?? "sowon"; // Default to sowon for MVP
    
    const targetType = readEnumField(body, "targetType", MAP_TARGET_TYPES, {
      required: true,
      code: "INVALID_TARGET_TYPE",
    });
    
    const action = readEnumField(body, "action", MAP_ACTION_TYPES, {
      required: true,
      code: "INVALID_ACTION",
    });
    
    const targetId = readStringField(body, "targetId", { max: 100 });
    const targetSlug = readStringField(body, "targetSlug", { max: 100 });
    const targetTitle = readStringField(body, "targetTitle", { max: 255 });

    const prisma = getPrisma();

    // Find region
    const region = await prisma.region.findFirst({
      where: {
        OR: [
          { id: regionRef },
          { slug: regionRef.toLowerCase() },
        ],
      },
      select: { id: true }
    });

    if (!region) {
      logOperationError("map_lead_event_save_failed", new Error("Region not found"), {
        route: "/api/lead-events/map",
        regionId: regionRef,
      });
      return NextResponse.json({ ok: true }); // Fail gracefully
    }

    const userAgent = req.headers.get("user-agent")?.substring(0, 255);
    const referrer = req.headers.get("referer")?.substring(0, 255);

    // Create lead event with website_click and map metadata
    await prisma.leadEvent.create({
      data: {
        regionId: region.id,
        eventType: "website_click",
        targetType: targetType,
        targetId: targetId || targetSlug || "unknown",
        sourcePath: "/map",
        userAgent,
        referrer,
        metadata: {
          source: "map_marker",
          action: action,
          provider: "naver",
          targetType: targetType,
          targetId: targetId,
          targetSlug: targetSlug,
          targetTitle: targetTitle
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isPublicApiValidationError(error)) {
      logOperationInfo("map_lead_event_validation_failed", {
        route: "/api/lead-events/map",
        errorCode: error.code,
        statusCode: error.status,
      });
      return NextResponse.json(
        { ok: false, error: error.code },
        { status: error.status },
      );
    }

    logOperationError("map_lead_event_save_failed", error, {
      route: "/api/lead-events/map",
      operation: "create_lead_event",
    });
    // Best effort: fail silently for user
    return NextResponse.json({ ok: true });
  }
}
