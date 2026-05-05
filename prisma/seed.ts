import "dotenv/config";
import { PrismaClient, PublishStatus, LeadEventType, CourseItemType, InquiryStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Start seeding...");

  // 1. Region: 소원권역 (Sowon)
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

  // Cleanup for repeatability: Delete existing mock data for this region in reverse dependency order
  console.log(`Cleaning up existing data for region: ${sowonRegion.name}...`);
  
  await prisma.leadEvent.deleteMany({ where: { regionId } });
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

  // 2. BusinessProfiles (5 samples)
  // [P3] Use obvious placeholder names and numbers
  const bizProfiles = await Promise.all([
    prisma.businessProfile.create({
      data: {
        regionId,
        name: "소원 숙박 협동조합",
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
        ownerName: "소원 운영자 04",
        phone: "010-0000-0004",
        status: PublishStatus.published,
      },
    }),
    prisma.businessProfile.create({
      data: {
        regionId,
        name: "미등록 파트너 05",
        ownerName: "임시 운영자",
        status: PublishStatus.draft,
      },
    }),
  ]);

  // 3. Accommodations (4 published samples + 1 draft)
  const acc1 = await prisma.accommodation.create({
    data: {
      regionId,
      businessProfileId: bizProfiles[0].id,
      title: "소원 낙조 펜션",
      slug: "sowon-house-01",
      summary: "만리포 해변이 한눈에 보이는 바다 전망 펜션",
      address: "충남 태안군 소원면 만리포길 123",
      priceText: "평일 120,000원 ~",
      capacityText: "2~4인",
      images: ["/images/stays/stay-01.jpg"],
      phone: "010-0000-0001",
      kakaoUrl: "https://pf.kakao.com/_example1",
      status: PublishStatus.published,
    },
  });

  const acc2 = await prisma.accommodation.create({
    data: {
      regionId,
      businessProfileId: bizProfiles[1].id,
      title: "천리포 파랑새 민박",
      slug: "cheonripo-minbak",
      summary: "어촌 마을의 정취를 느낄 수 있는 소박한 민박",
      address: "충남 태안군 소원면 천리포길 45",
      priceText: "50,000원",
      capacityText: "기준 1인 / 최대 2인",
      images: ["/images/stays/stay-02.jpg"],
      phone: "010-0000-0002",
      status: PublishStatus.published,
    },
  });

  await prisma.accommodation.create({
    data: {
      regionId,
      title: "의항 한옥 스테이",
      slug: "uihang-hanok-stay",
      summary: "소나무 숲과 바다 산책로가 가까운 조용한 한옥 숙소",
      description: "의항 해변과 솔숲 산책로를 함께 즐길 수 있는 한옥형 숙소입니다. 작은 마당과 온돌방을 갖춰 가족 여행이나 조용한 휴식에 어울립니다.",
      address: "충남 태안군 소원면 의항리길 78",
      priceText: "평일 90,000원 ~",
      capacityText: "기준 2인 / 최대 4인",
      images: ["/images/courses/course-02.jpg"],
      phone: "010-0000-0003",
      kakaoUrl: "https://pf.kakao.com/_example3",
      status: PublishStatus.published,
    },
  });

  await prisma.accommodation.create({
    data: {
      regionId,
      title: "만리포 바다 글램핑",
      slug: "mallipo-glamping",
      summary: "해변 가까이에서 캠핑 분위기를 즐기는 감성 글램핑",
      description: "만리포 해변 접근성이 좋은 글램핑형 숙소입니다. 바다 산책과 노을 감상을 중심으로 짧은 체류 여행을 계획하기 좋습니다.",
      address: "충남 태안군 소원면 만리포2길 31",
      priceText: "평일 110,000원 ~",
      capacityText: "기준 2인 / 최대 3인",
      images: ["/images/stays/stay-04.jpg"],
      phone: "010-0000-0004",
      naverBookingUrl: "https://booking.naver.com/example4",
      status: PublishStatus.published,
    },
  });

  // 4. Experiences (Complete set from fallbacks)
  const exp1 = await prisma.experience.create({
    data: {
      regionId,
      businessProfileId: bizProfiles[3].id,
      title: "만리포 노을길 산책",
      slug: "mallipo-sunset-walk",
      summary: "해 질 녘 만리포 해변을 따라 걷는 낭만적인 산책",
      location: "만리포 해수욕장",
      durationText: "1시간 30분",
      priceText: "15,000원",
      capacityText: "최대 10인",
      images: ["/images/experiences/exp-01.jpg"],
      status: PublishStatus.published,
    },
  });

  const exp2 = await prisma.experience.create({
    data: {
      regionId,
      businessProfileId: bizProfiles[2].id,
      title: "감태 미니 클래스",
      slug: "gamtae-mini-class",
      summary: "소원면 특산물 감태를 직접 만져보고 맛보는 체험",
      location: "소원면 주민센터 인근",
      durationText: "1시간",
      priceText: "20,000원",
      images: ["/images/experiences/exp-02.jpg"],
      status: PublishStatus.published,
    },
  });

  await prisma.experience.create({
    data: {
      regionId,
      title: "어촌 마을의 아침 산책",
      slug: "fishing-village-morning-walk",
      summary: "활기찬 어촌의 아침을 여는 조용한 산책",
      location: "천리포 선착장 입구",
      durationText: "1시간",
      priceText: "무료",
      images: ["/images/experiences/exp-04.jpg"],
      status: PublishStatus.published,
    },
  });

  await prisma.experience.create({
    data: {
      regionId,
      title: "비치코밍 업사이클링 워크숍",
      slug: "beachcombing-workshop",
      summary: "바다의 유리를 보석으로 바꾸는 친환경 체험",
      location: "에코 소원 공방",
      durationText: "2시간",
      priceText: "25,000원",
      images: ["/images/experiences/exp-03.jpg"],
      status: PublishStatus.published,
    },
  });

  // 5. LocalIncomePrograms (Complete set from fallbacks)
  const prog1 = await prisma.localIncomeProgram.create({
    data: {
      regionId,
      businessProfileId: bizProfiles[1].id,
      title: "주민이 차려주는 제철 어촌 밥상",
      slug: "village-dining",
      summary: "천리포 부녀회에서 직접 잡은 수산물로 차리는 건강한 한 끼",
      linkedLifeService: "지역 노인 급식 지원 사업 연계",
      residentRole: "식재료 채집(어촌계), 조리(부녀회)",
      revenueUse: "마을 공동 기금 30%, 참여 주민 활동비 70%",
      location: "천리포 마을 회관",
      priceText: "15,000원",
      images: ["/images/programs/prog-01.jpg"],
      status: PublishStatus.published,
    },
  });

  await prisma.localIncomeProgram.createMany({
    data: [
      {
        regionId,
        title: "전통 방식 염전 체험 및 소금 판매",
        slug: "salt-farm-tour",
        summary: "천일염의 고장에서 경험하는 전통 소금 밀기 체험",
        linkedLifeService: "청년 귀어 교육 프로그램 연계",
        residentRole: "염전 장인의 교육 및 시연",
        revenueUse: "시설 유지 관리비 및 마을 장학금 적립",
        priceText: "10,000원",
        images: ["/images/programs/prog-02.jpg"],
        status: PublishStatus.published,
      },
      {
        regionId,
        title: "소원 바다물길 놀이터",
        slug: "sowon-sea-water-playground",
        summary: "자연이 만든 안전한 바다 놀이터에서 즐기는 생태 학습",
        linkedLifeService: "지역 청소년 생태 교육 연계",
        residentRole: "안전 요원 및 생태 해설사",
        revenueUse: "바다 놀이터 환경 정화 기금",
        images: ["/images/programs/prog-04.jpg"],
        status: PublishStatus.published,
      },
      {
        regionId,
        title: "펜션 마당 키즈 풀장",
        slug: "pension-kids-water-yard",
        summary: "펜션 마당에서 아이들이 안전하게 즐기는 물놀이장",
        linkedLifeService: "가족 체류형 관광 인프라 개선",
        residentRole: "펜션 운영주 연합 시설 관리",
        revenueUse: "수질 관리 및 안전 장비 확충",
        images: ["/images/programs/prog-05.jpg"],
        status: PublishStatus.published,
      },
      {
        regionId,
        title: "태안 로컬 식재료 팜다이닝",
        slug: "local-table-experience",
        summary: "지역 농부들이 재배한 식재료로 만드는 특별한 코스 요리",
        linkedLifeService: "지역 농가 판로 확대 및 소득 증대",
        residentRole: "농산물 공급 및 농장 투어 가이드",
        revenueUse: "참여 농가 소득 보전 및 종자 구입",
        images: ["/images/programs/prog-06.jpg"],
        status: PublishStatus.published,
      },
      {
        regionId,
        title: "수제 감태 선물세트 포장 클래스",
        slug: "gamtae-packing-class",
        summary: "지역 특산물 감태를 예쁘게 포장해 선물하는 체험",
        linkedLifeService: "마을 공동 브랜드 가치 향상",
        residentRole: "마을 어르신들의 포장 노하우 전수",
        revenueUse: "어르신 강사 인건비 및 패키지 개발",
        images: ["/images/programs/prog-07.jpg"],
        status: PublishStatus.published,
      },
      {
        regionId,
        title: "활기찬 항구 아침 투어",
        slug: "harbor-morning-tour",
        summary: "경매가 열리는 항구의 아침을 주민 해설사와 함께 걷기",
        linkedLifeService: "어촌 문화 보존 및 알림",
        residentRole: "전직 어부 출신 마을 해설사",
        revenueUse: "어촌계 복지 기금",
        images: ["/images/programs/prog-08.jpg"],
        status: PublishStatus.published,
      },
    ],
  });

  // 6. Courses (2 samples)
  const course1 = await prisma.course.create({
    data: {
      regionId,
      title: "소원면 바다 감성 일일 코스",
      slug: "sowon-one-day",
      summary: "바다 전망 숙소부터 서핑, 어촌 밥상까지 알차게 즐기는 하루",
      images: ["/images/courses/course-01.jpg"],
      status: PublishStatus.published,
    },
  });

  await prisma.courseItem.createMany({
    data: [
      {
        courseId: course1.id,
        itemType: CourseItemType.accommodation,
        accommodationId: acc1.id,
        sortOrder: 1,
        note: "아침 일찍 일어나 만리포 해변 산책 추천",
      },
      {
        courseId: course1.id,
        itemType: CourseItemType.experience,
        experienceId: exp1.id,
        sortOrder: 2,
        note: "오후 2시 타임 서핑 클래스 참여",
      },
      {
        courseId: course1.id,
        itemType: CourseItemType.local_income_program,
        localIncomeProgramId: prog1.id,
        sortOrder: 3,
        note: "천리포 마을회관에서 저녁 식사",
      },
    ],
  });

  const course2 = await prisma.course.create({
    data: {
      regionId,
      title: "예술가와 함께하는 힐링 여행",
      slug: "artistic-retreat",
      images: ["/images/courses/course-02.jpg"],
      summary: "조용한 마을에서 공예 체험과 휴식을 즐기는 코스",
      status: PublishStatus.published,
    },
  });

  await prisma.courseItem.createMany({
    data: [
      {
        courseId: course2.id,
        itemType: CourseItemType.experience,
        experienceId: exp2.id,
        sortOrder: 1,
      },
      {
        courseId: course2.id,
        itemType: CourseItemType.accommodation,
        accommodationId: acc2.id,
        sortOrder: 2,
      },
    ],
  });

  // 7. Inquiries (2 samples)
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
        targetId: acc1.id,
      },
      {
        regionId,
        name: "예시 질문자 02",
        email: "test-02@example.com",
        message: "주민 밥상 프로그램은 단체 예약도 되나요?",
        privacyConsent: true,
        status: InquiryStatus.in_progress,
      },
    ],
  });

  // 8. PartnerApplications (2 samples)
  // [P1] Remove "Transport" (Sowon Taxi) as it's out of scope
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

  // 9. Training & Certifications
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

  // 10. LeadEvents (Sample for analysis tests)
  // [P2] Use correct IA paths: /stays/[slug], /experiences/[slug]
  await prisma.leadEvent.createMany({
    data: [
      { regionId, eventType: LeadEventType.phone_click, targetType: "accommodation", targetId: acc1.id, sourcePath: "/" },
      { regionId, eventType: LeadEventType.kakao_click, targetType: "experience", targetId: exp1.id, sourcePath: "/experiences/surfing-class" },
      { regionId, eventType: LeadEventType.naver_booking_click, targetType: "accommodation", targetId: acc2.id, sourcePath: "/stays/cheonripo-minbak" },
      { regionId, eventType: LeadEventType.website_click, targetType: "experience", targetId: exp1.id, sourcePath: "/experiences/surfing-class" },
      { regionId, eventType: LeadEventType.inquiry_submit, targetType: "accommodation", targetId: acc1.id, sourcePath: "/stays/sowon-house-01" },
    ],
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
