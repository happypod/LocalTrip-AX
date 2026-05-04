import { PrismaClient, PublishStatus, LeadEventType, CourseItemType, InquiryStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. Region: 소원권역 (Sowon)
  const sowonRegion = await prisma.region.upsert({
    where: { slug: "sowon" },
    update: {},
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

  // 3. Accommodations (3 samples)
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
      images: ["/placeholder-acc-1.jpg"],
      phone: "010-0000-0001",
      kakaoUrl: "https://pf.kakao.com/_example1",
      status: PublishStatus.published,
    },
  });

  const acc2 = await prisma.accommodation.create({
    data: {
      regionId,
      businessProfileId: bizProfiles[1].id,
      title: "파도리 어촌 민박",
      slug: "padori-minbak",
      summary: "어촌 마을의 정취를 느낄 수 있는 소박한 민박",
      address: "충남 태안군 소원면 파도리길 45",
      priceText: "50,000원",
      images: [], // fallback test
      naverBookingUrl: "https://booking.naver.com/example2",
      status: PublishStatus.published,
    },
  });

  await prisma.accommodation.create({
    data: {
      regionId,
      title: "비밀의 숲 오두막 (DRAFT)",
      slug: "secret-cabin",
      summary: "준비 중인 숲속 캠핑 스팟",
      status: PublishStatus.draft,
    },
  });

  // 4. Experiences (3 samples)
  const exp1 = await prisma.experience.create({
    data: {
      regionId,
      businessProfileId: bizProfiles[3].id,
      title: "만리포 초보 서핑 클래스",
      slug: "surfing-class",
      summary: "서해의 하와이, 만리포에서 배우는 입문 서핑",
      location: "만리포 해수욕장",
      durationText: "2시간",
      priceText: "60,000원 (보드 대여 포함)",
      capacityText: "최대 10인",
      images: ["/placeholder-exp-1.jpg"],
      websiteUrl: "https://sowon-surf.example.com",
      status: PublishStatus.published,
    },
  });

  const exp2 = await prisma.experience.create({
    data: {
      regionId,
      businessProfileId: bizProfiles[2].id,
      title: "씨글라스 업사이클링 공예",
      slug: "sea-glass-art",
      summary: "해변에서 주운 유리 조각으로 나만의 기념품 만들기",
      durationText: "1.5시간",
      priceText: "25,000원",
      images: ["/placeholder-exp-2.jpg"],
      status: PublishStatus.published,
    },
  });

  await prisma.experience.create({
    data: {
      regionId,
      title: "겨울 한정 얼음 낚시 (INACTIVE)",
      slug: "winter-fishing",
      summary: "겨울철에만 운영하는 특별 체험",
      status: PublishStatus.inactive,
    },
  });

  // 5. LocalIncomePrograms (3 samples)
  const prog1 = await prisma.localIncomeProgram.create({
    data: {
      regionId,
      businessProfileId: bizProfiles[1].id,
      title: "주민이 차려주는 제철 어촌 밥상",
      slug: "village-dining",
      summary: "파도리 부녀회에서 직접 잡은 수산물로 차리는 건강한 한 끼",
      linkedLifeService: "지역 노인 급식 지원 사업 연계",
      residentRole: "식재료 채집(어촌계), 조리(부녀회)",
      revenueUse: "마을 공동 기금 30%, 참여 주민 활동비 70%",
      location: "파도리 마을 회관",
      priceText: "15,000원",
      images: ["/placeholder-prog-1.jpg"],
      phone: "010-0000-0002",
      status: PublishStatus.published,
    },
  });

  await prisma.localIncomeProgram.create({
    data: {
      regionId,
      title: "전통 방식 염전 체험 및 소금 판매",
      slug: "salt-farm-tour",
      summary: "천일염의 고장에서 경험하는 전통 소금 밀기 체험",
      linkedLifeService: "청년 귀어 교육 프로그램 연계",
      residentRole: "염전 장인의 교육 및 시연",
      revenueUse: "시설 유지 관리비 및 마을 장학금 적립",
      priceText: "10,000원",
      status: PublishStatus.published,
    },
  });

  await prisma.localIncomeProgram.create({
    data: {
      regionId,
      title: "주민 목공방 기초 클래스 (DRAFT)",
      slug: "woodworking-class",
      summary: "마을 목공소에서 배우는 기초 가구 제작",
      linkedLifeService: "마을 노후 주택 수리 봉사단 연계",
      residentRole: "마을 목수님의 재능 기부",
      revenueUse: "공동 작업장 공구 구입비",
      status: PublishStatus.draft,
    },
  });

  // 6. Courses (2 samples)
  const course1 = await prisma.course.create({
    data: {
      regionId,
      title: "소원면 바다 감성 일일 코스",
      slug: "sowon-one-day",
      summary: "바다 전망 숙소부터 서핑, 어촌 밥상까지 알차게 즐기는 하루",
      images: ["/placeholder-course-1.jpg"],
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
        note: "파도리 마을회관에서 저녁 식사",
      },
    ],
  });

  const course2 = await prisma.course.create({
    data: {
      regionId,
      title: "예술가와 함께하는 힐링 여행",
      slug: "artistic-retreat",
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
      { regionId, eventType: LeadEventType.naver_booking_click, targetType: "accommodation", targetId: acc2.id, sourcePath: "/stays/padori-minbak" },
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
