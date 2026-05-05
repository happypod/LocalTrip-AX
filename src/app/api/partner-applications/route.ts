import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      applicantType,
      businessName,
      applicantName,
      phone,
      email,
      regionName,
      address,
      currentWebsiteUrl,
      naverBookingUrl,
      kakaoUrl,
      proposedTitle,
      proposedDescription,
      operationType,
      availableSeason,
      expectedParticipants,
      privacyAgreed,
    } = body;

    // 1. Validations
    if (!privacyAgreed) {
      return NextResponse.json({ ok: false, error: "PRIVACY_AGREEMENT_REQUIRED" }, { status: 400 });
    }

    if (!applicantType || !applicantName || !phone) {
      return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
    }

    const trimmedName = applicantName.trim();
    if (trimmedName.length < 2) {
      return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
    }

    // 2. Prepare Message (Structure fields that don't fit in schema)
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
    finalMessage += proposedDescription?.trim() || "내용 없음";

    const prisma = getPrisma();

    // Verify Region (Default to sowon if not specified)
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
        businessName: businessName?.trim() || applicantName.trim(),
        applicantName: trimmedName,
        phone: phone.trim(),
        email: email?.trim() || null,
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
    console.error("[PartnerApply] Failed to submit application:", error);
    return NextResponse.json({ ok: false, error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
