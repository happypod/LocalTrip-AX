import { Experience, PublishStatus } from "@prisma/client";

export interface ExperienceUI extends Partial<Experience> {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string | null;
  location?: string | null;
  durationText?: string | null;
  priceText?: string | null;
  capacityText?: string | null;
  images: string[];
  phone?: string | null;
  kakaoUrl?: string | null;
  naverBookingUrl?: string | null;
  websiteUrl?: string | null;
  status: PublishStatus;
  regionId: string;
  // Extended fields for fallback/future use
  category?: string | null;
  meetingPoint?: string | null;
  preparation?: string | null;
  includes?: string | null;
  excludes?: string | null;
  safetyNotice?: string | null;
}

export const FALLBACK_EXPERIENCES: ExperienceUI[] = [
  {
    id: "exp-1",
    slug: "mallipo-sunset-walk",
    title: "만리포 노을길 산책",
    summary: "해 질 녘 만리포 해변을 따라 걷는 낭만적인 산책",
    description: "로컬 가이드와 함께 만리포 해변의 숨겨진 노을 명소를 찾아 떠납니다. 서해의 아름다운 낙조를 배경으로 인생 사진을 남겨보세요.",
    category: "해변",
    location: "만리포 해수욕장",
    durationText: "1시간 30분",
    priceText: "15,000원",
    capacityText: "최대 10인",
    images: ['/images/experiences/exp-01.jpg'],
    phone: "010-0000-0001",
    kakaoUrl: "https://pf.kakao.com/_xxxx",
    naverBookingUrl: "https://booking.naver.com/123",
    websiteUrl: null,
    meetingPoint: "만리포 해수욕장 관광안내소 앞",
    preparation: "편안한 운동화, 개인 생수",
    includes: "가이드비, 기념 사진 촬영",
    excludes: "개인 간식, 음료",
    safetyNotice: "기상 악화 시 취소될 수 있습니다. 노을 시간대에 따라 출발 시간이 변동될 수 있습니다.",
    status: PublishStatus.published,
    regionId: "sowon",
  },
  {
    id: "exp-2",
    slug: "gamtae-mini-class",
    title: "감태 미니 클래스",
    summary: "소원면 특산물 감태를 직접 만져보고 맛보는 체험",
    description: "청정 지역에서 자란 감태의 생산 과정을 배우고, 직접 감태를 활용한 간단한 간식을 만들어봅니다.",
    category: "음식",
    location: "소원면 주민센터 인근",
    durationText: "1시간",
    priceText: "20,000원",
    capacityText: "4인 이상",
    images: ['/images/experiences/exp-02.jpg'],
    phone: "010-0000-0002",
    kakaoUrl: null,
    naverBookingUrl: null,
    websiteUrl: "https://example.com/gamtae",
    meetingPoint: "소원면 맛마을 공방",
    preparation: "앞치마 (선택사항)",
    includes: "재료비, 시식비",
    excludes: null,
    safetyNotice: "식품 알레르기가 있는 경우 미리 말씀해 주세요.",
    status: PublishStatus.published,
    regionId: "sowon",
  },
  {
    id: "exp-3",
    slug: "fishing-village-morning-walk",
    title: "어촌 마을의 아침 산책",
    summary: "활기찬 어촌의 아침을 여는 조용한 산책",
    description: "새벽녘 어시장과 조용한 어촌 마을을 둘러보며 진정한 로컬의 일상을 경험합니다.",
    category: "어촌",
    location: "천리포 어촌마을",
    durationText: "1시간",
    priceText: "무료 (팁 기반)",
    capacityText: "제한 없음",
    images: ['/images/experiences/exp-04.jpg'],
    phone: "010-0000-0003",
    kakaoUrl: "https://pf.kakao.com/_yyyy",
    naverBookingUrl: null,
    websiteUrl: null,
    meetingPoint: "천리포 선착장 입구",
    preparation: "따뜻한 외투",
    includes: "마을 안내",
    excludes: "개인 소비 비용",
    safetyNotice: "선착장 근처에서는 안전에 유의해 주세요.",
    status: PublishStatus.published,
    regionId: "sowon",
  },
  {
    id: "exp-4",
    slug: "beachcombing-workshop",
    title: "비치코밍 업사이클링 워크숍",
    summary: "바다의 유리를 보석으로 바꾸는 친환경 체험",
    description: "해변에서 주운 씨글라스를 활용하여 나만의 액세서리를 만듭니다. 바다 환경도 지키고 특별한 추념품도 가져가세요.",
    category: "ESG",
    location: "소원면 공방",
    durationText: "2시간",
    priceText: "25,000원",
    capacityText: "최대 6인",
    images: ['/images/experiences/exp-03.jpg'],
    phone: "010-0000-0004",
    kakaoUrl: null,
    naverBookingUrl: "https://booking.naver.com/456",
    websiteUrl: null,
    meetingPoint: "에코 소원 공방",
    preparation: null,
    includes: "재료 일체, 포장 패키지",
    excludes: null,
    safetyNotice: "유리 조각을 다룰 때 주의가 필요합니다.",
    status: PublishStatus.published,
    regionId: "sowon",
  }
];
