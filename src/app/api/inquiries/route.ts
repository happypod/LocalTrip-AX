import { NextResponse } from "next/server";

export const runtime = "nodejs";
import { getPrisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      regionId = "sowon", // default to sowon
      itemType,
      itemId,
      itemSlug,
      name,
      phone,
      email,
      desiredDate,
      peopleCount,
      message,
      privacyAgreed,
    } = body;

    // 1. Validations
    if (!privacyAgreed) {
      return NextResponse.json({ ok: false, error: "PRIVACY_AGREEMENT_REQUIRED" }, { status: 400 });
    }

    if (!itemType || !name || !phone) {
      return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
    }

    const allowedTypes = ["accommodation", "experience", "local_income_program", "course", "general"];
    if (!allowedTypes.includes(itemType)) {
      return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
    }

    // 2. Prepare Data
    // Append extra info to message since Schema doesn't have desiredDate or peopleCount
    let finalMessage = message?.trim() || "상담/문의 요청";
    const extraInfo = [];
    if (desiredDate) extraInfo.push(`희망일: ${desiredDate}`);
    if (peopleCount) extraInfo.push(`인원: ${peopleCount}명`);
    
    if (extraInfo.length > 0) {
      finalMessage = `[${extraInfo.join(", ")}]\n${finalMessage}`;
    }

    const prisma = getPrisma();

    // Verify Region
    const region = await prisma.region.findUnique({
      where: { slug: regionId },
      select: { id: true },
    });

    if (!region) {
      console.warn(`[Inquiry] Region not found: ${regionId}`);
      return NextResponse.json({ ok: false, error: "REGION_NOT_FOUND" }, { status: 503 });
    }

    // 3. Save Inquiry
    await prisma.inquiry.create({
      data: {
        regionId: region.id,
        targetType: itemType,
        targetId: itemId,
        name: trimmedName,
        phone: phone.trim(),
        email: email?.trim() || null,
        message: finalMessage,
        privacyConsent: privacyAgreed,
      },
    });

    // 4. Save LeadEvent (inquiry_submit)
    // Wrap in separate try-catch so it doesn't rollback Inquiry on failure
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
    // Hide exact technical error, but log it to server console
    console.error("[Inquiry] Failed to submit inquiry:", error);
    return NextResponse.json({ ok: false, error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
