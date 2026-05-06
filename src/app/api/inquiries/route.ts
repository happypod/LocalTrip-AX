import { NextResponse } from "next/server";

export const runtime = "nodejs";
import { getPrisma } from "@/lib/prisma";
import {
  isPublicApiValidationError,
  PublicApiValidationError,
  readBooleanField,
  readEnumField,
  readJsonRecord,
  readStringField,
} from "@/lib/public-api-validation";

const REGION_SLUG_PATTERN = /^[a-z0-9-]+$/;
const PHONE_PATTERN = /^[0-9+\-\s().]{7,30}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INQUIRY_ITEM_TYPES = [
  "accommodation",
  "experience",
  "local_income_program",
  "course",
  "general",
] as const;

export async function POST(req: Request) {
  try {
    const body = await readJsonRecord(req);
    const regionSlug = readStringField(body, "regionId", {
      max: 64,
      pattern: REGION_SLUG_PATTERN,
      code: "INVALID_REGION",
    }) ?? "sowon";
    const itemType = readEnumField(body, "itemType", INQUIRY_ITEM_TYPES, {
      required: true,
      code: "INVALID_INPUT",
    });
    const itemId = readStringField(body, "itemId", { max: 100 });
    const itemSlug = readStringField(body, "itemSlug", { max: 100 });
    const name = readStringField(body, "name", {
      required: true,
      min: 2,
      max: 50,
      code: "INVALID_INPUT",
    });
    const phone = readStringField(body, "phone", {
      required: true,
      max: 30,
      pattern: PHONE_PATTERN,
      code: "INVALID_INPUT",
    });
    const email = readStringField(body, "email", {
      max: 120,
      pattern: EMAIL_PATTERN,
      code: "INVALID_INPUT",
    });
    const desiredDate = readStringField(body, "desiredDate", { max: 50 });
    const peopleCount = readStringField(body, "peopleCount", { max: 20 });
    const message = readStringField(body, "message", { max: 1000 });
    const privacyAgreed = readBooleanField(body, "privacyAgreed");

    if (!privacyAgreed) {
      throw new PublicApiValidationError("PRIVACY_AGREEMENT_REQUIRED", 400);
    }

    let finalMessage = message || "상담/문의 요청";
    const extraInfo = [];
    if (desiredDate) extraInfo.push(`희망일: ${desiredDate}`);
    if (peopleCount) extraInfo.push(`인원: ${peopleCount}명`);
    
    if (extraInfo.length > 0) {
      finalMessage = `[${extraInfo.join(", ")}]\n${finalMessage}`;
    }

    const prisma = getPrisma();

    const region = await prisma.region.findUnique({
      where: { slug: regionSlug },
      select: { id: true },
    });

    if (!region) {
      console.warn(`[Inquiry] Region not found: ${regionSlug}`);
      return NextResponse.json({ ok: false, error: "REGION_NOT_FOUND" }, { status: 503 });
    }

    await prisma.inquiry.create({
      data: {
        regionId: region.id,
        targetType: itemType,
        targetId: itemId,
        name,
        phone,
        email,
        message: finalMessage,
        privacyConsent: privacyAgreed,
      },
    });

    try {
      const userAgent = req.headers.get("user-agent")?.substring(0, 255);
      const referrer = req.headers.get("referer")?.substring(0, 255);

      await prisma.leadEvent.create({
        data: {
          regionId: region.id,
          eventType: "inquiry_submit",
          targetType: itemType,
          targetId: itemId,
          userAgent,
          referrer,
          metadata: {
            itemSlug,
          },
        },
      });
    } catch (eventError) {
      console.error("[Inquiry] Failed to save inquiry_submit LeadEvent:", eventError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isPublicApiValidationError(error)) {
      return NextResponse.json(
        { ok: false, error: error.code },
        { status: error.status },
      );
    }

    console.error("[Inquiry] Failed to submit inquiry:", error);
    return NextResponse.json({ ok: false, error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
