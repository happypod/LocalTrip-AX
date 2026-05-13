export const STATIC_TRANSLATIONS = {
  ko: {
    backToList: "숙소 목록",
    address: "주소",
    capacity: "인원",
    price: "가격",
    introduction: "소개",
    contactTitle: "문의 및 연결",
    contactDesc: "이 숙소는 로컬트립 파트너가 직접 운영합니다. 예약 문의나 궁금한 점은 아래 채널로 직접 연락해 주세요.",
    phoneCall: "전화 문의",
    kakaoInquiry: "카카오 문의",
    naverBooking: "네이버 예약",
    websiteVisit: "홈페이지 방문",
    platformInquiry: "플랫폼 통합 문의",
    platformDesc: "숙박 가능 여부와 상세 조건은 문의를 통해 확인해 주세요.",
  },
  en: {
    backToList: "List Stays",
    address: "Address",
    capacity: "Capacity",
    price: "Price",
    introduction: "Description",
    contactTitle: "Inquiry & Connect",
    contactDesc: "This stay is directly operated by a LocalTrip partner. For booking inquiries or questions, please contact them directly via the channels below.",
    phoneCall: "Call Us",
    kakaoInquiry: "Kakao Talk",
    naverBooking: "Naver Booking",
    websiteVisit: "Visit Website",
    platformInquiry: "General Inquiry",
    platformDesc: "Please check availability and detailed conditions by contacting us.",
  },
  "zh-cn": {
    backToList: "民宿列表",
    address: "地址",
    capacity: "入住人数",
    price: "价格",
    introduction: "介绍",
    contactTitle: "咨询与联系",
    contactDesc: "该房源由LocalTrip合作方直接运营。预定咨询或疑问请通过以下方式联系。",
    phoneCall: "电话咨询",
    kakaoInquiry: "Kakao 咨询",
    naverBooking: "Naver 预订",
    websiteVisit: "访问官网",
    platformInquiry: "平台统一咨询",
    platformDesc: "入住可能性及详细条件请通过咨询确认。",
  },
  "ja-jp": {
    backToList: "宿泊一覧",
    address: "住所",
    capacity: "定員",
    price: "料金",
    introduction: "紹介",
    contactTitle: "お問い合わせ＆接続",
    contactDesc: "この宿泊施設は、ローカルトリップのパートナーが直接運営しています。ご質問等は、以下のチャネルへ直接ご連絡ください。",
    phoneCall: "電話でのお問い合わせ",
    kakaoInquiry: "Kakao 相談",
    naverBooking: "Naver 予約",
    websiteVisit: "HPを訪ねる",
    platformInquiry: "プラットフォーム統合問い合わせ",
    platformDesc: "空室状況や詳細条件はお問い合わせからご確認ください。",
  },
};

export type StaticTranslationKey = keyof typeof STATIC_TRANSLATIONS.ko;

export function getStaticLabels(locale: string = "ko") {
  if (locale in STATIC_TRANSLATIONS) {
    return STATIC_TRANSLATIONS[locale as keyof typeof STATIC_TRANSLATIONS];
  }
  return STATIC_TRANSLATIONS.ko;
}
