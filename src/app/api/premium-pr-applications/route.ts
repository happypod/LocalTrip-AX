import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import {
  isPublicApiValidationError,
  PublicApiValidationError,
  readBooleanField,
  readJsonRecord,
  readStringField,
} from "@/lib/public-api-validation";
import { logOperationError, logOperationInfo } from "@/lib/operation-log";
import { rateLimitCheck } from "@/lib/public-api-rate-limit";

export const runtime = "nodejs";

const PHONE_PATTERN = /^[0-9+\-\s().]{7,30}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BUSINESS_TYPE = "premium_pr_production";
const PREMIUM_PR_SERVICES = [
  "matterport_3d",
  "host_video",
  "drone_video",
  "detail_page_pr",
  "annual_premium_exposure",
  "consulting",
] as const;

const SERVICE_LABELS: Record<(typeof PREMIUM_PR_SERVICES)[number], string> = {
  matterport_3d: "3D/VR 투어 촬영",
  host_video: "호스트 인터뷰 영상",
  drone_video: "드론 영상",
  detail_page_pr: "상세페이지 PR 콘텐츠",
  annual_premium_exposure: "연간 프리미엄 노출 관리",
  consulting: "상담 후 결정",
};

function readServiceList(body: Record<string, unknown>) {
  const raw = body.interestedServices;

  if (!Array.isArray(raw)) {
    throw new PublicApiValidationError("INVALID_SERVICES", 400);
  }

  const services = raw.filter(
    (value): value is (typeof PREMIUM_PR_SERVICES)[number] =>
      typeof value === "string" &&
      PREMIUM_PR_SERVICES.includes(value as (typeof PREMIUM_PR_SERVICES)[number])
  );

  if (services.length === 0 || services.length !== raw.length) {
    throw new PublicApiValidationError("INVALID_SERVICES", 400);
  }

  return services;
}

function buildApplicationMessage({
  operatorType,
  businessName,
  regionName,
  address,
  currentWebsiteUrl,
  interestedServices,
  preferredSchedule,
  budgetRange,
  requestMemo,
}: {
  operatorType: string | null;
  businessName: string | null;
  regionName: string | null;
  address: string | null;
  currentWebsiteUrl: string | null;
  interestedServices: string[];
  preferredSchedule: string | null;
  budgetRange: string | null;
  requestMemo: string | null;
}) {
  const lines = [
    "[Premium PR 제작대행 문의]",
    `운영 주체 유형: ${operatorType || "미입력"}`,
    `사업장/단체명: ${businessName || "미입력"}`,
    `지역: ${regionName || "미입력"}`,
    `주소: ${address || "미입력"}`,
    `현재 홈페이지/예약 링크: ${currentWebsiteUrl || "미입력"}`,
    `관심 제작 항목: ${interestedServices.join(", ")}`,
    `희망 일정: ${preferredSchedule || "상담 후 결정"}`,
    `예산/상담 범위: ${budgetRange || "상담 희망"}`,
    "",
    "--- 요청 메모 ---",
    requestMemo || "메모 없음",
  ];

  return lines.join("\n");
}

export async function POST(req: Request) {
  if (!rateLimitCheck(req, "premiumPrApplications")) {
    return NextResponse.json({ ok: false, error: "RATE_LIMITED" }, { status: 429 });
  }

  try {
    const body = await readJsonRecord(req);
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
    const businessName = readStringField(body, "businessName", { max: 100 });
    const operatorType = readStringField(body, "operatorType", { max: 80 });
    const regionName = readStringField(body, "regionName", { max: 100 });
    const address = readStringField(body, "address", { max: 200 });
    const currentWebsiteUrl = readStringField(body, "currentWebsiteUrl", {
      max: 300,
    });
    const preferredSchedule = readStringField(body, "preferredSchedule", {
      max: 120,
    });
    const budgetRange = readStringField(body, "budgetRange", { max: 120 });
    const requestMemo = readStringField(body, "requestMemo", { max: 1500 });
    const privacyAgreed = readBooleanField(body, "privacyAgreed");
    const interestedServices = readServiceList(body);

    if (!privacyAgreed) {
      throw new PublicApiValidationError("PRIVACY_AGREEMENT_REQUIRED", 400);
    }

    const prisma = getPrisma();
    const region = await prisma.region.findUnique({
      where: { slug: "sowon" },
      select: { id: true },
    });

    if (!region) {
      logOperationError(
        "premium_pr_application_save_failed",
        new Error("Region not found"),
        {
          route: "/api/premium-pr-applications",
          regionId: "sowon",
          statusCode: 503,
        }
      );
      return NextResponse.json(
        { ok: false, error: "REGION_NOT_FOUND" },
        { status: 503 }
      );
    }

    const serviceLabels = interestedServices.map(
      (service) => SERVICE_LABELS[service]
    );
    const message = buildApplicationMessage({
      operatorType,
      businessName,
      regionName,
      address,
      currentWebsiteUrl,
      interestedServices: serviceLabels,
      preferredSchedule,
      budgetRange,
      requestMemo,
    });

    await prisma.partnerApplication.create({
      data: {
        regionId: region.id,
        businessName: businessName || applicantName,
        applicantName,
        phone,
        email,
        businessType: BUSINESS_TYPE,
        message,
        privacyConsent: privacyAgreed,
        status: "new",
      },
    });

    try {
      const userAgent = req.headers.get("user-agent")?.substring(0, 255);
      const referrer = req.headers.get("referer")?.substring(0, 255);

      await prisma.leadEvent.create({
        data: {
          regionId: region.id,
          eventType: "partner_apply_submit",
          targetType: "general",
          targetId: "premium_pr_apply",
          userAgent,
          referrer,
          metadata: {
            applicationType: BUSINESS_TYPE,
            interestedServices: interestedServices.join(","),
            businessName,
          },
        },
      });
    } catch (eventError) {
      logOperationError("lead_event_save_failed", eventError, {
        route: "/api/premium-pr-applications",
        operation: "create_lead_event",
        targetType: "general",
        targetId: "premium_pr_apply",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isPublicApiValidationError(error)) {
      logOperationInfo("premium_pr_application_validation_failed", {
        route: "/api/premium-pr-applications",
        errorCode: error.code,
        statusCode: error.status,
      });
      return NextResponse.json(
        { ok: false, error: error.code },
        { status: error.status }
      );
    }

    logOperationError("premium_pr_application_save_failed", error, {
      route: "/api/premium-pr-applications",
      operation: "create_premium_pr_application",
      statusCode: 500,
    });
    return NextResponse.json(
      { ok: false, error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
