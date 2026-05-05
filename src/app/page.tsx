import Link from "next/link";
import { getPrisma } from "@/lib/prisma";
import { CategoryCard } from "@/components/home/category-card";
import { ContentCard } from "@/components/home/content-card";
import {
  FALLBACK_STAYS,
  FALLBACK_EXPERIENCES,
  FALLBACK_PROGRAMS,
} from "@/lib/home-data";
import {
  faCalendarDays,
  faChevronRight,
  faCircleCheck,
  faCompass,
  faHouseChimney,
  faMagnifyingGlass,
  faMapLocationDot,
  faPersonHiking,
  faRoute,
  faStore,
  faUserGroup,
  faUsers,
} from "@/lib/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const dynamic = "force-dynamic";

const HOME_PREVIEW_LIMIT = 4;

function fillHomePreview(items: HomeItem[], fallbacks: HomeItem[]) {
  const merged = new Map<string, HomeItem>();

  for (const item of items) {
    merged.set(item.slug, item);
  }

  for (const item of fallbacks) {
    if (!merged.has(item.slug)) {
      merged.set(item.slug, item);
    }
  }

  return Array.from(merged.values()).slice(0, HOME_PREVIEW_LIMIT);
}

async function getHomeData() {
  try {
    const prisma = getPrisma();
    await prisma.$connect();

    const sowonRegion = await prisma.region.findUnique({
      where: { slug: "sowon" },
      select: { id: true },
    });

    if (!sowonRegion) {
      return {
        stays: FALLBACK_STAYS,
        experiences: FALLBACK_EXPERIENCES,
        programs: FALLBACK_PROGRAMS,
      };
    }

    const regionId = sowonRegion.id;

    const [stays, experiences, programs] = await Promise.all([
      prisma.accommodation.findMany({
        where: { status: "published", regionId },
        take: HOME_PREVIEW_LIMIT,
        orderBy: { createdAt: "desc" },
      }),
      prisma.experience.findMany({
        where: { status: "published", regionId },
        take: HOME_PREVIEW_LIMIT,
        orderBy: { createdAt: "desc" },
      }),
      prisma.localIncomeProgram.findMany({
        where: { status: "published", regionId },
        take: HOME_PREVIEW_LIMIT,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      stays: fillHomePreview(stays, FALLBACK_STAYS),
      experiences: fillHomePreview(experiences, FALLBACK_EXPERIENCES),
      programs: fillHomePreview(programs, FALLBACK_PROGRAMS),
    };
  } catch {
    return {
      stays: FALLBACK_STAYS,
      experiences: FALLBACK_EXPERIENCES,
      programs: FALLBACK_PROGRAMS,
    };
  }
}

type HomeItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  priceText?: string | null;
  images?: string[];
};

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-black tracking-tight text-[#161d1f]">{title}</h2>
      <Link href={href} className="flex items-center gap-0.5 text-sm font-bold text-[#2b3234] hover:text-[#ae2f34]">
        전체보기 <FontAwesomeIcon icon={faChevronRight} className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function CardRail({
  items,
  hrefPrefix,
  badge,
  badgeVariant,
  showPrice = true,
}: {
  items: HomeItem[];
  hrefPrefix: string;
  badge: string;
  badgeVariant: "stay" | "experience" | "program";
  showPrice?: boolean;
}) {
  return (
    <div className="grid auto-cols-[220px] grid-flow-col gap-5 overflow-x-auto pb-2 md:grid-flow-row md:grid-cols-4 md:overflow-visible">
      {items.map((item) => (
        <ContentCard
          key={item.id}
          title={item.title}
          summary={item.summary}
          imageUrl={item.images?.[0]}
          href={`${hrefPrefix}/${item.slug}`}
          priceText={showPrice ? item.priceText ?? undefined : undefined}
          badge={badge}
          badgeVariant={badgeVariant}
        />
      ))}
    </div>
  );
}

export default async function Home() {
  const { stays, experiences, programs } = await getHomeData();

  return (
    <main className="min-h-screen bg-[#f4fafd] text-[#161d1f]">
      <section
        className="relative min-h-[580px] overflow-hidden bg-cover bg-center md:min-h-[640px]"
        style={{ backgroundImage: "url('/images/hero-main.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-[#f4fafd]" />
        <div className="relative mx-auto flex min-h-[580px] max-w-6xl flex-col px-5 py-5 md:min-h-[640px]">
          <header className="flex items-center justify-between">
            <Link href="/" className="text-lg font-black tracking-tight text-white drop-shadow md:text-[#161d1f]">
              Sowon Trip
            </Link>
            <nav className="hidden items-center gap-7 rounded-full border border-white/30 bg-white/15 px-5 py-2 text-sm font-bold text-white shadow-sm backdrop-blur-xl md:flex">
              <Link href="/stays" className="text-[#79f3ea] underline underline-offset-8">숙소</Link>
              <Link href="/experiences">체험</Link>
              <Link href="/programs">주민소득상품</Link>
              <Link href="/courses">추천 코스</Link>
              <Link href="/partner/apply" className="rounded-full border border-white/50 px-3 py-1">입점 신청</Link>
            </nav>
          </header>

          <div className="flex flex-1 flex-col items-center justify-center pb-20 text-center text-white">
            <h1 className="text-5xl font-black tracking-tight drop-shadow-lg md:text-7xl">
              Sowon Trip
            </h1>
            <p className="mt-3 text-xl font-extrabold drop-shadow md:text-3xl">
              여행의 시작, 소원의 여정
            </p>

            <form action="/map" className="mt-8 flex w-full max-w-[620px] items-center gap-2 rounded-full border border-white/60 bg-white/70 p-2 pl-5 shadow-[0_20px_70px_-30px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
              <input
                name="q"
                aria-label="검색어"
                placeholder="어디로 떠나시나요? 무엇을 하고 싶으신가요?"
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#161d1f] outline-none placeholder:text-[#584140]/80 md:text-base"
              />
              <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4 shrink-0 text-[#161d1f]" />
              <button className="rounded-full bg-[#161d1f] px-5 py-2.5 text-sm font-black text-white shadow-sm hover:bg-[#ae2f34]">
                검색
              </button>
            </form>

            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link href="/courses" className="flex items-center gap-2 rounded-full border border-white/50 bg-white/65 px-5 py-3 text-sm font-bold text-[#161d1f] shadow-sm backdrop-blur-xl">
                <FontAwesomeIcon icon={faCalendarDays} className="h-4 w-4" /> Dates
              </Link>
              <Link href="/partner/apply" className="flex items-center gap-2 rounded-full border border-white/50 bg-white/65 px-5 py-3 text-sm font-bold text-[#161d1f] shadow-sm backdrop-blur-xl">
                <FontAwesomeIcon icon={faUserGroup} className="h-4 w-4" /> Guests
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-28 grid max-w-4xl grid-cols-2 gap-4 px-5 md:grid-cols-4">
        <CategoryCard
          title="숙소"
          subtitle="Stay"
          href="/stays"
          category="stay"
          icon={<FontAwesomeIcon icon={faHouseChimney} className="h-9 w-9" />}
        />
        <CategoryCard
          title="체험"
          subtitle="Experience"
          href="/experiences"
          category="experience"
          icon={<FontAwesomeIcon icon={faPersonHiking} className="h-9 w-9" />}
        />
        <CategoryCard
          title="주민소득상품"
          subtitle="Local Products"
          href="/programs"
          category="program"
          icon={<FontAwesomeIcon icon={faStore} className="h-9 w-9" />}
        />
        <CategoryCard
          title="추천 코스"
          subtitle="Tours"
          href="/courses"
          category="course"
          icon={<FontAwesomeIcon icon={faRoute} className="h-9 w-9" />}
        />
      </section>

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:pt-14">
        <section className="py-5">
          <SectionHeader title="추천 숙소" href="/stays" />
          <CardRail items={stays} hrefPrefix="/stays" badge="STAY" badgeVariant="stay" />
        </section>

        <section className="py-8">
          <SectionHeader title="인기 체험" href="/experiences" />
          <CardRail items={experiences} hrefPrefix="/experiences" badge="EXPERIENCE" badgeVariant="experience" showPrice={false} />
        </section>

        <section className="py-8">
          <SectionHeader title="주민소득상품" href="/programs" />
          <CardRail items={programs} hrefPrefix="/programs" badge="PROGRAM" badgeVariant="program" showPrice={false} />
        </section>

        <section className="grid gap-5 py-8 md:grid-cols-2">
          <Link href="/partner/apply" className="group flex items-center justify-between rounded-2xl bg-white/80 p-7 shadow-[0_16px_50px_-32px_rgba(0,0,0,0.4)] ring-1 ring-[#dde4e6] backdrop-blur-xl transition hover:-translate-y-1">
            <div>
              <h3 className="text-xl font-black">파트너 입점 신청</h3>
              <p className="mt-2 text-sm font-medium text-[#584140]">파트너 입점 설명하고 신청합니다.</p>
              <span className="mt-5 inline-flex rounded-full bg-[#161d1f] px-5 py-2 text-sm font-black text-white group-hover:bg-[#ae2f34]">
                파트너 신청
              </span>
            </div>
            <FontAwesomeIcon icon={faCircleCheck} className="h-20 w-20 text-[#161d1f]" />
          </Link>

          <Link href="/map" className="group flex items-center justify-between rounded-2xl bg-white/80 p-7 shadow-[0_16px_50px_-32px_rgba(0,0,0,0.4)] ring-1 ring-[#dde4e6] backdrop-blur-xl transition hover:-translate-y-1">
            <div>
              <h3 className="text-xl font-black">로컬 지도 보기</h3>
              <p className="mt-2 text-sm font-medium text-[#584140]">지역의 숙소와 체험 위치를 모아봅니다.</p>
              <span className="mt-5 inline-flex rounded-full bg-[#161d1f] px-5 py-2 text-sm font-black text-white group-hover:bg-[#006a65]">
                지도 보기
              </span>
            </div>
            <FontAwesomeIcon icon={faMapLocationDot} className="h-20 w-20 text-[#161d1f]" />
          </Link>
        </section>

        <footer className="mt-7 flex flex-col gap-4 border-t border-[#dde4e6] py-7 text-sm text-[#584140] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-5">
            <span className="text-base font-black text-[#161d1f]">Sowon Trip</span>
            <span>관광문의</span>
            <span>010-0233-4548</span>
            <span>www.sowontrip.com</span>
          </div>
          <div className="flex items-center gap-4">
            <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
            <FontAwesomeIcon icon={faCompass} className="h-5 w-5" />
            <FontAwesomeIcon icon={faMapLocationDot} className="h-5 w-5" />
          </div>
        </footer>
      </div>
    </main>
  );
}
