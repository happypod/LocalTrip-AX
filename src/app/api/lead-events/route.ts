import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { LeadEventType } from "@prisma/client";
import {
  isPublicApiValidationError,
  readEnumField,
  readJsonRecord,
  readStringField,
} from "@/lib/public-api-validation";

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
] as const;

export async function POST(req: Request) {
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
      share_click: "website_click"
    };

    const eventType = actionToEnumMap[actionType];
    
    if (!eventType) {
      return NextResponse.json({ ok: false, error: "INVALID_ACTION_TYPE" }, { status: 400 });
    }

    const prisma = getPrisma();

    const region = await prisma.region.findUnique({
      where: { slug: regionSlug },
      select: { id: true }
    });

    if (!region) {
      console.warn(`[LeadEvent] Region not found: ${regionSlug}`);
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
          originalAction: actionType,
          itemSlug,
          targetUrl
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isPublicApiValidationError(error)) {
      return NextResponse.json(
        { ok: false, error: error.code },
        { status: error.status },
      );
    }

    console.error("[LeadEvent] Failed to save lead event:", error);
    return NextResponse.json({ ok: true });
  }
}
