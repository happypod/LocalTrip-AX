import { LeadEventType } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { createMessagePreview, maskEmail, maskName, maskPhone } from "@/lib/privacy";

const SOWON_REGION_SLUG = "sowon";

const LEAD_EVENT_TYPES: LeadEventType[] = [
  "phone_click",
  "kakao_click",
  "naver_booking_click",
  "website_click",
  "inquiry_submit",
  "partner_apply_submit",
];

const CTA_EVENT_TYPES = new Set<LeadEventType>([
  "phone_click",
  "kakao_click",
  "naver_booking_click",
  "website_click",
]);

const CONVERSION_EVENT_TYPES = new Set<LeadEventType>([
  "inquiry_submit",
  "partner_apply_submit",
]);

const EVENT_LABELS: Record<LeadEventType, string> = {
  phone_click: "전화 문의 클릭",
  kakao_click: "카카오 문의 클릭",
  naver_booking_click: "네이버예약 클릭",
  website_click: "홈페이지/상세 클릭",
  inquiry_submit: "문의 제출",
  partner_apply_submit: "입점신청 제출",
};

export type ReportContentType =
  | "accommodation"
  | "experience"
  | "local_income_program"
  | "course"
  | "unknown";

export interface ReportMonth {
  value: string;
  label: string;
  startDate: Date;
  endDate: Date;
}

export interface EventTypeSummaryRow {
  eventType: LeadEventType;
  label: string;
  count: number;
  percentage: number;
}

export interface PopularContentRow {
  targetType: ReportContentType;
  targetTypeLabel: string;
  targetId: string;
  title: string;
  clickCount: number;
  conversionCount: number;
  totalCount: number;
}

export interface RecentLeadEventRow {
  id: string;
  eventType: LeadEventType;
  eventLabel: string;
  targetType: ReportContentType;
  targetTypeLabel: string;
  title: string;
  sourcePath: string;
  createdAt: Date;
}

export interface RecentInquiryRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  targetTypeLabel: string;
  messagePreview: string;
  status: string;
  createdAt: Date;
}

export interface RecentPartnerApplicationRow {
  id: string;
  businessName: string;
  applicantName: string;
  phone: string;
  email: string;
  businessType: string;
  messagePreview: string;
  status: string;
  createdAt: Date;
}

export interface MonthlyReportData {
  month: ReportMonth;
  hasRegion: boolean;
  summary: {
    totalLeadEvents: number;
    ctaClicks: number;
    inquirySubmitEvents: number;
    partnerApplySubmitEvents: number;
    actualInquiries: number;
    actualPartnerApplications: number;
  };
  publishedCounts: {
    accommodations: number;
    experiences: number;
    programs: number;
    courses: number;
  };
  eventTypeSummary: EventTypeSummaryRow[];
  popularContent: PopularContentRow[];
  recentLeadEvents: RecentLeadEventRow[];
  recentInquiries: RecentInquiryRow[];
  recentPartnerApplications: RecentPartnerApplicationRow[];
}

function padMonth(month: number) {
  return String(month).padStart(2, "0");
}

export function resolveReportMonth(rawMonth?: string | string[]): ReportMonth {
  const rawValue = Array.isArray(rawMonth) ? rawMonth[0] : rawMonth;
  const match = rawValue?.match(/^(\d{4})-(\d{2})$/);
  const now = new Date();

  let year = now.getFullYear();
  let month = now.getMonth() + 1;

  if (match) {
    const parsedYear = Number(match[1]);
    const parsedMonth = Number(match[2]);

    if (parsedYear >= 2000 && parsedYear <= 2100 && parsedMonth >= 1 && parsedMonth <= 12) {
      year = parsedYear;
      month = parsedMonth;
    }
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  return {
    value: `${year}-${padMonth(month)}`,
    label: `${year}년 ${month}월`,
    startDate,
    endDate,
  };
}

function normalizeTargetType(targetType: string | null): ReportContentType {
  switch (targetType) {
    case "accommodation":
    case "stay":
      return "accommodation";
    case "experience":
      return "experience";
    case "local_income_program":
    case "localIncomeProgram":
    case "program":
      return "local_income_program";
    case "course":
      return "course";
    default:
      return "unknown";
  }
}

export function getTargetTypeLabel(targetType: ReportContentType) {
  switch (targetType) {
    case "accommodation":
      return "숙소";
    case "experience":
      return "체험";
    case "local_income_program":
      return "주민소득상품";
    case "course":
      return "추천 코스";
    default:
      return "기타";
  }
}

function contentKey(targetType: ReportContentType, targetId: string) {
  return `${targetType}:${targetId}`;
}

function buildEmptyReport(month: ReportMonth, hasRegion = false): MonthlyReportData {
  return {
    month,
    hasRegion,
    summary: {
      totalLeadEvents: 0,
      ctaClicks: 0,
      inquirySubmitEvents: 0,
      partnerApplySubmitEvents: 0,
      actualInquiries: 0,
      actualPartnerApplications: 0,
    },
    publishedCounts: {
      accommodations: 0,
      experiences: 0,
      programs: 0,
      courses: 0,
    },
    eventTypeSummary: LEAD_EVENT_TYPES.map((eventType) => ({
      eventType,
      label: EVENT_LABELS[eventType],
      count: 0,
      percentage: 0,
    })),
    popularContent: [],
    recentLeadEvents: [],
    recentInquiries: [],
    recentPartnerApplications: [],
  };
}

async function resolveContentTitles(
  regionId: string,
  refs: Array<{ targetType: ReportContentType; targetId: string }>
) {
  const prisma = getPrisma();
  const titleMap = new Map<string, string>();

  const idsByType: Record<Exclude<ReportContentType, "unknown">, Set<string>> = {
    accommodation: new Set(),
    experience: new Set(),
    local_income_program: new Set(),
    course: new Set(),
  };

  refs.forEach((ref) => {
    if (ref.targetType !== "unknown") {
      idsByType[ref.targetType].add(ref.targetId);
    }
  });

  const [accommodations, experiences, programs, courses] = await Promise.all([
    prisma.accommodation.findMany({
      where: { regionId, id: { in: [...idsByType.accommodation] } },
      select: { id: true, title: true },
    }),
    prisma.experience.findMany({
      where: { regionId, id: { in: [...idsByType.experience] } },
      select: { id: true, title: true },
    }),
    prisma.localIncomeProgram.findMany({
      where: { regionId, id: { in: [...idsByType.local_income_program] } },
      select: { id: true, title: true },
    }),
    prisma.course.findMany({
      where: { regionId, id: { in: [...idsByType.course] } },
      select: { id: true, title: true },
    }),
  ]);

  accommodations.forEach((item) => titleMap.set(contentKey("accommodation", item.id), item.title));
  experiences.forEach((item) => titleMap.set(contentKey("experience", item.id), item.title));
  programs.forEach((item) => titleMap.set(contentKey("local_income_program", item.id), item.title));
  courses.forEach((item) => titleMap.set(contentKey("course", item.id), item.title));

  return titleMap;
}

export async function getMonthlyReportData(rawMonth?: string | string[]): Promise<MonthlyReportData> {
  const month = resolveReportMonth(rawMonth);
  const emptyReport = buildEmptyReport(month);

  try {
    const prisma = getPrisma();
    const region = await prisma.region.findUnique({
      where: { slug: SOWON_REGION_SLUG },
      select: { id: true },
    });

    if (!region) {
      return emptyReport;
    }

    const monthWhere = {
      gte: month.startDate,
      lt: month.endDate,
    };

    const [
      eventGroups,
      contentEvents,
      recentLeadEventsRaw,
      recentInquiriesRaw,
      recentPartnerApplicationsRaw,
      actualInquiries,
      actualPartnerApplications,
      publishedCounts,
    ] = await Promise.all([
      prisma.leadEvent.groupBy({
        by: ["eventType"],
        where: {
          regionId: region.id,
          createdAt: monthWhere,
        },
        _count: { _all: true },
      }),
      prisma.leadEvent.findMany({
        where: {
          regionId: region.id,
          createdAt: monthWhere,
          targetType: { not: null },
          targetId: { not: null },
        },
        select: {
          eventType: true,
          targetType: true,
          targetId: true,
        },
      }),
      prisma.leadEvent.findMany({
        where: {
          regionId: region.id,
          createdAt: monthWhere,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          eventType: true,
          targetType: true,
          targetId: true,
          sourcePath: true,
          createdAt: true,
        },
      }),
      prisma.inquiry.findMany({
        where: {
          regionId: region.id,
          createdAt: monthWhere,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          targetType: true,
          message: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.partnerApplication.findMany({
        where: {
          regionId: region.id,
          createdAt: monthWhere,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          businessName: true,
          applicantName: true,
          phone: true,
          email: true,
          businessType: true,
          message: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.inquiry.count({
        where: {
          regionId: region.id,
          createdAt: monthWhere,
        },
      }),
      prisma.partnerApplication.count({
        where: {
          regionId: region.id,
          createdAt: monthWhere,
        },
      }),
      Promise.all([
        prisma.accommodation.count({ where: { regionId: region.id, status: "published" } }),
        prisma.experience.count({ where: { regionId: region.id, status: "published" } }),
        prisma.localIncomeProgram.count({ where: { regionId: region.id, status: "published" } }),
        prisma.course.count({ where: { regionId: region.id, status: "published" } }),
      ]),
    ]);

    const eventCountMap = LEAD_EVENT_TYPES.reduce((acc, eventType) => {
      acc[eventType] = 0;
      return acc;
    }, {} as Record<LeadEventType, number>);

    eventGroups.forEach((group) => {
      eventCountMap[group.eventType] = group._count._all;
    });

    const totalLeadEvents = LEAD_EVENT_TYPES.reduce((sum, eventType) => sum + eventCountMap[eventType], 0);
    const ctaClicks = LEAD_EVENT_TYPES.reduce(
      (sum, eventType) => sum + (CTA_EVENT_TYPES.has(eventType) ? eventCountMap[eventType] : 0),
      0
    );

    const eventTypeSummary = LEAD_EVENT_TYPES.map((eventType) => ({
      eventType,
      label: EVENT_LABELS[eventType],
      count: eventCountMap[eventType],
      percentage: totalLeadEvents > 0 ? Math.round((eventCountMap[eventType] / totalLeadEvents) * 100) : 0,
    }));

    const popularMap = new Map<string, PopularContentRow>();

    contentEvents.forEach((event) => {
      if (!event.targetId) return;

      const targetType = normalizeTargetType(event.targetType);
      if (targetType === "unknown") return;

      const key = contentKey(targetType, event.targetId);
      const existing = popularMap.get(key) ?? {
        targetType,
        targetTypeLabel: getTargetTypeLabel(targetType),
        targetId: event.targetId,
        title: "알 수 없는 콘텐츠",
        clickCount: 0,
        conversionCount: 0,
        totalCount: 0,
      };

      if (CTA_EVENT_TYPES.has(event.eventType)) {
        existing.clickCount += 1;
      }

      if (CONVERSION_EVENT_TYPES.has(event.eventType)) {
        existing.conversionCount += 1;
      }

      existing.totalCount += 1;
      popularMap.set(key, existing);
    });

    const recentRefs = recentLeadEventsRaw
      .filter((event) => event.targetId)
      .map((event) => ({
        targetType: normalizeTargetType(event.targetType),
        targetId: event.targetId as string,
      }));

    const titleMap = await resolveContentTitles(region.id, [
      ...Array.from(popularMap.values()).map((item) => ({
        targetType: item.targetType,
        targetId: item.targetId,
      })),
      ...recentRefs,
    ]);

    const popularContent = Array.from(popularMap.values())
      .map((item) => ({
        ...item,
        title: titleMap.get(contentKey(item.targetType, item.targetId)) ?? "알 수 없는 콘텐츠",
      }))
      .sort((a, b) => b.totalCount - a.totalCount || b.clickCount - a.clickCount)
      .slice(0, 10);

    const recentLeadEvents = recentLeadEventsRaw.map((event) => {
      const targetType = normalizeTargetType(event.targetType);
      const title = event.targetId
        ? titleMap.get(contentKey(targetType, event.targetId)) ?? "알 수 없는 콘텐츠"
        : "대상 없음";

      return {
        id: event.id,
        eventType: event.eventType,
        eventLabel: EVENT_LABELS[event.eventType],
        targetType,
        targetTypeLabel: getTargetTypeLabel(targetType),
        title,
        sourcePath: event.sourcePath ?? "-",
        createdAt: event.createdAt,
      };
    });

    return {
      month,
      hasRegion: true,
      summary: {
        totalLeadEvents,
        ctaClicks,
        inquirySubmitEvents: eventCountMap.inquiry_submit,
        partnerApplySubmitEvents: eventCountMap.partner_apply_submit,
        actualInquiries,
        actualPartnerApplications,
      },
      publishedCounts: {
        accommodations: publishedCounts[0],
        experiences: publishedCounts[1],
        programs: publishedCounts[2],
        courses: publishedCounts[3],
      },
      eventTypeSummary,
      popularContent,
      recentLeadEvents,
      recentInquiries: recentInquiriesRaw.map((inquiry) => ({
        id: inquiry.id,
        name: maskName(inquiry.name),
        phone: maskPhone(inquiry.phone),
        email: inquiry.email ? maskEmail(inquiry.email) : "-",
        targetTypeLabel: getTargetTypeLabel(normalizeTargetType(inquiry.targetType)),
        messagePreview: createMessagePreview(inquiry.message),
        status: inquiry.status,
        createdAt: inquiry.createdAt,
      })),
      recentPartnerApplications: recentPartnerApplicationsRaw.map((application) => ({
        id: application.id,
        businessName: application.businessName,
        applicantName: maskName(application.applicantName),
        phone: maskPhone(application.phone),
        email: application.email ? maskEmail(application.email) : "-",
        businessType: application.businessType ?? "미지정",
        messagePreview: createMessagePreview(application.message),
        status: application.status,
        createdAt: application.createdAt,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch monthly report data:", error);
    return emptyReport;
  }
}
