import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faMapLocationDot,
  faStar,
  faTicket,
  faUsers,
} from "@/lib/fontawesome";
import {
  normalizeEventGradientForDisplay,
  normalizeEventHrefForDisplay,
} from "@/lib/event-policy";
import { getPrisma } from "@/lib/prisma";
import { PublishStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

type EventItem = {
  id: string;
  tag: string;
  title: string;
  subTitle: string;
  description: string;
  gradient: string;
  href: string;
  createdAt: Date;
};

const tabs = [
  { code: "ALL", label: "전체" },
  { code: "STAY", label: "숙소" },
  { code: "EXPERIENCE", label: "체험" },
  { code: "PROGRAM", label: "주민소득상품" },
  { code: "COURSE", label: "추천 코스" },
] as const;

type EventTabCode = (typeof tabs)[number]["code"];

function getEventCategory(href: string): EventTabCode {
  if (href.startsWith("/stays")) return "STAY";
  if (href.startsWith("/experiences")) return "EXPERIENCE";
  if (href.startsWith("/programs")) return "PROGRAM";
  if (href.startsWith("/courses")) return "COURSE";
  return "ALL";
}

function getEventIcon(href: string) {
  if (href.startsWith("/experiences")) {
    return { icon: faTicket, color: "text-pink-600" };
  }
  if (href.startsWith("/programs")) {
    return { icon: faStar, color: "text-amber-600" };
  }
  if (href.startsWith("/courses")) {
    return { icon: faCompass, color: "text-teal-600" };
  }
  return { icon: faMapLocationDot, color: "text-indigo-600" };
}

async function getPublishedEvents(): Promise<EventItem[]> {
  try {
    const prisma = getPrisma();
    await prisma.$connect();

    const sowonRegion = await prisma.region.findUnique({
      where: { slug: "sowon" },
      select: { id: true },
    });

    if (!sowonRegion) {
      return [];
    }

    const events = await prisma.event.findMany({
      where: {
        regionId: sowonRegion.id,
        status: PublishStatus.published,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        tag: true,
        title: true,
        subTitle: true,
        description: true,
        gradient: true,
        href: true,
        createdAt: true,
      },
    });

    return events.map((event) => ({
      ...event,
      href: normalizeEventHrefForDisplay(event.href),
      gradient: normalizeEventGradientForDisplay(event.gradient),
    }));
  } catch (error) {
    console.warn("Failed to load public events:", error);
    return [];
  }
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const activeTab = tabs.some((tab) => tab.code === resolvedSearchParams?.tab)
    ? resolvedSearchParams?.tab ?? "ALL"
    : "ALL";
  const events = await getPublishedEvents();
  const filteredEvents =
    activeTab === "ALL"
      ? events
      : events.filter((event) => getEventCategory(event.href) === activeTab);

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-24 text-[#161d1f]">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              소식·혜택
            </h1>
            <span className="rounded-full bg-red-50 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#ae2f34]">
              Sowon Offers
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-gray-500">
            소원권역에서 운영 중인 혜택, 참여 소식, 기획 콘텐츠를 확인하세요.
          </p>
        </div>

        <div className="mb-10 flex gap-2 overflow-x-auto border-b border-gray-200 pb-px">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.code;
            const href = tab.code === "ALL" ? "/events" : `/events?tab=${tab.code}`;
            return (
              <Link
                key={tab.code}
                href={href}
                className={`relative shrink-0 px-4 pb-3.5 text-sm font-bold transition-all ${
                  isSelected
                    ? "border-b-2 border-[#ae2f34] text-[#ae2f34]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const { icon, color } = getEventIcon(event.href);

              return (
                <Link
                  key={event.id}
                  href={event.href}
                  className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_24px_-8px_rgba(0,0,0,0.12)]"
                >
                  <div>
                    <span className="mb-1.5 block text-[10px] font-bold text-gray-400 sm:text-xs">
                      {event.tag}
                    </span>
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-20 transition-opacity group-hover:opacity-30`}
                    />
                    <div className="relative z-10">
                      <h3 className="text-lg font-black leading-snug text-gray-900 transition-colors group-hover:text-[#ae2f34]">
                        {event.title}
                      </h3>
                      <h4 className="mt-1 text-sm font-extrabold leading-snug text-gray-700">
                        {event.subTitle}
                      </h4>
                      <p className="mt-2 max-w-[85%] text-xs font-medium leading-relaxed text-gray-500">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 flex items-center justify-between border-t border-gray-100/50 pt-4">
                    <span className="text-[11px] font-bold text-gray-400">
                      {event.createdAt.toLocaleDateString("ko-KR")}
                    </span>
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-4 ring-white/60 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <FontAwesomeIcon icon={icon} className={`h-6 w-6 ${color}`} />
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
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-20 text-center">
            <p className="text-base font-black text-gray-600">
              진행 중인 소식이 없습니다.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              새 운영 소식이 등록되면 이곳에 표시됩니다.
            </p>
          </div>
        )}

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
