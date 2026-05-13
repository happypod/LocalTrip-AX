"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faCircleCheck,
  faCompass,
  faHouseChimney,
  faMagnifyingGlass,
  faMobileScreen,
  faTicket,
  faUser,
  faUserGroup,
} from "@/lib/fontawesome";
import { usePersonaThemeStore } from "@/store/persona-theme-store";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface ChatCategory {
  id: string;
  label: string;
  icon: IconDefinition;
  faqs: FAQItem[];
  subTags: string[];
}

interface ChatCategoryTranslation extends Omit<ChatCategory, "icon"> {}

interface CustomerCenterTranslation {
  heroTitle: string;
  heroBadge: string;
  aiTitle: string;
  aiDesc: string;
  btnCheck: string;
  btnLive: string;
  faqTitle: string;
  filterTitle: string;
  actLive: string;
  actLiveDesc: string;
  actPhone: string;
  actPhoneDesc: string;
  actSearch: string;
  actSearchDesc: string;
  actEmerg: string;
  actEmergDesc: string;
  safeTitle: string;
  safeDesc: string;
  safeBtn: string;
  downTitle: string;
  downList1: string;
  downList2: string;
  downList3: string;
  qrTitle: string;
  qrDesc: string;
  chatHead: string;
  chatClose: string;
  chatInputPlace: string;
  chatSend: string;
  botWelcome: string;
  botCancel: string;
  botPhone: string;
  botDefault: string;
  allTag: string;
  categories: ChatCategoryTranslation[];
}

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

// Pre-define UI and FAQ translations
const TRANSLATIONS: Record<string, CustomerCenterTranslation> = {
  ko: {
    heroTitle: "고객센터",
    heroBadge: "30초 내 상담원 자동 연결",
    aiTitle: "실시간 AI 소원 지원",
    aiDesc: "현재 대기 상담사 즉시 배정 가능! 평균 응대 속도 15초 이내 연결을 약속합니다.",
    btnCheck: "예약 내역 조회",
    btnLive: "1:1 실시간 채팅 문의",
    faqTitle: "채팅 서비스 및 자주 묻는 질문",
    filterTitle: "상세 필터:",
    actLive: "1:1 실시간 채팅",
    actLiveDesc: "평균 대기시간 15초",
    actPhone: "전화 유선 문의",
    actPhoneDesc: "국내전용: 1670-6250",
    actSearch: "전체 FAQ 검색",
    actSearchDesc: "자주 묻는 질문 전체",
    actEmerg: "긴급 안심 케어",
    actEmergDesc: "24시간 연중무휴 지원",
    safeTitle: "든든한 소원트립 서비스와 함께하는 안심 여행",
    safeDesc: "예상치 못한 천재지변이나 기상 이변이 발생하는 경우에도, 강력한 보장 범위가 적용되는 소원케어를 통해 안심 예약이 지원됩니다.",
    safeBtn: "보장 제도 자세히 보기",
    downTitle: "소원트립 앱 다운로드 후,\n신속한 맞춤형 케어 서비스를 받아보세요!",
    downList1: "클릭 단 한 번으로 상담원 실시간 일대일 연동",
    downList2: "기상 악화 시 바우처 실시간 확인 및 원클릭 대리 취소",
    downList3: "인터넷 연결망을 통한 앱 내 전면 무료 보이스 통화 지원",
    qrTitle: "QR코드 자동 스캔",
    qrDesc: "스마트폰 기본 카메라로 비추면 다운로드 링크로 연결됩니다.",
    chatHead: "소원트립 1:1 라이브케어",
    chatClose: "닫기",
    chatInputPlace: "질문 내용을 입력해 주세요...",
    chatSend: "전송",
    botWelcome: "안녕하세요! 소원트립 AI 도우미입니다. 무엇을 도와드릴까요?",
    botCancel: "예약 취소의 경우, 예약 정보의 '무료 취소 기한' 이내이시라면 '마이페이지 > 예약'에서 클릭 한번으로 간편하게 환불 처리가 이루어집니다.",
    botPhone: "전화 상담 연결을 희망하시는군요! 소원트립 유선 상담은 1670-6250 번호로 연중무휴 오전 9시부터 오후 6시까지 신속히 대응 중입니다.",
    botDefault: "문의주신 사항은 전문 상담가에게 신속히 전달 중입니다. '마이페이지'에서 예약 상세 내역을 조회하시면 빠른 해결이 가능합니다.",
    allTag: "전체",
    categories: [
      {
        id: "stay",
        label: "숙소 (Stay)",
        subTags: ["전체", "예약 & 취소", "결제 & 영수증", "체크인", "특별 요청"],
        faqs: [
          {
            id: "stay-1",
            question: "예약한 숙소를 무료로 취소할 수 있나요?",
            answer: "숙소마다 취소 규정이 상이합니다. 예약 정보 및 상세 페이지에서 '무료 취소 기한'을 확인해 주세요. 기한 내 취소 시 100% 환불 처리됩니다.",
          },
          {
            id: "stay-2",
            question: "현지 결제와 선결제의 차이점은 무엇인가요?",
            answer: "선결제는 소원트립 웹/앱에서 예약 시 즉시 완불하는 방식이며, 현지 결제는 예약 완료 후 실제 투숙하시는 당일에 프런트에서 결제하는 방식입니다.",
          },
          {
            id: "stay-3",
            question: "늦은 시간(체크인 22:00 이후)에 입실이 가능한가요?",
            answer: "네, 대다수의 숙소는 사전 연락 시 늦은 체크인을 지원합니다. 입실 예정 시간 및 특별 요청란에 해당 내용을 적어주시거나, 숙소 프런트로 연락 주시면 안전하게 체크인 조율을 도와드립니다.",
          },
          {
            id: "stay-4",
            question: "체크인 전에 짐 보관이 가능한가요?",
            answer: "네, 소원트립의 파트너 숙소 대부분은 투숙 전후 당일에 한해 무료 수하물 보관 서비스를 제공하고 있습니다.",
          },
        ],
      },
      {
        id: "experience",
        label: "체험 (Experience)",
        subTags: ["전체", "일정 변경", "기상 악화", "준비물", "어린이 동반"],
        faqs: [
          {
            id: "exp-1",
            question: "기상 악화(우천, 강풍 등) 시 체험은 취소되나요?",
            answer: "안전을 위협하는 수준의 기상 악화 시 호스트에 의해 체험이 자동 취소될 수 있습니다. 이 경우 100% 전액 환불되며 사전 등록된 연락처로 긴급 안내가 발송됩니다.",
          },
          {
            id: "exp-2",
            question: "예약한 투어 일정을 변경할 수 있나요?",
            answer: "체험 개시 3일 전까지는 고객센터 혹은 '마이페이지 > 예약 내역'을 통해 빈자리가 있는 일자로 일정 변경 신청이 가능합니다.",
          },
          {
            id: "exp-3",
            question: "체험 당일 준비물은 어디서 확인하나요?",
            answer: "예약 확정 시 발송된 모바일 바우처 내 '호스트 전달사항' 및 '준비물' 란에서 세부 장비 및 복장 가이드를 확인하실 수 있습니다.",
          },
          {
            id: "exp-4",
            question: "단체 및 기업 투어 문의는 어떻게 하나요?",
            answer: "10인 이상의 단체 맞춤 투어 상담은 긴급상황 지원 번호나 아래 전화 문의를 통해 기업 전용 요금 혜택과 함께 상세 안내를 받아보실 수 있습니다.",
          },
        ],
      },
      {
        id: "program",
        label: "주민소득상품 (Program)",
        subTags: ["전체", "배송 안내", "반품/교환", "수령지 변경", "유통기한"],
        faqs: [
          {
            id: "prog-1",
            question: "주민소득 특산물의 배송 기간은 얼마나 걸리나요?",
            answer: "소원면 특산물은 당일 수확/제조 후 즉시 산지 직송 배송됩니다. 영업일 기준 보통 1~2일 이내에 신선한 상태로 받아보실 수 있습니다.",
          },
          {
            id: "prog-2",
            question: "신선 신선 식품의 경우 반품이나 교환이 가능한가요?",
            answer: "수령 직후 신선 상태 결함이나 수량 오류가 확인될 경우 사진과 함께 고객센터로 즉시 인입해 주시면 당일 재배송 또는 전액 환불 처리를 원칙으로 삼고 있습니다.",
          },
          {
            id: "prog-3",
            question: "여러 종류의 특산품을 장바구니에 담아 묶음 배송할 수 있나요?",
            answer: "생산 농가나 제조업체가 다를 경우 개별 배송 처리될 수 있습니다. 상품 설명 페이지의 배송처가 동일한 경우에는 자동으로 묶음 배송 혜택이 적용됩니다.",
          },
        ],
      },
    ],
  },
  en: {
    heroTitle: "Support Center",
    heroBadge: "Auto-connect to agent within 30s",
    aiTitle: "Real-time AI Support",
    aiDesc: "Available agents assigned instantly! Guaranteed connection under 15s on average.",
    btnCheck: "Check Reservation",
    btnLive: "1:1 Live Chat Inquiry",
    faqTitle: "Chat Services & FAQ",
    filterTitle: "Filter Details:",
    actLive: "1:1 Live Chat",
    actLiveDesc: "Avg wait time 15s",
    actPhone: "Phone Call Support",
    actPhoneDesc: "For Domestic: 1670-6250",
    actSearch: "Search All FAQs",
    actSearchDesc: "All Questions list",
    actEmerg: "Emergency Care",
    actEmergDesc: "24/7 Year-round Support",
    safeTitle: "Safe Travel with Reliable Sowon Trip Service",
    safeDesc: "Even in unexpected natural disasters or weather anomalies, safe booking is supported through robust SowonCare coverage.",
    safeBtn: "Learn More About Coverage",
    downTitle: "Download Sowon Trip App for\nfaster customized care!",
    downList1: "One-click direct link with live agent",
    downList2: "Real-time voucher view and easy cancel during bad weather",
    downList3: "Free in-app voice calls over internet",
    qrTitle: "Auto QR Scan",
    qrDesc: "Scan with your smartphone default camera to open download link.",
    chatHead: "Sowon Trip 1:1 Live Care",
    chatClose: "Close",
    chatInputPlace: "Type your question here...",
    chatSend: "Send",
    botWelcome: "Hello! I am your Sowon Trip AI assistant. How can I help you?",
    botCancel: "For cancellation, if it is within 'Free cancellation period', refund is easily processed in 'My Page > Bookings'.",
    botPhone: "Looking for call support? Our hotline 1670-6250 is available daily from 9 AM to 6 PM.",
    botDefault: "Your query is being forwarded to a specialist. You can also check 'My Page' for quick answers.",
    allTag: "All",
    categories: [
      {
        id: "stay",
        label: "Stays",
        subTags: ["All", "Booking & Cancel", "Payment", "Check-in", "Requests"],
        faqs: [
          {
            id: "stay-1",
            question: "Can I cancel my booked stay for free?",
            answer: "Policies vary by stay. Check 'Free Cancellation Deadline' on the details page. Full refund is processed if cancelled in time.",
          },
          {
            id: "stay-2",
            question: "What is the difference between pay-on-site and pre-payment?",
            answer: "Pre-payment is paid fully instantly online, while pay-on-site means you pay directly at the desk on your check-in day.",
          },
          {
            id: "stay-3",
            question: "Is late check-in (after 22:00) possible?",
            answer: "Yes, most partners support late check-in if notified. Please specify in special requests or call the desk to arrange safely.",
          },
          {
            id: "stay-4",
            question: "Can I store my luggage before check-in?",
            answer: "Yes, most partners provide free luggage storage on the day of check-in and check-out.",
          },
        ],
      },
      {
        id: "experience",
        label: "Experiences",
        subTags: ["All", "Schedule Change", "Bad Weather", "Preparations", "Kids"],
        faqs: [
          {
            id: "exp-1",
            question: "Are experiences cancelled in case of bad weather?",
            answer: "In dangerous weather (heavy rain, wind), hosts may cancel. 100% refund is processed, and notices will be sent to you.",
          },
          {
            id: "exp-2",
            question: "Can I change my booked tour schedule?",
            answer: "Up to 3 days before start, you can request changes via 'My Page > Bookings' if available dates exist.",
          },
          {
            id: "exp-3",
            question: "Where can I check preparations for the day?",
            answer: "Please check the 'Host Details' and 'Preparations' section on your mobile voucher after booking confirmation.",
          },
          {
            id: "exp-4",
            question: "How can I inquire about group/corporate tours?",
            answer: "For groups of 10+, please contact us via emergency lines or call us to get corporate benefits and support.",
          },
        ],
      },
      {
        id: "program",
        label: "Local Programs",
        subTags: ["All", "Delivery", "Returns", "Address Change", "Shelf Life"],
        faqs: [
          {
            id: "prog-1",
            question: "How long does local specialty delivery take?",
            answer: "Local specialties are harvested/made and shipped directly. Takes usually 1-2 business days in fresh condition.",
          },
          {
            id: "prog-2",
            question: "Can fresh foods be returned or exchanged?",
            answer: "If there is quality issue or count error, contact support with photos for immediate reshipping or full refund.",
          },
          {
            id: "prog-3",
            question: "Can I combine shipping for various items in my cart?",
            answer: "If producers vary, items are shipped separately. If from the same farm, bundling is automatically applied.",
          },
        ],
      },
    ],
  },
  "zh-cn": {
    heroTitle: "客服中心",
    heroBadge: "30秒内自动连接人工客服",
    aiTitle: "实时 AI 智能助手",
    aiDesc: "当前在线客服可立即分配响应！承诺平均响应时间不超过 15 秒。",
    btnCheck: "查询预订记录",
    btnLive: "1:1 实时在线咨询",
    faqTitle: "在线客服与常见问题",
    filterTitle: "详细筛选:",
    actLive: "1:1 实时在线客服",
    actLiveDesc: "平均等待 15 秒",
    actPhone: "电话热线咨询",
    actPhoneDesc: "境内专线：1670-6250",
    actSearch: "搜索全部常见问题",
    actSearchDesc: "全部常见问题列表",
    actEmerg: "紧急安心保障",
    actEmergDesc: "24小时全年无休",
    safeTitle: "携手 Sowon Trip 开启无忧之旅",
    safeDesc: "即便遭遇突发天灾或极端天气，SowonCare 的强力保障也能守护您的预订权益，助您安享旅程。",
    safeBtn: "查看保障制度详情",
    downTitle: "下载 Sowon Trip APP，\n体验更快捷的专属客服服务！",
    downList1: "一键直连专属在线人工客服",
    downList2: "极端天气时实时查询凭证并支持一键取消",
    downList3: "支持基于互联网的应用内全免费语音通话",
    qrTitle: "自动扫描二维码",
    qrDesc: "使用智能手机系统相机对准扫描即可跳转至下载链接。",
    chatHead: "Sowon Trip 1:1 实时专线",
    chatClose: "关闭",
    chatInputPlace: "请输入您的问题...",
    chatSend: "发送",
    botWelcome: "您好！我是 Sowon Trip AI 智能助手，请问有什么可以帮您？",
    botCancel: "关于预订取消，若在“免费取消期限”内，可在“我的页面 > 预订”中一键自助申请退款。",
    botPhone: "想进行电话咨询？Sowon Trip 热线 1670-6250 提供全年无休（9:00-18:00）的极速响应。",
    botDefault: "您咨询的内容正在快速转交给资深顾问。您也可以在“我的页面”查看预订详情以便更快解决。",
    allTag: "全部",
    categories: [
      {
        id: "stay",
        label: "住宿 (Stay)",
        subTags: ["全部", "预订与取消", "支付与收据", "入住办理", "特殊需求"],
        faqs: [
          {
            id: "stay-1",
            question: "可以免费取消已预订的住宿吗？",
            answer: "各住宿设施的取消政策有所不同。请在预订信息和详情页中确认“免费取消期限”。期限内取消可获100%退款。",
          },
          {
            id: "stay-2",
            question: "到店支付与在线预付有什么区别？",
            answer: "在线预付是在APP上预订时立即结清；到店支付则是预订完成后，在入住当天于前台进行支付。",
          },
          {
            id: "stay-3",
            question: "可以办理晚间入住（22:00之后）吗？",
            answer: "可以。绝大多数住宿在事先通知的情况下支持晚间入库。请在预订备注或直接致电前台进行沟通。",
          },
          {
            id: "stay-4",
            question: "办理入住前可以寄存行李吗？",
            answer: "是的，Sowon Trip 绝大多数合作住宿设施均在入住/退房当天提供免费行李寄放服务。",
          },
        ],
      },
      {
        id: "experience",
        label: "体验 (Experience)",
        subTags: ["全部", "行程变更", "极端天气", "准备清单", "儿童同行"],
        faqs: [
          {
            id: "exp-1",
            question: "如果天气恶劣（暴雨、大风等），体验会取消吗？",
            answer: "若天气恶劣至危及人身安全，主办方将自动取消体验。此时您可获全额退款，并会向预留手机发送紧急通知。",
          },
          {
            id: "exp-2",
            question: "可以更改已预约的体验行程吗？",
            answer: "在体验开始前 3 天之前，若所选日期尚有空位，可通过“我的页面 > 预订列表”申请更改日期。",
          },
          {
            id: "exp-3",
            question: "去哪里查看体验当天的准备物品？",
            answer: "预订成功后，在移动端凭证的“主办方提示”和“准备清单”一栏中可查询具体的装备和着装规范。",
          },
          {
            id: "exp-4",
            question: "如何咨询团队及企业预订？",
            answer: "10人及以上的团队定制咨询，可拨打客服热线咨询并获取企业专项优惠包。",
          },
        ],
      },
      {
        id: "program",
        label: "社区特产 (Program)",
        subTags: ["全部", "配送指南", "退换货", "修改地址", "保质期"],
        faqs: [
          {
            id: "prog-1",
            question: "社区特产的配送通常需要多久？",
            answer: "所愿面特产皆为当天采收或制作后由原产地直邮。工作日通常在 1-2 天内以新鲜状态送达。",
          },
          {
            id: "prog-2",
            question: "新鲜食品可以退换货吗？",
            answer: "收到货品后若确认有保鲜缺陷或数量有误，拍照后即刻联系客服，我们承诺当天补发或全额退款。",
          },
          {
            id: "prog-3",
            question: "购物车内的多款特产可以合并配送吗？",
            answer: "由于不同产品的生产农户可能不同，可能会分包发货。若来源于同一农户，系统将自动合并发货。",
          },
        ],
      },
    ],
  },
  "ja-jp": {
    heroTitle: "カスタマーセンター",
    heroBadge: "30秒以内にオペレーターに自動接続",
    aiTitle: "リアルタイム AI サポート",
    aiDesc: "現在待機中の担当者が即時配属可能！平均応答速度15秒以内の接続をお約束します。",
    btnCheck: "予約履歴の照会",
    btnLive: "1:1 リアルタイムチャット問い合わせ",
    faqTitle: "チャットサービスおよびよくある質問",
    filterTitle: "詳細フィルター:",
    actLive: "1:1 リアルタイムチャット",
    actLiveDesc: "平均待ち時間15秒",
    actPhone: "電話によるお問い合わせ",
    actPhoneDesc: "国内専用：1670-6250",
    actSearch: "全てのFAQを検索",
    actSearchDesc: "よくある質問の一覧",
    actEmerg: "緊急安心ケア",
    actEmergDesc: "24時間年中無休対応",
    safeTitle: "頼もしいソウォントリップと共にする安心旅行",
    safeDesc: "予期せぬ天災や気象異変が発生した場合でも、強力な補償範囲が適用されるソウォンケアを通じて安心な予約がサポートされます。",
    safeBtn: "補償制度を詳しく見る",
    downTitle: "アプリをダウンロードして、\n迅速なカスタムケアサービスをご利用ください！",
    downList1: "クリック一回でオペレーターとリアルタイム連携",
    downList2: "気象悪化時のバウチャーリアルタイム確認および代理キャンセル",
    downList3: "アプリ内での完全無料音声通話に対応",
    qrTitle: "QRコード自動スキャン",
    qrDesc: "スマートフォンの標準カメラでかざすとダウンロードリンクに繋がります。",
    chatHead: "ソウォントリップ 1:1 ライブケア",
    chatClose: "閉じる",
    chatInputPlace: "質問内容を入力してください...",
    chatSend: "送信",
    botWelcome: "こんにちは！ソウォントリップAIアシスタントです。何かお困りですか？",
    botCancel: "予約キャンセルの場合、予約情報の「無料キャンセル期限」以内であれば、「マイページ > 予約」からワンクリックで簡単に払い戻し処理が行われます。",
    botPhone: "電話相談をご希望ですね！ソウォントリップの電話相談は 1670-6250 番号にて年中無休、午前9時から午後6時まで迅速に対応中です。",
    botDefault: "お問い合わせいただいた内容は専門スタッフに迅速に転送中です。「マイページ」にて予約詳細をご確認ください。",
    allTag: "全て",
    categories: [
      {
        id: "stay",
        label: "宿泊 (Stay)",
        subTags: ["全て", "予約＆キャンセル", "決済＆領収書", "チェックイン", "特別リクエスト"],
        faqs: [
          {
            id: "stay-1",
            question: "予約した宿泊施設を無料でキャンセルできますか？",
            answer: "宿泊施設ごとにポリシーが異なります。予約詳細ページの「無料キャンセル期限」をご確認ください。期限内の場合100%払い戻しされます。",
          },
          {
            id: "stay-2",
            question: "現地決済とオンライン事前決済の違いは何ですか？",
            answer: "事前決済はWEB/アプリ上で即時支払い、現地決済は予約完了後、宿泊当日にフロントでお支払いいただく方法です。",
          },
          {
            id: "stay-3",
            question: "遅い時間（22:00以降）のチェックインは可能ですか？",
            answer: "はい、事前連絡をいただければ殆どの施設が対応可能です。ご要望欄に記載いただくかフロントへご連絡ください。",
          },
          {
            id: "stay-4",
            question: "チェックイン前に荷物を預けることは可能ですか？",
            answer: "はい、ソウォントリップの提携先施設の多くは、チェックイン・アウト当日の無料手荷物預かりを提供しています。",
          },
        ],
      },
      {
        id: "experience",
        label: "体験 (Experience)",
        subTags: ["全て", "日程変更", "気象悪化", "準備物", "子供同伴"],
        faqs: [
          {
            id: "exp-1",
            question: "悪天候（雨、強風など）の場合、体験はキャンセルされますか？",
            answer: "安全を脅かすレベルの悪天候時は、主催者の判断で自動キャンセルされます。全額払い戻され、登録連絡先に通知されます。",
          },
          {
            id: "exp-2",
            question: "予約したツアースケジュールを変更できますか？",
            answer: "体験開始3日前までであれば、空きのある日程への変更申請が「マイページ > 予約一覧」から可能です。",
          },
          {
            id: "exp-3",
            question: "体験当日の準備物はどこで確認できますか？",
            answer: "予約確定時に送信されたモバイルバウチャーの「注意事項」や「準備物」欄で詳細をご確認いただけます。",
          },
          {
            id: "exp-4",
            question: "団体や企業ツアーの問い合わせはどのように行いますか？",
            answer: "10名以上の団体向けカスタムツアー相談は、緊急ダイヤルまたはお電話から企業特典を含めたご案内をいたします。",
          },
        ],
      },
      {
        id: "program",
        label: "地域特産品 (Program)",
        subTags: ["全て", "配送案内", "返品/交換", "住所変更", "賞味期限"],
        faqs: [
          {
            id: "prog-1",
            question: "特産品の配送期間はどのくらいかかりますか？",
            answer: "特産品は収穫・製造後に産地より直送されます。営業日基準で通常1〜2日以内に新鮮な状態でお届けします。",
          },
          {
            id: "prog-2",
            question: "生鮮食品の返品や交換は可能ですか？",
            answer: "品質に問題がある場合や数量の誤りがある場合は、写真を添えてご連絡いただければ、即日の再配送または全額返金をいたします。",
          },
          {
            id: "prog-3",
            question: "複数の特産品をまとめて配送することはできますか？",
            answer: "生産農家が異なる場合は別配送となることがあります。同じ生産農家であれば自動的にまとめて配送されます。",
          },
        ],
      },
    ],
  },
};

export default function CustomerCenterPage() {
  const currentLang = usePersonaThemeStore((state) => state.currentLang);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.ko;

  const [activeCategory, setActiveCategory] = useState<string>("stay");
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null);
  const [activeSubTag, setActiveSubTag] = useState<string>("all");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    { sender: "bot", text: t.botWelcome },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);

  // Reset and set welcome message whenever language changes
  useEffect(() => {
    const resetId = window.setTimeout(() => {
      setChatMessages([{ sender: "bot", text: t.botWelcome }]);
    }, 0);

    return () => window.clearTimeout(resetId);
  }, [currentLang, t.botWelcome]);

  // Map static icon metadata to the localized categories list
  const categoryIcons: Record<string, IconDefinition> = {
    stay: faHouseChimney,
    experience: faCompass,
    program: faUser,
  };

  const mappedCategories: ChatCategory[] = t.categories.map((cat) => ({
    ...cat,
    icon: categoryIcons[cat.id] || faHouseChimney,
  }));

  const currentCategoryObj = mappedCategories.find((c) => c.id === activeCategory) || mappedCategories[0];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    // Multi-lingual aware support simulation
    setTimeout(() => {
      let botResponse = t.botDefault;
      const lowerMsg = userMsg.toLowerCase();
      
      const isCancel = lowerMsg.includes("취소") || lowerMsg.includes("cancel") || lowerMsg.includes("取消") || lowerMsg.includes("キャンセル");
      const isPhone = lowerMsg.includes("전화") || lowerMsg.includes("phone") || lowerMsg.includes("call") || lowerMsg.includes("电话") || lowerMsg.includes("電話");

      if (isCancel) {
        botResponse = t.botCancel;
      } else if (isPhone) {
        botResponse = t.botPhone;
      }

      setChatMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#f1f6fa] text-[#161d1f] pb-24">
      {/* Hero Banner Section with vibrant gradient theme */}
      <section className="bg-gradient-to-r from-[#0d5955] via-[#057771] to-[#009b94] text-white py-12 md:py-16 relative overflow-hidden">
        {/* Dynamic speech bubble vector style decoration */}
        <div className="absolute right-10 bottom-0 top-0 hidden lg:flex items-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 max-w-sm shadow-xl flex gap-4 items-center">
            <div className="h-12 w-12 rounded-full bg-teal-500 flex items-center justify-center text-xl shadow-inner shrink-0">
              👩‍💻
            </div>
            <div>
              <h4 className="text-sm font-black">{t.aiTitle}</h4>
              <p className="text-xs text-teal-100 mt-1 font-medium leading-relaxed">
                {t.aiDesc}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-5 relative z-10">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-md">
              {t.heroTitle}<span className="text-yellow-300 ml-1">.</span>
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs md:text-sm font-black text-yellow-300 animate-pulse shadow-sm">
              <span className="h-2 w-2 rounded-full bg-yellow-300" />
              <span>{t.heroBadge}</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/map"
                className="px-5 py-2.5 rounded-full bg-white text-[#057771] hover:bg-teal-50 transition text-xs font-black shadow-md border border-white"
              >
                {t.btnCheck}
              </Link>
              <button
                onClick={() => setIsLiveChatOpen(true)}
                className="px-5 py-2.5 rounded-full bg-[#ae2f34] hover:bg-[#91252a] text-white transition text-xs font-black shadow-md border border-transparent"
              >
                {t.btnLive}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-5 mt-10 space-y-8">
        
        {/* Chatting Service & FAQ Container */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
            <h2 className="text-xl font-black text-gray-900">{t.faqTitle}</h2>
          </div>

          {/* Interactive Category Icons Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 border-b border-gray-100/60 scrollbar-none">
            {mappedCategories.map((category) => {
              const isSelected = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setSelectedFAQ(null);
                  }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 ${
                    isSelected
                      ? "bg-[#057771] text-white shadow-md shadow-teal-700/10"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200/50"
                  }`}
                >
                  <FontAwesomeIcon icon={category.icon} className="h-4 w-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>

          {/* FAQ Item Accordion Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCategoryObj.faqs.map((faq) => {
              const isOpened = selectedFAQ?.id === faq.id;
              return (
                <div
                  key={faq.id}
                  onClick={() => setSelectedFAQ(isOpened ? null : faq)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isOpened
                      ? "border-[#057771] bg-teal-50/20 shadow-sm"
                      : "border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm font-extrabold text-gray-800 leading-snug">
                      {faq.question}
                    </span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className={`h-3.5 w-3.5 text-gray-400 mt-1 shrink-0 transition-transform ${
                        isOpened ? "rotate-90 text-[#057771]" : ""
                      }`}
                    />
                  </div>
                  {isOpened && (
                    <p className="mt-4 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed border-t border-teal-100/30 pt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* FAQ Sub categories tags filtering (Trip.com style details row) */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-2 items-center text-xs">
            <span className="font-extrabold text-gray-400 mr-2">{t.filterTitle}</span>
            {currentCategoryObj.subTags.map((tag, i) => {
              const isSelected = activeSubTag === (i === 0 ? "all" : tag);
              return (
                <button
                  key={i}
                  onClick={() => setActiveSubTag(i === 0 ? "all" : tag)}
                  className={`px-3 py-1.5 rounded-full font-bold transition ${
                    isSelected
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </section>

        {/* 4 Multi-Way Contact Actions Buttons */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setIsLiveChatOpen(true)}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 text-center gap-2 group"
          >
            <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-100 transition">
              <FontAwesomeIcon icon={faUserGroup} className="h-5 w-5" />
            </div>
            <span className="text-xs font-black text-gray-900 mt-1">{t.actLive}</span>
            <span className="text-[10px] text-gray-400 font-medium">{t.actLiveDesc}</span>
          </button>

          <a
            href="tel:16706250"
            className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 text-center gap-2 group"
          >
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition">
              <FontAwesomeIcon icon={faMobileScreen} className="h-5 w-5" />
            </div>
            <span className="text-xs font-black text-gray-900 mt-1">{t.actPhone}</span>
            <span className="text-[10px] text-gray-400 font-medium">{t.actPhoneDesc}</span>
          </a>

          <button
            onClick={() => {
              setActiveCategory("stay");
              window.scrollTo({ top: 400, behavior: "smooth" });
            }}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 text-center gap-2 group"
          >
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="h-5 w-5" />
            </div>
            <span className="text-xs font-black text-gray-900 mt-1">{t.actSearch}</span>
            <span className="text-[10px] text-gray-400 font-medium">{t.actSearchDesc}</span>
          </button>

          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 text-center gap-2 group cursor-pointer">
            <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-[#ae2f34] group-hover:bg-red-100 transition">
              <FontAwesomeIcon icon={faCircleCheck} className="h-5 w-5" />
            </div>
            <span className="text-xs font-black text-gray-900 mt-1">{t.actEmerg}</span>
            <span className="text-[10px] text-gray-400 font-medium">{t.actEmergDesc}</span>
          </div>
        </section>

        {/* Brand Guarantee Banner (안심 여행) */}
        <section className="bg-gradient-to-r from-[#eef9f9] to-[#e4f5f5] rounded-3xl p-6 border border-teal-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-full bg-[#057771] flex items-center justify-center text-white shrink-0 shadow-sm">
              <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900">{t.safeTitle}</h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5 leading-relaxed">
                {t.safeDesc}
              </p>
            </div>
          </div>
          <button className="text-xs font-black text-[#057771] bg-white px-4 py-2 rounded-xl border border-teal-100 hover:bg-teal-50/50 transition shadow-sm shrink-0">
            {t.safeBtn}
          </button>
        </section>

        {/* App Download with QR Code Simulator Section */}
        <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-snug whitespace-pre-line">
              {t.downTitle}
            </h2>
            <ul className="space-y-2 text-xs md:text-sm font-bold text-gray-600 flex flex-col items-center md:items-start">
              <li className="flex items-center gap-2">
                <span className="text-teal-600">✓</span> {t.downList1}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-600">✓</span> {t.downList2}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-600">✓</span> {t.downList3}
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 shrink-0 w-full sm:w-auto justify-center">
            <div className="h-20 w-20 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-[#057771] shadow-inner text-4xl">
              <FontAwesomeIcon icon={faTicket} className="h-12 w-12 text-[#057771]" />
            </div>
            <div className="text-left space-y-1">
              <span className="text-[10px] uppercase font-black text-[#057771] tracking-wider block bg-teal-50 px-2 py-0.5 rounded-md inline-block">APP DOWNLOAD</span>
              <h4 className="text-xs font-black text-gray-900">{t.qrTitle}</h4>
              <p className="text-[10px] text-gray-400 font-semibold">{t.qrDesc}</p>
            </div>
          </div>
        </section>
      </div>

      {/* Floating 1:1 Live Chat Simulator Drawer Modal */}
      {isLiveChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-[360px] h-[480px] bg-white rounded-3xl shadow-2xl border border-gray-100/90 overflow-hidden flex flex-col animate-in slide-in-from-bottom-12 duration-300">
          {/* Header */}
          <div className="bg-[#057771] text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
              <h3 className="text-sm font-black">{t.chatHead}</h3>
            </div>
            <button
              onClick={() => setIsLiveChatOpen(false)}
              className="text-teal-100 hover:text-white font-extrabold text-sm"
            >
              {t.chatClose}
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {chatMessages.map((msg, i) => {
              const isBot = msg.sender === "bot";
              return (
                <div key={i} className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs font-bold leading-relaxed shadow-sm ${
                      isBot
                        ? "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                        : "bg-[#057771] text-white rounded-tr-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={t.chatInputPlace}
              className="flex-1 bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-teal-200 focus:bg-white transition"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-[#057771] text-white rounded-xl text-xs font-black hover:bg-[#04615c] transition shrink-0"
            >
              {t.chatSend}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
