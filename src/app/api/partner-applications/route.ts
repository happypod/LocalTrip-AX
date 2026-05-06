import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import {
  isPublicApiValidationError,
  PublicApiValidationError,
  readBooleanField,
  readEnumField,
  readJsonRecord,
  readStringField,
} from "@/lib/public-api-validation";

export const runtime = "nodejs";

const PHONE_PATTERN = /^[0-9+\-\s().]{7,30}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PARTNER_APPLICANT_TYPES = [
  "accommodation_owner",
  "experience_host",
  "local_income_program",
  "local_guide",
  "food_operator",
  "local_product",
  "resident_group",
  "cooperative",
  "other",
] as const;

export async function POST(req: Request) {
  try {
    const body = await readJsonRecord(req);
    const applicantType = readEnumField(body, "applicantType", PARTNER_APPLICANT_TYPES, {
      required: true,
      code: "INVALID_INPUT",
    });
    const businessName = readStringField(body, "businessName", { max: 100 });
    const applicantName = readStringField(body, "applicantName", {
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
    const regionName = readStringField(body, "regionName", { max: 100 });
    const address = readStringField(body, "address", { max: 200 });
    const currentWebsiteUrl = readStringField(body, "currentWebsiteUrl", { max: 300 });
    const naverBookingUrl = readStringField(body, "naverBookingUrl", { max: 300 });
    const kakaoUrl = readStringField(body, "kakaoUrl", { max: 300 });
    const proposedTitle = readStringField(body, "proposedTitle", { max: 120 });
    const proposedDescription = readStringField(body, "proposedDescription", { max: 1500 });
    const operationType = readStringField(body, "operationType", { max: 100 });
    const availableSeason = readStringField(body, "availableSeason", { max: 100 });
    const expectedParticipants = readStringField(body, "expectedParticipants", { max: 100 });
    const privacyAgreed = readBooleanField(body, "privacyAgreed");

    if (!privacyAgreed) {
      throw new PublicApiValidationError("PRIVACY_AGREEMENT_REQUIRED", 400);
    }

    const extraInfo = [];
    if (regionName) extraInfo.push(`운영지역: ${regionName}`);
    if (address) extraInfo.push(`주소: ${address}`);
    if (currentWebsiteUrl) extraInfo.push(`홈페이지: ${currentWebsiteUrl}`);
    if (naverBookingUrl) extraInfo.push(`네이버예약: ${naverBookingUrl}`);
    if (kakaoUrl) extraInfo.push(`카카오채널: ${kakaoUrl}`);
    if (proposedTitle) extraInfo.push(`제안상품명: ${proposedTitle}`);
    if (operationType) extraInfo.push(`운영형태: ${operationType}`);
    if (availableSeason) extraInfo.push(`운영시기: ${availableSeason}`);
    if (expectedParticipants) extraInfo.push(`예상인원: ${expectedParticipants}`);

    let finalMessage = `[신청자 유형: ${applicantType}]\n`;
    if (extraInfo.length > 0) {
      finalMessage += extraInfo.join("\n") + "\n\n";
    }
    finalMessage += "--- 제안 상세 내용 ---\n";
    finalMessage += proposedDescription || "내용 없음";

    const prisma = getPrisma();

    const region = await prisma.region.findUnique({
      where: { slug: "sowon" },
      select: { id: true },
    });

    if (!region) {
      console.warn(`[PartnerApply] Default region 'sowon' not found.`);
      return NextResponse.json({ ok: false, error: "REGION_NOT_FOUND" }, { status: 503 });
    }

    // 3. Save PartnerApplication
    await prisma.partnerApplication.create({
      data: {
        regionId: region.id,
        businessName: businessName || applicantName,
        applicantName,
        phone,
        email,
        businessType: applicantType,
        message: finalMessage,
        privacyConsent: privacyAgreed,
        status: "new",
      },
    });

    // 4. Save LeadEvent (partner_apply_submit / general)
    try {
      const userAgent = req.headers.get("user-agent")?.substring(0, 255);
      const referrer = req.headers.get("referer")?.substring(0, 255);

      await prisma.leadEvent.create({
        data: {
          regionId: region.id,
          eventType: "partner_apply_submit",
          targetType: "general",
          targetId: "partner_apply",
          userAgent,
          referrer,
          metadata: {
            applicantType,
            businessName,
          },
        },
      });
    } catch (eventError) {
      console.error("[PartnerApply] Failed to save LeadEvent:", eventError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isPublicApiValidationError(error)) {
      return NextResponse.json(
        { ok: false, error: error.code },
        { status: error.status },
      );
    }

    console.error("[PartnerApply] Failed to submit application:", error);
    return NextResponse.json({ ok: false, error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
