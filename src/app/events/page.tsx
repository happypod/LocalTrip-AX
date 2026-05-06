"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faMapLocationDot,
  faStar,
  faTicket,
  faUsers,
} from "@/lib/fontawesome";

interface EventItem {
  id: string;
  tag: string;
  title: string;
  subTitle: string;
  description: string;
  gradient: string;
  href: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

const FALLBACK_EVENTS: EventItem[] = [
  {
    id: "fb-1",
    tag: "매주 화·수·금 오전 10시 오픈!",
    title: "놀라운 소원 특가 등장",
    subTitle: "주중 힐링 스테이 오픈런",
    description: "인기 숙소 초특가 선착순 한정수량 할인",
    gradient: "from-blue-50 to-indigo-100/40",
    href: "/stays",
    startDate: "2026.05.01",
    endDate: "2026.06.31 23:59",
    status: "HOT",
  },
  {
    id: "fb-2",
    tag: "매월 단 10일만 열리는 특가!",
    title: "더블쿠폰 핫세일",
    subTitle: "전체 체험 최대 50% 할인",
    description: "소원면 인기 서핑/체험 전용 쿠폰 패키지",
    gradient: "from-rose-50 to-pink-100/40",
    href: "/experiences",
    startDate: "2026.05.01",
    endDate: "2026.06.10 23:59",
    status: "HOT",
  },
  {
    id: "fb-3",
    tag: "소원트립 단독 혜택!",
    title: "매달 도전! 로컬 트립",
    subTitle: "5월 소원 리뷰왕 이벤트",
    description: "주민소득상품 우수 리뷰어 상품권 및 무료 숙박권 증정",
    gradient: "from-amber-50 to-yellow-100/40",
    href: "/programs",
    startDate: "2026.05.01",
    endDate: "2026.05.31 23:59",
    status: "HOT",
  },
  {
    id: "fb-4",
    tag: "국내 숙소부터 추천 코스까지!",
    title: "최저가 여행은 소원트립",
    subTitle: "최저가 기획 특가 모음전",
    description: "한정 기간 국내 숙박 전 상품 최고가 대비 할인 보장",
    gradient: "from-teal-50 to-emerald-100/40",
    href: "/courses",
    startDate: "2026.03.25",
    endDate: "2026.06.30 23:59",
    status: "STAY",
  },
  {
    id: "fb-5",
    tag: "그린 빌리지가 추천하는 로컬 코스",
    title: "그린 가이드 투어 보러가기",
    subTitle: "초자연 힐링 에코투어 코스",
    description: "가족, 연인과 함께 자연 속을 걷는 소원면 숲길 투어 코스",
    gradient: "from-green-50 to-emerald-100/30",
    href: "/courses",
    startDate: "2026.05.01",
    endDate: "2026.08.31 23:59",
    status: "COURSE",
  },
  {
    id: "fb-6",
    tag: "VVIP 특별 여행 커뮤니티 추천",
    title: "트립홀릭 엄선 숙소 모음",
    subTitle: "소원면 명품 펜션 10선",
    description: "엄격한 기준을 통과한 프라이빗 수영장 펜션 특별 할인전",
    gradient: "from-purple-50 to-indigo-100/30",
    href: "/stays",
    startDate: "2026.05.15",
    endDate: "2026.07.15 23:59",
    status: "STAY",
  },
];

function isRemoteEventItem(value: unknown): value is Partial<EventItem> {
  return typeof value === "object" && value !== null;
}

function getEventStatusFromHref(href: string) {
  if (href.includes("stay")) return "STAY";
  if (href.includes("experience")) return "EXPERIENCE";
  if (href.includes("program")) return "PROGRAM";
  return "COURSE";
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [events, setEvents] = useState<EventItem[]>(FALLBACK_EVENTS);

  useEffect(() => {
    // Attempt dynamic retrieval from API if available, else fallback cleanly
    fetch("/api/lead-events")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.filter(isRemoteEventItem).map((event, index) => {
            const href = typeof event.href === "string" ? event.href : "/stays";

            return {
            id: typeof event.id === "string" ? event.id : `remote-${index}`,
            tag: typeof event.tag === "string" ? event.tag : "소원트립 이벤트",
            title: typeof event.title === "string" ? event.title : "진행 중인 이벤트",
            subTitle: typeof event.subTitle === "string" ? event.subTitle : "소원권역 특별 기획",
            description: typeof event.description === "string" ? event.description : "자세한 내용은 상세 페이지에서 확인해 주세요.",
            gradient: typeof event.gradient === "string" ? event.gradient : "from-blue-50 to-indigo-100/40",
            href,
            startDate: "2026.05.01",
            endDate: "2026.06.30 23:59",
            status: getEventStatusFromHref(href),
          };
          });
          setEvents(mapped);
        }
      })
      .catch(() => {
        // Fallback gracefully to default rich items
      });
  }, []);

  const tabs = [
    { code: "ALL", label: "HOT / 전체" },
    { code: "STAY", label: "숙소" },
    { code: "EXPERIENCE", label: "체험" },
    { code: "PROGRAM", label: "주민소득상품" },
    { code: "COURSE", label: "추천 코스" },
  ];

  const filteredEvents =
    activeTab === "ALL"
      ? events
      : events.filter((e) => e.status === activeTab);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#161d1f] pb-24">
      <div className="mx-auto max-w-6xl px-5 py-10">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">이벤트</h1>
            <span className="rounded-full bg-red-50 px-3.5 py-1 text-xs font-black text-[#ae2f34] uppercase tracking-wider animate-pulse">
              HOT Promotion
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-gray-500">
            소원트립 회원만을 위한 초특가 할인 및 스페셜 단독 패키지를 한눈에 확인해 보세요!
          </p>
        </div>

        {/* Tab Interface - Matching Reference Image */}
        <div className="mb-10 flex gap-2 border-b border-gray-200 overflow-x-auto pb-px scrollbar-none">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.code;
            return (
              <button
                key={tab.code}
                onClick={() => setActiveTab(tab.code)}
                className={`pb-3.5 px-4 text-sm font-bold transition-all relative shrink-0 ${
                  isSelected
                    ? "text-[#ae2f34] border-b-2 border-[#ae2f34] font-black"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Event Grid - Matching Reference Image (3 columns on desktop) */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              let icon = faCompass;
              let iconColor = "text-indigo-600";
              if (event.href.includes("experience")) {
                icon = faTicket;
                iconColor = "text-pink-600";
              } else if (event.href.includes("program")) {
                icon = faStar;
                iconColor = "text-amber-600";
              }

              return (
                <Link
                  key={event.id}
                  href={event.href}
                  className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br bg-white p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_24px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between min-h-[220px]"
                >
                  <div>
                    {/* Event Tag */}
                    <span className="text-[10px] sm:text-xs font-bold text-gray-400 block mb-1.5">{event.tag}</span>
                    
                    {/* Background Gradient Layer for soft glowing backdrop */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-lg font-black text-gray-900 leading-snug group-hover:text-[#ae2f34] transition-colors">
                        {event.title}
                      </h3>
                      <h4 className="text-sm font-extrabold text-gray-700 mt-1 leading-snug">
                        {event.subTitle}
                      </h4>
                      <p className="text-xs text-gray-500 mt-2 font-medium leading-relaxed max-w-[85%]">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Date Range and Dynamic Icon Placement */}
                  <div className="relative z-10 mt-6 flex items-center justify-between pt-4 border-t border-gray-100/50">
                    <span className="text-[11px] font-bold text-gray-400">
                      {event.startDate} - {event.endDate}
                    </span>
                    
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-4 ring-white/60 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <FontAwesomeIcon icon={icon} className={`h-6 w-6 ${iconColor}`} />
                      <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#161d1f] text-[9px] font-bold text-white shadow-sm">
                        Go
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400 font-bold">
            등록된 진행 중인 이벤트가 없습니다.
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 flex flex-col gap-4 border-t border-gray-200/60 py-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-5">
            <span className="text-base font-black text-gray-900">Sowon Trip</span>
            <span>관광문의</span>
            <span>010-0233-4548</span>
            <span>www.sowontrip.com</span>
          </div>
          <div className="flex items-center gap-4">
            <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-gray-400" />
            <FontAwesomeIcon icon={faCompass} className="h-5 w-5 text-gray-400" />
            <FontAwesomeIcon icon={faMapLocationDot} className="h-5 w-5 text-gray-400" />
          </div>
        </footer>
      </div>
    </main>
  );
}
