import { getPrisma } from "./prisma";
import { LeadEventType } from "@prisma/client";

const SOWON_REGION_SLUG = "sowon";

async function getSowonRegionId() {
  const prisma = getPrisma();
  const region = await prisma.region.findUnique({
    where: { slug: SOWON_REGION_SLUG },
    select: { id: true },
  });

  return region?.id ?? null;
}

export async function getDashboardStats() {
  const prisma = getPrisma();
  
  try {
    const regionId = await getSowonRegionId();

    if (!regionId) {
      return {
        accommodations: 0,
        experiences: 0,
        programs: 0,
        courses: 0,
        inquiries: 0,
        partnerApplications: 0,
      };
    }

    const [
      accommodations,
      experiences,
      programs,
      courses,
      inquiries,
      partnerApplications
    ] = await Promise.all([
      prisma.accommodation.count({ where: { regionId, status: "published" } }),
      prisma.experience.count({ where: { regionId, status: "published" } }),
      prisma.localIncomeProgram.count({ where: { regionId, status: "published" } }),
      prisma.course.count({ where: { regionId, status: "published" } }),
      prisma.inquiry.count({ where: { regionId } }),
      prisma.partnerApplication.count({ where: { regionId } }),
    ]);

    return {
      accommodations,
      experiences,
      programs,
      courses,
      inquiries,
      partnerApplications,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      accommodations: 0,
      experiences: 0,
      programs: 0,
      courses: 0,
      inquiries: 0,
      partnerApplications: 0,
    };
  }
}

export async function getLeadEventSummary() {
  const prisma = getPrisma();
  try {
    const regionId = await getSowonRegionId();

    if (!regionId) {
      return {} as Partial<Record<LeadEventType, number>>;
    }

    const events = await prisma.leadEvent.groupBy({
      by: ['eventType'],
      where: { regionId },
      _count: {
        _all: true
      },
    });
    
    return events.reduce((acc, curr) => {
      acc[curr.eventType] = curr._count._all;
      return acc;
    }, {} as Partial<Record<LeadEventType, number>>);
  } catch (error) {
    console.error("Failed to fetch lead event summary:", error);
    return {} as Partial<Record<LeadEventType, number>>;
  }
}

export async function getPopularContent() {
  const prisma = getPrisma();
  try {
    const regionId = await getSowonRegionId();

    if (!regionId) {
      return [];
    }

    const topEvents = await prisma.leadEvent.groupBy({
      by: ['targetType', 'targetId'],
      _count: {
        targetId: true
      },
      orderBy: {
        _count: {
          targetId: 'desc'
        }
      },
      take: 5,
      where: {
        regionId,
        targetType: { not: null },
        targetId: { not: null },
      }
    });

    const results = await Promise.all(topEvents.map(async (event) => {
      let title = "알 수 없는 콘텐츠";
      
      if (event.targetType === "accommodation" && event.targetId) {
        const item = await prisma.accommodation.findUnique({ where: { id: event.targetId } });
        if (item) title = item.title;
      } else if (event.targetType === "experience" && event.targetId) {
        const item = await prisma.experience.findUnique({ where: { id: event.targetId } });
        if (item) title = item.title;
      } else if (event.targetType === "local_income_program" && event.targetId) {
        const item = await prisma.localIncomeProgram.findUnique({ where: { id: event.targetId } });
        if (item) title = item.title;
      } else if (event.targetType === "course" && event.targetId) {
        const item = await prisma.course.findUnique({ where: { id: event.targetId } });
        if (item) title = item.title;
      }

      return {
        targetType: event.targetType,
        targetId: event.targetId,
        title,
        count: event._count.targetId,
      };
    }));

    return results;
  } catch (error) {
    console.error("Failed to fetch popular content:", error);
    return [];
  }
}

export async function getRecentInquiries() {
  const prisma = getPrisma();
  try {
    const regionId = await getSowonRegionId();

    if (!regionId) {
      return [];
    }

    return await prisma.inquiry.findMany({
      where: { regionId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  } catch (error) {
    console.error("Failed to fetch recent inquiries:", error);
    return [];
  }
}

export async function getRecentPartnerApplications() {
  const prisma = getPrisma();
  try {
    const regionId = await getSowonRegionId();

    if (!regionId) {
      return [];
    }

    return await prisma.partnerApplication.findMany({
      where: { regionId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  } catch (error) {
    console.error("Failed to fetch recent partner applications:", error);
    return [];
  }
}
