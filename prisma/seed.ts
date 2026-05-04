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
  const bizProfiles = await Promise.all([
    prisma.businessProfile.create({
      data: {
        regionId,
        name: "소원스테이 협동조합",
        ownerName: "김소원",
        phone: "010-1234-5678",
        kakaoUrl: "https://pf.kakao.com/_example1",
        status: PublishStatus.published,
      },
    }),
    prisma.businessProfile.create({
      data: {
        regionId,
        name: "파도리 어촌계",
        ownerName: "이파도",
        phone: "010-2222-3333",
        naverBookingUrl: "https://booking.naver.com/example2",
        status: PublishStatus.published,
      },
    }),
    prisma.businessProfile.create({
      data: {
        regionId,
        name: "소원 공방",
        ownerName: "박공예",
        websiteUrl: "https://sowon-art.example.com",
        status: PublishStatus.published,
      },
    }),
    prisma.businessProfile.create({
      data: {
        regionId,
        name: "만리포 서핑 연합",
        phone: "010-4444-5555",
        status: PublishStatus.published,
      },
    }),
    prisma.businessProfile.create({
      data: {
        regionId,
        name: "미등록 파트너",
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
      phone: "010-1234-5678",
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
      title: "비밀의 숲 오두막",
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
      title: "겨울 한정 얼음 낚시",
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
      phone: "041-660-0000",
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
      title: "주민 목공방 기초 클래스",
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
        name: "여행자A",
        phone: "010-0000-1111",
        message: "숙소 예약 문의드립니다. 2명이서 1박 가능할까요?",
        privacyConsent: true,
        status: InquiryStatus.new,
        targetType: "accommodation",
        targetId: acc1.id,
      },
      {
        regionId,
        name: "궁금이",
        email: "test@example.com",
        message: "주민 밥상 프로그램은 단체 예약도 되나요?",
        privacyConsent: true,
        status: InquiryStatus.in_progress,
      },
    ],
  });

  // 8. PartnerApplications (2 samples)
  await prisma.partnerApplication.createMany({
    data: [
      {
        regionId,
        businessName: "햇살 카페",
        applicantName: "김햇살",
        phone: "010-9999-8888",
        businessType: "F&B",
        message: "체험 파트너로 등록하고 싶습니다.",
        privacyConsent: true,
        status: InquiryStatus.new,
      },
      {
        regionId,
        businessName: "소원 택시",
        applicantName: "최운전",
        phone: "010-7777-6666",
        businessType: "Transport",
        message: "지역 연계 이동 서비스 제안드립니다.",
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
  await prisma.leadEvent.createMany({
    data: [
      { regionId, eventType: LeadEventType.phone_click, targetType: "accommodation", targetId: acc1.id, sourcePath: "/" },
      { regionId, eventType: LeadEventType.kakao_click, targetType: "experience", targetId: exp1.id, sourcePath: "/experience/surfing-class" },
      { regionId, eventType: LeadEventType.naver_booking_click, targetType: "accommodation", targetId: acc2.id, sourcePath: "/accommodation/padori-minbak" },
      { regionId, eventType: LeadEventType.website_click, targetType: "experience", targetId: exp1.id },
      { regionId, eventType: LeadEventType.inquiry_submit, targetType: "accommodation", targetId: acc1.id },
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
