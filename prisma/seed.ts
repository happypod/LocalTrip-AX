import "dotenv/config";
import { PrismaClient, PublishStatus, LeadEventType, CourseItemType, InquiryStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { FALLBACK_STAYS } from "../src/lib/stay-data";
import { FALLBACK_EXPERIENCES } from "../src/lib/experience-data";
import { FALLBACK_PROGRAMS } from "../src/lib/program-data";
import { FALLBACK_COURSES } from "../src/lib/course-data";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function toPublishStatus(status: unknown): PublishStatus {
  if (status === PublishStatus.draft || status === "draft") return PublishStatus.draft;
  if (status === PublishStatus.inactive || status === "inactive") return PublishStatus.inactive;
  return PublishStatus.published;
}

function nullable(value: string | null | undefined) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || null;
}

function noteWithTime(time?: string, note?: string | null, description?: string) {
  const value = [time, note, description].filter(Boolean).join(" · ");
  return value || null;
}

async function main() {
  console.log("Start seeding...");

  const sowonRegion = await prisma.region.upsert({
    where: { slug: "sowon" },
    update: {
      name: "소원권역",
      description: "주민과 여행자가 상생하는 소원면 지역관광 브랜드",
      status: PublishStatus.published,
    },
    create: {
      name: "소원권역",
      slug: "sowon",
      description: "주민과 여행자가 상생하는 소원면 지역관광 브랜드",
      status: PublishStatus.published,
    },
  });

  const regionId = sowonRegion.id;

  console.log(`Cleaning up existing data for region: ${sowonRegion.name}...`);
  await prisma.leadEvent.deleteMany({ where: { regionId } });
  await prisma.contentTranslation.deleteMany({ where: { regionId } });
  await prisma.event.deleteMany({ where: { regionId } });
  await prisma.certification.deleteMany({ where: { regionId } });
  await prisma.trainingCourse.deleteMany({ where: { regionId } });
  await prisma.partnerApplication.deleteMany({ where: { regionId } });
  await prisma.inquiry.deleteMany({ where: { regionId } });
  await prisma.courseItem.deleteMany({ where: { course: { regionId } } });
  await prisma.course.deleteMany({ where: { regionId } });
  await prisma.accommodation.deleteMany({ where: { regionId } });
  await prisma.experience.deleteMany({ where: { regionId } });
  await prisma.localIncomeProgram.deleteMany({ where: { regionId } });
  await prisma.businessProfile.deleteMany({ where: { regionId } });

  console.log("Cleanup finished. Starting creation...");

  const bizProfiles = await Promise.all([
    prisma.businessProfile.create({
      data: {
        regionId,
        name: "소원 숙박 협동조합",
        businessType: "accommodation",
        ownerName: "소원 운영자 01",
        phone: "010-0000-0001",
        kakaoUrl: "https://pf.kakao.com/_example1",
        status: PublishStatus.published,
      },
    }),
    prisma.businessProfile.create({
      data: {
        regionId,
        name: "소원 체험 마을",
        businessType: "experience",
        ownerName: "소원 운영자 02",
        phone: "010-0000-0002",
        naverBookingUrl: "https://booking.naver.com/example2",
        status: PublishStatus.published,
      },
    }),
    prisma.businessProfile.create({
      data: {
        regionId,
        name: "소원 로컬 상점",
        businessType: "local_income_program",
        ownerName: "소원 운영자 03",
        phone: "010-0000-0003",
        websiteUrl: "https://sowon-shop.example.com",
        status: PublishStatus.published,
      },
    }),
    prisma.businessProfile.create({
      data: {
        regionId,
        name: "소원 레저 연합",
        businessType: "experience",
        ownerName: "소원 운영자 04",
        phone: "010-0000-0004",
        status: PublishStatus.published,
      },
    }),
    prisma.businessProfile.create({
      data: {
        regionId,
        name: "미등록 파트너 05",
        businessType: "pending",
        ownerName: "임시 운영자",
        status: PublishStatus.draft,
      },
    }),
  ]);

  const accommodationBySlug = new Map<string, string>();
  const experienceBySlug = new Map<string, string>();
  const programBySlug = new Map<string, string>();

  for (const [index, stay] of FALLBACK_STAYS.entries()) {
    const created = await prisma.accommodation.create({
      data: {
        regionId,
        businessProfileId: index < 2 ? bizProfiles[0].id : null,
        title: stay.title,
        slug: stay.slug,
        summary: stay.summary,
        description: nullable(stay.description),
        address: nullable(stay.address),
        priceText: nullable(stay.priceText),
        capacityText: nullable(stay.capacityText),
        images: stay.images ?? [],
        phone: nullable(stay.phone),
        kakaoUrl: nullable(stay.kakaoUrl),
        naverBookingUrl: nullable(stay.naverBookingUrl),
        websiteUrl: nullable(stay.websiteUrl),
        status: toPublishStatus(stay.status),
      },
    });
    accommodationBySlug.set(stay.slug, created.id);
  }

  for (const [index, experience] of FALLBACK_EXPERIENCES.entries()) {
    const created = await prisma.experience.create({
      data: {
        regionId,
        businessProfileId: index % 2 === 0 ? bizProfiles[1].id : bizProfiles[3].id,
        title: experience.title,
        slug: experience.slug,
        summary: experience.summary,
        description: nullable(experience.description),
        category: nullable(experience.category),
        location: nullable(experience.location),
        durationText: nullable(experience.durationText),
        priceText: nullable(experience.priceText),
        capacityText: nullable(experience.capacityText),
        images: experience.images ?? [],
        phone: nullable(experience.phone),
        kakaoUrl: nullable(experience.kakaoUrl),
        naverBookingUrl: nullable(experience.naverBookingUrl),
        websiteUrl: nullable(experience.websiteUrl),
        status: toPublishStatus(experience.status),
      },
    });
    experienceBySlug.set(experience.slug, created.id);
  }

  for (const [index, program] of FALLBACK_PROGRAMS.entries()) {
    const created = await prisma.localIncomeProgram.create({
      data: {
        regionId,
        businessProfileId: index % 2 === 0 ? bizProfiles[2].id : bizProfiles[1].id,
        title: program.title,
        slug: program.slug,
        summary: program.summary,
        description: nullable(program.description),
        linkedLifeService: program.linkedLifeService,
        residentRole: program.residentRole,
        revenueUse: program.revenueUse,
        category: nullable(program.category),
        location: nullable(program.location),
        durationText: nullable(program.durationText),
        capacityText: nullable(program.capacityText),
        priceText: nullable(program.priceText),
        images: program.images ?? [],
        phone: nullable(program.phone),
        kakaoUrl: nullable(program.kakaoUrl),
        naverBookingUrl: nullable(program.naverBookingUrl),
        websiteUrl: nullable(program.websiteUrl),
        status: toPublishStatus(program.status),
      },
    });
    programBySlug.set(program.slug, created.id);
  }

  for (const course of FALLBACK_COURSES) {
    const createdCourse = await prisma.course.create({
      data: {
        regionId,
        title: course.title,
        slug: course.slug,
        summary: course.summary,
        description: nullable(course.description),
        targetType: nullable(course.targetType),
        durationType: nullable(course.durationType),
        season: nullable(course.season),
        images: course.images ?? [],
        status: toPublishStatus(course.status),
      },
    });

    const courseItems = course.routeItems
      .map((item) => {
        if (item.itemType === CourseItemType.accommodation && item.slug) {
          const accommodationId = accommodationBySlug.get(item.slug);
          if (!accommodationId) return null;
          return {
            courseId: createdCourse.id,
            itemType: CourseItemType.accommodation,
            accommodationId,
            sortOrder: item.sortOrder,
            note: noteWithTime(item.time, item.note, item.description),
          };
        }

        if (item.itemType === CourseItemType.experience && item.slug) {
          const experienceId = experienceBySlug.get(item.slug);
          if (!experienceId) return null;
          return {
            courseId: createdCourse.id,
            itemType: CourseItemType.experience,
            experienceId,
            sortOrder: item.sortOrder,
            note: noteWithTime(item.time, item.note, item.description),
          };
        }

        if (item.itemType === CourseItemType.local_income_program && item.slug) {
          const localIncomeProgramId = programBySlug.get(item.slug);
          if (!localIncomeProgramId) return null;
          return {
            courseId: createdCourse.id,
            itemType: CourseItemType.local_income_program,
            localIncomeProgramId,
            sortOrder: item.sortOrder,
            note: noteWithTime(item.time, item.note, item.description),
          };
        }

        console.warn(`Skipped unlinked course item in ${course.slug}: ${item.title}`);
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (courseItems.length > 0) {
      await prisma.courseItem.createMany({ data: courseItems });
    }
  }

  const acc1Id = accommodationBySlug.get("sowon-house-01");
  const acc2Id = accommodationBySlug.get("cheonripo-minbak");
  const exp1Id = experienceBySlug.get("mallipo-sunset-walk");
  const prog1Id = programBySlug.get("village-dining");

  await prisma.inquiry.createMany({
    data: [
      {
        regionId,
        name: "예시 질문자 01",
        phone: "010-0000-0011",
        message: "숙소 예약 문의드립니다. 2명이서 1박 가능할까요?",
        privacyConsent: true,
        status: InquiryStatus.new,
        targetType: "accommodation",
        targetId: acc1Id,
      },
      {
        regionId,
        name: "예시 질문자 02",
        email: "test-02@example.com",
        message: "주민 밥상 프로그램은 단체 문의도 되나요?",
        privacyConsent: true,
        status: InquiryStatus.in_progress,
        targetType: "local_income_program",
        targetId: prog1Id,
      },
    ],
  });

  await prisma.partnerApplication.createMany({
    data: [
      {
        regionId,
        businessName: "햇살 브런치 카페",
        applicantName: "카페 운영자 01",
        phone: "010-0000-0012",
        businessType: "F&B / 로컬상점",
        message: "지역 식재료를 활용한 메뉴를 제안하고 싶습니다.",
        privacyConsent: true,
        status: InquiryStatus.new,
      },
      {
        regionId,
        businessName: "소원 낚시 체험단",
        applicantName: "체험 운영자 03",
        phone: "010-0000-0013",
        businessType: "Experience",
        message: "계절별 낚시 체험 프로그램을 제안합니다.",
        privacyConsent: true,
        status: InquiryStatus.resolved,
      },
    ],
  });

  await prisma.trainingCourse.create({
    data: {
      regionId,
      title: "지역 관광 가이드 역량 강화 교육 (기초)",
      summary: "소원권역 스토리텔링 및 고객 응대 교육",
      status: PublishStatus.published,
    },
  });

  await prisma.certification.create({
    data: {
      regionId,
      title: "소원면 우수 주민사업장 인증",
      summary: "서비스 품질 및 지역 환원 기여도 검증 완료",
      status: PublishStatus.published,
    },
  });

  await prisma.event.createMany({
    data: [
      {
        regionId,
        tag: "소원권역 주말 기획",
        title: "바다마을 체험 주간",
        subTitle: "숙소와 체험을 함께 둘러보는 연결형 소식",
        description: "소원권역의 숙소, 체험, 주민소득상품을 한 번에 살펴볼 수 있는 운영 소식입니다.",
        gradient: "from-blue-50 to-indigo-100/40",
        href: "/experiences",
        status: PublishStatus.published,
      },
      {
        regionId,
        tag: "주민소득상품 안내",
        title: "마을 밥상과 로컬 별미",
        subTitle: "주민이 운영하는 소원 별미 프로그램",
        description: "로컬 식재료와 주민 참여를 중심으로 구성한 주민소득상품을 소개합니다.",
        gradient: "from-amber-50 to-yellow-100/40",
        href: "/programs",
        status: PublishStatus.published,
      },
      {
        regionId,
        tag: "추천 코스",
        title: "하루로 만나는 소원 여정",
        subTitle: "숙소, 체험, 별미를 잇는 추천 동선",
        description: "소원권역의 공개 콘텐츠를 조합한 추천 코스를 확인해 보세요.",
        gradient: "from-teal-50 to-emerald-100/40",
        href: "/courses",
        status: PublishStatus.published,
      },
      {
        regionId,
        tag: "운영자 검토용",
        title: "비공개 이벤트 예시",
        subTitle: "공개 화면 비노출 검증용 draft 데이터",
        description: "이 이벤트는 draft 상태이므로 공개 화면에 노출되면 안 됩니다.",
        gradient: "from-gray-50 to-slate-100/40",
        href: "/stays",
        status: PublishStatus.draft,
      },
    ],
  });

  await prisma.leadEvent.createMany({
    data: [
      { regionId, eventType: LeadEventType.phone_click, targetType: "accommodation", targetId: acc1Id, sourcePath: "/" },
      { regionId, eventType: LeadEventType.kakao_click, targetType: "experience", targetId: exp1Id, sourcePath: "/experiences/mallipo-sunset-walk" },
      { regionId, eventType: LeadEventType.naver_booking_click, targetType: "accommodation", targetId: acc2Id, sourcePath: "/stays/cheonripo-minbak" },
      { regionId, eventType: LeadEventType.website_click, targetType: "experience", targetId: exp1Id, sourcePath: "/experiences/mallipo-sunset-walk" },
      { regionId, eventType: LeadEventType.inquiry_submit, targetType: "accommodation", targetId: acc1Id, sourcePath: "/stays/sowon-house-01" },
    ],
  });

  console.log(`Seeded ${FALLBACK_STAYS.length} stays, ${FALLBACK_EXPERIENCES.length} experiences, ${FALLBACK_PROGRAMS.length} programs, ${FALLBACK_COURSES.length} courses.`);
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
