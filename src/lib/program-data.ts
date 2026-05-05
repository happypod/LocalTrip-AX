import { LocalIncomeProgram, PublishStatus } from "@prisma/client";

export interface LocalIncomeProgramUI extends Partial<LocalIncomeProgram> {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string | null;
  linkedLifeService: string;
  residentRole: string;
  revenueUse: string;
  location?: string | null;
  priceText?: string | null;
  images: string[];
  phone?: string | null;
  kakaoUrl?: string | null;
  naverBookingUrl?: string | null;
  websiteUrl?: string | null;
  status: PublishStatus;
  regionId: string;
  // Extended fields for fallback/future use similar to experience
  durationText?: string | null;
  capacityText?: string | null;
  meetingPoint?: string | null;
  preparation?: string | null;
  includes?: string | null;
  excludes?: string | null;
  safetyNotice?: string | null;
  category?: string | null;
}

export const FALLBACK_PROGRAMS: LocalIncomeProgramUI[] = [
  {
    id: "prog-1",
    slug: "village-dining",
    title: "주민이 차려주는 제철 어촌 밥상",
    summary: "천리포 부녀회에서 직접 잡은 수산물로 차리는 건강한 한 끼",
    description: "제철 해산물과 마을에서 직접 기른 채소를 활용한 한상차림입니다.",
    linkedLifeService: "지역 노인 급식 지원 사업 연계",
    residentRole: "식재료 채집(어촌계), 조리(부녀회)",
    revenueUse: "마을 공동 기금 30%, 참여 주민 활동비 70%",
    location: "천리포 마을 회관",
    priceText: "15,000원",
    durationText: "1시간 30분",
    capacityText: "최소 2인",
    images: ['/images/programs/prog-01.jpg'],
    phone: "010-0000-0002",
    kakaoUrl: null,
    naverBookingUrl: null,
    websiteUrl: null,
    status: PublishStatus.published,
    regionId: "sowon",
    category: "식생활",
    meetingPoint: "천리포 마을 회관 입구",
    preparation: null,
    includes: "제철 어촌 밥상 1인분",
    excludes: null,
    safetyNotice: "식품 알레르기가 있으신 경우 사전에 문의해 주세요.",
  },
  {
    id: "prog-2",
    slug: "salt-farm-tour",
    title: "전통 방식 염전 체험 및 소금 판매",
    summary: "천일염의 고장에서 경험하는 전통 소금 밀기 체험",
    description: "염전 장인과 함께하는 소금 밀기 체험과 프리미엄 천일염 판매",
    linkedLifeService: "청년 귀어 교육 프로그램 연계",
    residentRole: "염전 장인의 교육 및 시연",
    revenueUse: "시설 유지 관리비 및 마을 장학금 적립",
    location: "소원면 염전 일대",
    priceText: "10,000원",
    durationText: "1시간",
    capacityText: "제한 없음",
    images: ['/images/programs/prog-02.jpg'],
    phone: null,
    kakaoUrl: "https://pf.kakao.com/_example1", // Kakao only test
    naverBookingUrl: null,
    websiteUrl: null,
    status: PublishStatus.published,
    regionId: "sowon",
    category: "어촌자원",
  },
  {
    id: "prog-3",
    slug: "woodworking-class",
    title: "주민 목공방 기초 클래스 (DRAFT)",
    summary: "마을 목공소에서 배우는 기초 가구 제작",
    linkedLifeService: "마을 노후 주택 수리 봉사단 연계",
    residentRole: "마을 목수님의 재능 기부",
    revenueUse: "공동 작업장 공구 구입비",
    images: ['/images/programs/prog-03.jpg'],
    status: PublishStatus.draft,
    regionId: "sowon",
    category: "공동공간",
  },
  // Minimum required fallback slugs from instructions
  {
    id: "prog-4",
    slug: "sowon-sea-water-playground",
    title: "소원 바다물길 놀이터",
    summary: "자연이 만든 안전한 바다 놀이터에서 즐기는 생태 학습",
    linkedLifeService: "지역 청소년 생태 교육 연계",
    residentRole: "안전 요원 및 생태 해설사",
    revenueUse: "바다 놀이터 환경 정화 기금",
    location: "어은돌 해수욕장 인근",
    priceText: "무료 (기부제)",
    images: ['/images/programs/prog-04.jpg'],
    phone: "010-0000-0004",
    status: PublishStatus.published,
    regionId: "sowon",
    category: "가족체류",
  },
  {
    id: "prog-5",
    slug: "pension-kids-water-yard",
    title: "펜션 마당 키즈 풀장",
    summary: "펜션 마당에서 아이들이 안전하게 즐기는 물놀이장",
    linkedLifeService: "가족 체류형 관광 인프라 개선",
    residentRole: "펜션 운영주 연합 시설 관리",
    revenueUse: "수질 관리 및 안전 장비 확충",
    location: "소원면 펜션 밀집 구역",
    priceText: "이용 시설에 따라 다름",
    images: ['/images/programs/prog-05.jpg'],
    phone: "010-0000-0005",
    status: PublishStatus.published,
    regionId: "sowon",
    category: "가족체류",
  },
  {
    id: "prog-6",
    slug: "local-table-experience",
    title: "태안 로컬 식재료 팜다이닝",
    summary: "지역 농부들이 재배한 식재료로 만드는 특별한 코스 요리",
    linkedLifeService: "지역 농가 판로 확대 및 소득 증대",
    residentRole: "농산물 공급 및 농장 투어 가이드",
    revenueUse: "참여 농가 소득 보전 및 종자 구입",
    location: "소원면 농장 일대",
    priceText: "50,000원",
    images: ['/images/programs/prog-06.jpg'],
    naverBookingUrl: "https://booking.naver.com/456",
    status: PublishStatus.published,
    regionId: "sowon",
    category: "식생활",
  },
  {
    id: "prog-7",
    slug: "gamtae-packing-class",
    title: "수제 감태 선물세트 포장 클래스",
    summary: "지역 특산물 감태를 예쁘게 포장해 선물하는 체험",
    linkedLifeService: "마을 공동 브랜드 가치 향상",
    residentRole: "마을 어르신들의 포장 노하우 전수",
    revenueUse: "어르신 강사 인건비 및 패키지 개발",
    location: "소원면 마을 회관",
    priceText: "30,000원 (감태 포함)",
    images: ['/images/programs/prog-07.jpg'],
    phone: "010-0000-0007",
    status: PublishStatus.published,
    regionId: "sowon",
    category: "주민일자리",
  },
  {
    id: "prog-8",
    slug: "harbor-morning-tour",
    title: "활기찬 항구 아침 투어",
    summary: "경매가 열리는 항구의 아침을 주민 해설사와 함께 걷기",
    linkedLifeService: "어촌 문화 보존 및 알림",
    residentRole: "전직 어부 출신 마을 해설사",
    revenueUse: "어촌계 복지 기금",
    location: "모항항 일대",
    priceText: "무료",
    durationText: "1시간",
    images: ['/images/programs/prog-08.jpg'],
    phone: "010-0000-0008",
    status: PublishStatus.published,
    regionId: "sowon",
    category: "생활인구",
    safetyNotice: "항구 작업 차량과 미끄러운 바닥에 주의하세요.",
  }
];
