import { Course, CourseItemType, PublishStatus } from "@prisma/client";

export interface CourseItemUI {
  id: string;
  itemType: CourseItemType;
  sortOrder: number;
  note?: string | null;
  time?: string; // Optional time display like "10:00" or "Day 1"
  title: string; // The display title of the step
  description?: string;
  slug?: string; // Link to the actual item if it exists
}

export interface CourseUI extends Partial<Course> {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string | null;
  images: string[];
  status: PublishStatus;
  regionId: string;
  // Extended fields for fallback/UI
  targetType?: string | null;
  durationType?: string | null;
  season?: string | null;
  routeItems: CourseItemUI[];
  linkedStayCount: number;
  linkedExpCount: number;
  linkedProgCount: number;
}

export const FALLBACK_COURSES: CourseUI[] = [
  {
    id: "course-1",
    slug: "sowon-one-day",
    title: "소원면 바다 감성 일일 코스",
    summary: "바다 전망 숙소부터 서핑, 어촌 밥상까지 알차게 즐기는 하루",
    description: "만리포와 천리포를 오가며 바다의 매력을 온전히 느낄 수 있는 당일치기 코스입니다.",
    images: ["/images/courses/course-01.jpg"],
    status: PublishStatus.published,
    regionId: "sowon",
    targetType: "가족/커플",
    durationType: "당일",
    season: "여름/가을",
    linkedStayCount: 1,
    linkedExpCount: 1,
    linkedProgCount: 1,
    routeItems: [
      {
        id: "ci-1-1",
        itemType: CourseItemType.accommodation,
        sortOrder: 1,
        time: "오전 10:00",
        title: "만리포 해변 산책",
        note: "숙소 주변에서 아침 산책",
        slug: "sowon-house-01"
      },
      {
        id: "ci-1-2",
        itemType: CourseItemType.experience,
        sortOrder: 2,
        time: "오후 2:00",
        title: "만리포 서핑 클래스",
        note: "초보자를 위한 입문 강습",
        slug: "surfing-class"
      },
      {
        id: "ci-1-3",
        itemType: CourseItemType.local_income_program,
        sortOrder: 3,
        time: "오후 6:30",
        title: "어촌 밥상 저녁식사",
        note: "천리포 마을회관에서 현지식 식사",
        slug: "village-dining"
      }
    ]
  },
  {
    id: "course-2",
    slug: "artistic-retreat",
    title: "예술가와 함께하는 힐링 여행",
    summary: "조용한 마을에서 공예 체험과 휴식을 즐기는 코스",
    images: ["/images/courses/course-02.jpg"],
    status: PublishStatus.published,
    regionId: "sowon",
    targetType: "커플/개인",
    durationType: "당일",
    linkedStayCount: 1,
    linkedExpCount: 1,
    linkedProgCount: 0,
    routeItems: [
      {
        id: "ci-2-1",
        itemType: CourseItemType.experience,
        sortOrder: 1,
        time: "오후 1:00",
        title: "씨글라스 업사이클링 공예",
        note: "나만의 기념품 만들기",
        slug: "sea-glass-art"
      },
      {
        id: "ci-2-2",
        itemType: CourseItemType.accommodation,
        sortOrder: 2,
        time: "오후 4:00",
        title: "천리포 어촌 민박 휴식",
        note: "조용한 민박집에서 휴식",
        slug: "cheonripo-minbak"
      }
    ]
  },
  {
    id: "course-3",
    slug: "family-2days-sowon",
    title: "가족형 1박 2일 느긋한 코스",
    summary: "숙소 주변에서 이동을 최소화하여 가족 모두가 편안한 1박 2일",
    description: "아이들과 함께하기 좋은 안전한 체류형 코스입니다.",
    images: ["/images/programs/prog-05.jpg"],
    status: PublishStatus.published,
    regionId: "sowon",
    targetType: "가족",
    durationType: "1박 2일",
    linkedStayCount: 0,
    linkedExpCount: 0,
    linkedProgCount: 3,
    routeItems: [
      {
        id: "ci-3-1",
        itemType: CourseItemType.local_income_program,
        sortOrder: 1,
        time: "Day 1 오후",
        title: "펜션 마당 키즈 풀장",
        note: "숙소 도착 후 안전한 물놀이",
        slug: "pension-kids-water-yard"
      },
      {
        id: "ci-3-2",
        itemType: CourseItemType.local_income_program,
        sortOrder: 2,
        time: "Day 1 저녁",
        title: "태안 로컬 식재료 팜다이닝",
        note: "건강한 저녁 식사",
        slug: "local-table-experience"
      },
      {
        id: "ci-3-3",
        itemType: CourseItemType.local_income_program,
        sortOrder: 3,
        time: "Day 2 오전",
        title: "활기찬 항구 아침 투어",
        note: "가족 아침 산책",
        slug: "harbor-morning-tour"
      }
    ]
  },
  {
    id: "course-4",
    slug: "sunset-couple-course",
    title: "만리포 노을 감성 커플 코스",
    summary: "해변 카페, 선셋워크, 분위기 있는 식사로 이어지는 데이트 동선",
    images: ["/images/courses/course-04.jpg"],
    status: PublishStatus.published,
    regionId: "sowon",
    targetType: "커플",
    durationType: "반나절",
    linkedStayCount: 1,
    linkedExpCount: 0,
    linkedProgCount: 1,
    routeItems: [
      {
        id: "ci-4-1",
        itemType: CourseItemType.experience,
        sortOrder: 1,
        title: "해변 카페 및 산책",
        note: "만리포 해변의 여유",
      },
      {
        id: "ci-4-2",
        itemType: CourseItemType.experience,
        sortOrder: 2,
        title: "선셋워크",
        note: "노을을 배경으로 인생사진",
      },
      {
        id: "ci-4-3",
        itemType: CourseItemType.accommodation,
        sortOrder: 3,
        title: "소원 낙조 펜션 체크인",
        note: "바다 뷰 숙소에서 휴식",
        slug: "sowon-house-01"
      },
      {
        id: "ci-4-4",
        itemType: CourseItemType.local_income_program,
        sortOrder: 4,
        title: "제철 어촌 밥상",
        note: "주민이 차려주는 맛있는 저녁",
        slug: "village-dining"
      }
    ]
  },
  {
    id: "course-5",
    slug: "fishing-village-half-day",
    title: "어촌 마을 반나절 산책",
    summary: "조용한 항구 마을에서 바다 내음을 느끼는 느린 여행",
    images: ["/images/programs/prog-08.jpg"],
    status: PublishStatus.published,
    regionId: "sowon",
    targetType: "개인/커플",
    durationType: "반나절",
    linkedStayCount: 0,
    linkedExpCount: 0,
    linkedProgCount: 2,
    routeItems: [
      {
        id: "ci-5-1",
        itemType: CourseItemType.local_income_program,
        sortOrder: 1,
        time: "오전 8:00",
        title: "항구 아침 투어",
        note: "해설사와 함께 모항항 걷기",
        slug: "harbor-morning-tour"
      },
      {
        id: "ci-5-2",
        itemType: CourseItemType.local_income_program,
        sortOrder: 2,
        time: "오전 10:00",
        title: "감태 포장 체험",
        note: "특산물 감태 이야기 듣기",
        slug: "gamtae-packing-class"
      },
      {
        id: "ci-5-3",
        itemType: CourseItemType.local_income_program,
        sortOrder: 3,
        time: "낮 12:00",
        title: "로컬 식사",
        note: "자유롭게 지역 맛집 방문",
      }
    ]
  },
  {
    id: "course-6",
    slug: "esg-beach-clean-course",
    title: "의미 있는 하루, ESG 해변 코스",
    summary: "해변 정화 활동과 업사이클링 공예를 결합한 가치 여행",
    images: ["/images/experiences/exp-04.jpg"],
    status: PublishStatus.published,
    regionId: "sowon",
    targetType: "단체/가족",
    durationType: "당일",
    linkedStayCount: 0,
    linkedExpCount: 1,
    linkedProgCount: 0,
    routeItems: [
      {
        id: "ci-6-1",
        itemType: CourseItemType.experience,
        sortOrder: 1,
        title: "해변 집결 및 플로깅",
        note: "만리포 해변 쓰레기 줍기",
      },
      {
        id: "ci-6-2",
        itemType: CourseItemType.experience,
        sortOrder: 2,
        title: "씨글라스 업사이클링",
        note: "주운 유리 조각으로 공예품 만들기",
        slug: "sea-glass-art"
      },
      {
        id: "ci-6-3",
        itemType: CourseItemType.local_income_program,
        sortOrder: 3,
        title: "로컬 간식 시간",
        note: "동네 빵집 방문",
      }
    ]
  },
  {
    id: "course-7",
    slug: "kids-local-experience-course",
    title: "우리아이 로컬 체험 당일치기",
    summary: "아이들이 자연 속에서 뛰놀고 배우는 생태형 코스",
    images: ["/images/programs/prog-04.jpg"],
    status: PublishStatus.published,
    regionId: "sowon",
    targetType: "아이동반",
    durationType: "당일",
    linkedStayCount: 0,
    linkedExpCount: 0,
    linkedProgCount: 1,
    routeItems: [
      {
        id: "ci-7-1",
        itemType: CourseItemType.local_income_program,
        sortOrder: 1,
        title: "소원 바다물길 놀이터",
        note: "자연이 만든 수영장에서 놀기",
        slug: "sowon-sea-water-playground"
      },
      {
        id: "ci-7-2",
        itemType: CourseItemType.local_income_program,
        sortOrder: 2,
        title: "마을 골목길 보물찾기",
        note: "마을 산책하며 사진 찍기",
      }
    ]
  }
];
