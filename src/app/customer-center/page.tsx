"use client";

import { useState } from "react";
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

export default function CustomerCenterPage() {
  const [activeCategory, setActiveCategory] = useState<string>("stay");
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null);
  const [activeSubTag, setActiveSubTag] = useState<string>("all");
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "안녕하세요! 소원트립 AI 도우미입니다. 무엇을 도와드릴까요?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);

  const categories: ChatCategory[] = [
    {
      id: "stay",
      label: "숙소 (Stay)",
      icon: faHouseChimney,
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
      icon: faCompass,
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
      icon: faUser,
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
  ];

  const currentCategoryObj = categories.find((c) => c.id === activeCategory) || categories[0];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    // Simulate smart support responses
    setTimeout(() => {
      let botResponse = "문의주신 사항은 전문 상담가에게 신속히 전달 중입니다. '마이페이지'에서 예약 상세 내역을 조회하시면 빠른 해결이 가능합니다.";
      if (userMsg.includes("취소")) {
        botResponse = "예약 취소의 경우, 예약 정보의 '무료 취소 기한' 이내이시라면 '마이페이지 > 예약'에서 클릭 한번으로 간편하게 환불 처리가 이루어집니다.";
      } else if (userMsg.includes("전화")) {
        botResponse = "전화 상담 연결을 희망하시는군요! 소원트립 유선 상담은 1670-6250 번호로 연중무휴 오전 9시부터 오후 6시까지 신속히 대응 중입니다.";
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
              <h4 className="text-sm font-black">실시간 AI 소원 지원</h4>
              <p className="text-xs text-teal-100 mt-1 font-medium leading-relaxed">
                현재 대기 상담사 즉시 배정 가능! 평균 응대 속도 15초 이내 연결을 약속합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-5 relative z-10">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-md">
              고객센터<span className="text-yellow-300 ml-1">.</span>
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs md:text-sm font-black text-yellow-300 animate-pulse shadow-sm">
              <span className="h-2 w-2 rounded-full bg-yellow-300" />
              <span>30초 내 상담원 자동 연결</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/map"
                className="px-5 py-2.5 rounded-full bg-white text-[#057771] hover:bg-teal-50 transition text-xs font-black shadow-md border border-white"
              >
                예약 내역 조회
              </Link>
              <button
                onClick={() => setIsLiveChatOpen(true)}
                className="px-5 py-2.5 rounded-full bg-[#ae2f34] hover:bg-[#91252a] text-white transition text-xs font-black shadow-md border border-transparent"
              >
                1:1 실시간 채팅 문의
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
            <h2 className="text-xl font-black text-gray-900">채팅 서비스 및 자주 묻는 질문</h2>
          </div>

          {/* Interactive Category Icons Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 border-b border-gray-100/60 scrollbar-none">
            {categories.map((category) => {
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
            <span className="font-extrabold text-gray-400 mr-2">상세 필터:</span>
            {currentCategoryObj.subTags.map((tag, i) => {
              const isSelected = activeSubTag === tag;
              return (
                <button
                  key={i}
                  onClick={() => setActiveSubTag(tag)}
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
            <span className="text-xs font-black text-gray-900 mt-1">1:1 실시간 채팅</span>
            <span className="text-[10px] text-gray-400 font-medium">평균 대기시간 15초</span>
          </button>

          <a
            href="tel:16706250"
            className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 text-center gap-2 group"
          >
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition">
              <FontAwesomeIcon icon={faMobileScreen} className="h-5 w-5" />
            </div>
            <span className="text-xs font-black text-gray-900 mt-1">전화 유선 문의</span>
            <span className="text-[10px] text-gray-400 font-medium">국내전용: 1670-6250</span>
          </a>

          <button
            onClick={() => setActiveCategory("stay")}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 text-center gap-2 group"
          >
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="h-5 w-5" />
            </div>
            <span className="text-xs font-black text-gray-900 mt-1">전체 FAQ 검색</span>
            <span className="text-[10px] text-gray-400 font-medium">자주 묻는 질문 전체</span>
          </button>

          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 text-center gap-2 group cursor-pointer">
            <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-[#ae2f34] group-hover:bg-red-100 transition">
              <FontAwesomeIcon icon={faCircleCheck} className="h-5 w-5" />
            </div>
            <span className="text-xs font-black text-gray-900 mt-1">긴급 안심 케어</span>
            <span className="text-[10px] text-gray-400 font-medium">24시간 연중무휴 지원</span>
          </div>
        </section>

        {/* Brand Guarantee Banner (안심 여행) */}
        <section className="bg-gradient-to-r from-[#eef9f9] to-[#e4f5f5] rounded-3xl p-6 border border-teal-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-full bg-[#057771] flex items-center justify-center text-white shrink-0 shadow-sm">
              <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900">든든한 소원트립 서비스와 함께하는 안심 여행</h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5 leading-relaxed">
                예상치 못한 천재지변이나 기상 이변이 발생하는 경우에도, 강력한 보장 범위가 적용되는 소원케어를 통해 안심 예약이 지원됩니다.
              </p>
            </div>
          </div>
          <button className="text-xs font-black text-[#057771] bg-white px-4 py-2 rounded-xl border border-teal-100 hover:bg-teal-50/50 transition shadow-sm shrink-0">
            보장 제도 자세히 보기
          </button>
        </section>

        {/* App Download with QR Code Simulator Section */}
        <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-snug">
              소원트립 앱 다운로드 후,<br className="hidden md:block" /> 신속한 맞춤형 케어 서비스를 받아보세요!
            </h2>
            <ul className="space-y-2 text-xs md:text-sm font-bold text-gray-600 flex flex-col items-center md:items-start">
              <li className="flex items-center gap-2">
                <span className="text-teal-600">✓</span> 클릭 단 한 번으로 상담원 실시간 일대일 연동
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-600">✓</span> 기상 악화 시 바우처 실시간 확인 및 원클릭 대리 취소
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-600">✓</span> 인터넷 연결망을 통한 앱 내 전면 무료 보이스 통화 지원
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 shrink-0 w-full sm:w-auto justify-center">
            <div className="h-20 w-20 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-[#057771] shadow-inner text-4xl">
              <FontAwesomeIcon icon={faTicket} className="h-12 w-12 text-[#057771]" />
            </div>
            <div className="text-left space-y-1">
              <span className="text-[10px] uppercase font-black text-[#057771] tracking-wider block bg-teal-50 px-2 py-0.5 rounded-md inline-block">APP DOWNLOAD</span>
              <h4 className="text-xs font-black text-gray-900">QR코드 자동 스캔</h4>
              <p className="text-[10px] text-gray-400 font-semibold">스마트폰 기본 카메라로 비추면 다운로드 링크로 연결됩니다.</p>
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
              <h3 className="text-sm font-black">소원트립 1:1 라이브케어</h3>
            </div>
            <button
              onClick={() => setIsLiveChatOpen(false)}
              className="text-teal-100 hover:text-white font-extrabold text-sm"
            >
              닫기
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
              placeholder="질문 내용을 입력해 주세요..."
              className="flex-1 bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-teal-200 focus:bg-white transition"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-[#057771] text-white rounded-xl text-xs font-black hover:bg-[#04615c] transition shrink-0"
            >
              전송
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
