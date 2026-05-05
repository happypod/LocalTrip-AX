import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { LeadEventType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      regionId = "sowon", // default to sowon region
      itemType, 
      itemId, 
      itemSlug, 
      actionType, 
      sourcePath, 
      targetUrl 
    } = body;

    if (!itemType || !actionType) {
      return NextResponse.json({ ok: false, error: "MISSING_REQUIRED_FIELDS" }, { status: 400 });
    }

    // Validate and Map actionType to Prisma LeadEventType
    // We map actionTypes that do not exist in the Prisma enum to 'website_click'
    // but store the original actionType in metadata.
    const actionToEnumMap: Record<string, LeadEventType> = {
      phone_click: "phone_click",
      kakao_click: "kakao_click",
      naver_booking_click: "naver_booking_click",
      homepage_click: "website_click",
      inquiry_submit: "inquiry_submit",
      // Map other clicks to website_click to save them without schema change
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

    // Check if region exists
    const region = await prisma.region.findUnique({
      where: { slug: regionId },
      select: { id: true }
    });

    if (!region) {
      // If region doesn't exist (e.g., seed not run), we just silently succeed
      // to not break the frontend tracking logic.
      console.warn(`[LeadEvent] Region not found: ${regionId}`);
      return NextResponse.json({ ok: true });
    }

    // Extract minimal headers for privacy-safe tracking
    const userAgent = req.headers.get("user-agent")?.substring(0, 255);
    const referrer = req.headers.get("referer")?.substring(0, 255);

    // Save event
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
    // Fire-and-forget: we only log to server console, but return ok: true to client
    // so that client UI doesn't break if tracking fails.
    console.error("[LeadEvent] Failed to save lead event:", error);
    return NextResponse.json({ ok: true });
  }
}
