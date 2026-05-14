import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { LeadEventType } from "@prisma/client";
import {
  isPublicApiValidationError,
  readEnumField,
  readJsonRecord,
  readStringField,
} from "@/lib/public-api-validation";
import { logOperationError, logOperationInfo } from "@/lib/operation-log";
import { rateLimitCheck } from "@/lib/public-api-rate-limit";

const REGION_SLUG_PATTERN = /^[a-z0-9-]+$/;
const LEAD_ITEM_TYPES = [
  "accommodation",
  "experience",
  "local_income_program",
  "course",
  "general",
] as const;
const LEAD_ACTION_TYPES = [
  "phone_click",
  "kakao_click",
  "naver_booking_click",
  "homepage_click",
  "inquiry_submit",
  "partner_apply_submit",
  "view",
  "detail_click",
  "map_click",
  "share_click",
  "premium_pr_matterport_click",
  "premium_pr_host_video_click",
  "premium_pr_drone_video_click",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeMetadata(value: unknown) {
  if (!isRecord(value)) {
    return {};
  }

  return Object.entries(value).reduce<Record<string, string | number | boolean | null>>(
    (metadata, [key, rawValue]) => {
      if (!/^[a-zA-Z0-9_:-]{1,60}$/.test(key)) {
        return metadata;
      }

      if (
        typeof rawValue === "string" ||
        typeof rawValue === "number" ||
        typeof rawValue === "boolean" ||
        rawValue === null
      ) {
        metadata[key] =
          typeof rawValue === "string" ? rawValue.substring(0, 300) : rawValue;
      }

      return metadata;
    },
    {},
  );
}

export async function POST(req: Request) {
  if (!rateLimitCheck(req, "leadEvents")) {
    return NextResponse.json({ ok: true, skipped: true, reason: "RATE_LIMITED" });
  }

  try {
    const body = await readJsonRecord(req);
    const regionSlug = readStringField(body, "regionId", {
      max: 64,
      pattern: REGION_SLUG_PATTERN,
      code: "INVALID_REGION",
    }) ?? "sowon";
    const itemType = readEnumField(body, "itemType", LEAD_ITEM_TYPES, {
      required: true,
      code: "INVALID_ITEM_TYPE",
    });
    const itemId = readStringField(body, "itemId", { max: 100 });
    const itemSlug = readStringField(body, "itemSlug", { max: 100 });
    const actionType = readEnumField(body, "actionType", LEAD_ACTION_TYPES, {
      required: true,
      code: "INVALID_ACTION_TYPE",
    });
    const sourcePath = readStringField(body, "sourcePath", { max: 255 });
    const targetUrl = readStringField(body, "targetUrl", { max: 500 });

    const actionToEnumMap: Record<string, LeadEventType> = {
      phone_click: "phone_click",
      kakao_click: "kakao_click",
      naver_booking_click: "naver_booking_click",
      homepage_click: "website_click",
      inquiry_submit: "inquiry_submit",
      partner_apply_submit: "partner_apply_submit",
      view: "website_click",
      detail_click: "website_click",
      map_click: "website_click",
      share_click: "website_click",
      premium_pr_matterport_click: "website_click",
      premium_pr_host_video_click: "website_click",
      premium_pr_drone_video_click: "website_click",
    };

    const eventType = actionToEnumMap[actionType];
    
    if (!eventType) {
      logOperationInfo("lead_event_invalid_action", {
        route: "/api/lead-events",
        actionType,
        statusCode: 400,
      });
      return NextResponse.json({ ok: false, error: "INVALID_ACTION_TYPE" }, { status: 400 });
    }

    const prisma = getPrisma();

    const region = await prisma.region.findUnique({
      where: { slug: regionSlug },
      select: { id: true }
    });

    if (!region) {
      logOperationError("lead_event_save_failed", new Error("Region not found"), {
        route: "/api/lead-events",
        regionId: regionSlug,
      });
      return NextResponse.json({ ok: true });
    }

    const userAgent = req.headers.get("user-agent")?.substring(0, 255);
    const referrer = req.headers.get("referer")?.substring(0, 255);

    await prisma.leadEvent.create({
      data: {
        regionId: region.id,
        eventType,
        targetType: itemType,
        targetId: itemId,
        sourcePath,
        userAgent,
        referrer,
        metadata: {
          ...sanitizeMetadata(body.metadata),
          originalAction: actionType,
          itemSlug,
          targetUrl,
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isPublicApiValidationError(error)) {
      logOperationInfo("lead_event_validation_failed", {
        route: "/api/lead-events",
        errorCode: error.code,
        statusCode: error.status,
      });
      return NextResponse.json(
        { ok: false, error: error.code },
        { status: error.status },
      );
    }

    logOperationError("lead_event_save_failed", error, {
      route: "/api/lead-events",
      operation: "create_lead_event",
    });
    return NextResponse.json({ ok: true });
  }
}
