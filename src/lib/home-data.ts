import { PublishStatus } from "@prisma/client";

export const FALLBACK_STAYS = [
  {
    id: "mock-stay-1",
    slug: "sowon-house-01",
    title: "소원 낙조 펜션",
    summary: "만리포 해변이 한눈에 보이는 바다 전망 펜션",
    priceText: "평일 120,000원 ~",
    images: ["/placeholder-acc-1.jpg"],
    status: PublishStatus.published,
  },
  {
    id: "mock-stay-2",
    slug: "padori-minbak",
    title: "파도리 어촌 민박",
    summary: "어촌 마을의 정취를 느낄 수 있는 소박한 민박",
    priceText: "50,000원",
    images: [],
    status: PublishStatus.published,
  },
];

export const FALLBACK_EXPERIENCES = [
  {
    id: "mock-exp-1",
    slug: "surfing-class",
    title: "만리포 초보 서핑 클래스",
    summary: "서해의 하와이, 만리포에서 배우는 입문 서핑",
    durationText: "2시간",
    priceText: "60,000원",
    images: ["/placeholder-exp-1.jpg"],
    status: PublishStatus.published,
  },
  {
    id: "mock-exp-2",
    slug: "sea-glass-art",
    title: "씨글라스 업사이클링 공예",
    summary: "해변에서 주운 유리 조각으로 나만의 기념품 만들기",
    durationText: "1.5시간",
    priceText: "25,000원",
    images: ["/placeholder-exp-2.jpg"],
    status: PublishStatus.published,
  },
];

export const FALLBACK_PROGRAMS = [
  {
    id: "mock-prog-1",
    slug: "village-dining",
    title: "주민이 차려주는 제철 어촌 밥상",
    summary: "파도리 부녀회에서 직접 잡은 수산물로 차리는 건강한 한 끼",
    priceText: "15,000원",
    images: ["/placeholder-prog-1.jpg"],
    status: PublishStatus.published,
  },
  {
    id: "mock-prog-2",
    slug: "salt-farm-tour",
    title: "전통 방식 염전 체험 및 소금 판매",
    summary: "천일염의 고장에서 경험하는 전통 소금 밀기 체험",
    priceText: "10,000원",
    images: [],
    status: PublishStatus.published,
  },
];

export const FALLBACK_COURSES = [
  {
    id: "mock-course-1",
    slug: "sowon-one-day",
    title: "소원면 바다 감성 일일 코스",
    summary: "바다 전망 숙소부터 서핑, 어촌 밥상까지 알차게 즐기는 하루",
    images: ["/placeholder-course-1.jpg"],
    status: PublishStatus.published,
  },
];
