import Link from "next/link";
import { getPrisma } from "@/lib/prisma";
import { CategoryCard } from "@/components/home/category-card";
import { ContentCard } from "@/components/home/content-card";
import {
  FALLBACK_STAYS,
  FALLBACK_EXPERIENCES,
  FALLBACK_PROGRAMS,
  FALLBACK_COURSES,
} from "@/lib/home-data";
import {
  Bed,
  Compass,
  Users,
  Map as MapIcon,
  ChevronRight,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

async function getHomeData() {
  try {
    const prisma = getPrisma();
    // Attempt to connect to DB with a short check
    await prisma.$connect();

    // Fetch the 'sowon' region ID first
    const sowonRegion = await prisma.region.findUnique({
      where: { slug: "sowon" },
      select: { id: true },
    });

    if (!sowonRegion) {
      console.warn("'sowon' region not found in DB, using fallback data.");
      return {
        stays: FALLBACK_STAYS,
        experiences: FALLBACK_EXPERIENCES,
        programs: FALLBACK_PROGRAMS,
        courses: FALLBACK_COURSES,
      };
    }

    const regionId = sowonRegion.id;

    const [stays, experiences, programs, courses] = await Promise.all([
      prisma.accommodation.findMany({
        where: { status: "published", regionId },
        take: 2,
        orderBy: { createdAt: "desc" },
      }),
      prisma.experience.findMany({
        where: { status: "published", regionId },
        take: 2,
        orderBy: { createdAt: "desc" },
      }),
      prisma.localIncomeProgram.findMany({
        where: { status: "published", regionId },
        take: 2,
        orderBy: { createdAt: "desc" },
      }),
      prisma.course.findMany({
        where: { status: "published", regionId },
        take: 2,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      stays: stays.length > 0 ? stays : FALLBACK_STAYS,
      experiences: experiences.length > 0 ? experiences : FALLBACK_EXPERIENCES,
      programs: programs.length > 0 ? programs : FALLBACK_PROGRAMS,
      courses: courses.length > 0 ? courses : FALLBACK_COURSES,
    };
  } catch {
    console.warn("DB connection failed or not available, using fallback data.");
    return {
      stays: FALLBACK_STAYS,
      experiences: FALLBACK_EXPERIENCES,
      programs: FALLBACK_PROGRAMS,
      courses: FALLBACK_COURSES,
    };
  }
}

export default async function Home() {
  const { stays, experiences, programs, courses } = await getHomeData();

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* 1. 상단 소개 영역 */}
      <section className="px-6 py-12 md:py-20 bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-6 items-start">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              소원권역 로컬트립
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
              주민과 여행자가 상생하는 소원면의 진정한 매력을 발견하세요.
              문의 한 번으로 시작되는 특별한 로컬 여행.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              href="/stays"
              className={cn(buttonVariants({ size: "xl", variant: "default" }), "rounded-full")}
            >
              숙소 보기
            </Link>
            <Link
              href="/experiences"
              className={cn(buttonVariants({ size: "xl", variant: "outline" }), "rounded-full")}
            >
              체험 보기
            </Link>
            <Link
              href="/programs"
              className={cn(buttonVariants({ size: "xl", variant: "ghost" }), "rounded-full")}
            >
              주민소득상품 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 2. 카테고리 진입 섹션 */}
      <section className="px-6 py-12 max-w-screen-xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CategoryCard
            title="숙소"
            description="바다 전망부터 마을 민박까지"
            href="/stays"
            category="stay"
            icon={<Bed className="w-6 h-6" />}
          />
          <CategoryCard
            title="체험"
            description="서핑부터 업사이클링까지"
            href="/experiences"
            category="experience"
            icon={<Compass className="w-6 h-6" />}
          />
          <CategoryCard
            title="주민소득상품"
            description="마을의 활력이 되는 특별한 제안"
            href="/programs"
            category="program"
            icon={<Users className="w-6 h-6" />}
          />
          <CategoryCard
            title="추천코스"
            description="로컬이 제안하는 완벽한 하루"
            href="/courses"
            category="course"
            icon={<MapIcon className="w-6 h-6" />}
          />
        </div>
      </section>

      {/* 3. 추천 콘텐츠 미리보기 섹션 */}
      <div className="flex flex-col gap-16 mt-4">
        {/* 숙소 */}
        <section className="px-6 max-w-screen-xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-category-stay rounded-full" />
              추천 숙소
            </h2>
            <Link href="/stays" className="text-sm font-medium text-muted-foreground flex items-center hover:text-category-stay transition-colors">
              전체보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stays.map((item) => (
              <ContentCard
                key={item.id}
                title={item.title}
                summary={item.summary}
                imageUrl={item.images?.[0]}
                href={`/stays/${item.slug}`}
                priceText={item.priceText ?? undefined}
                badge="Stay"
                badgeVariant="stay"
              />
            ))}
          </div>
        </section>

        {/* 체험 */}
        <section className="px-6 max-w-screen-xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-category-experience rounded-full" />
              인기 체험
            </h2>
            <Link href="/experiences" className="text-sm font-medium text-muted-foreground flex items-center hover:text-category-experience transition-colors">
              전체보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {experiences.map((item) => (
              <ContentCard
                key={item.id}
                title={item.title}
                summary={item.summary}
                imageUrl={item.images?.[0]}
                href={`/experiences/${item.slug}`}
                priceText={(item as { priceText: string | null }).priceText ?? undefined}
                badge="Experience"
                badgeVariant="experience"
              />
            ))}
          </div>
        </section>

        {/* 주민소득상품 */}
        <section className="px-6 max-w-screen-xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-category-program rounded-full" />
              주민소득상품
            </h2>
            <Link href="/programs" className="text-sm font-medium text-muted-foreground flex items-center hover:text-category-program transition-colors">
              전체보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {programs.map((item) => (
              <ContentCard
                key={item.id}
                title={item.title}
                summary={item.summary}
                imageUrl={item.images?.[0]}
                href={`/programs/${item.slug}`}
                priceText={(item as { priceText: string | null }).priceText ?? undefined}
                badge="Program"
                badgeVariant="program"
              />
            ))}
          </div>
        </section>

        {/* 추천코스 */}
        <section className="px-6 max-w-screen-xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-category-course rounded-full" />
              로컬 추천 코스
            </h2>
            <Link href="/courses" className="text-sm font-medium text-muted-foreground flex items-center hover:text-category-course transition-colors">
              전체보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {courses.map((item) => (
              <ContentCard
                key={item.id}
                title={item.title}
                summary={item.summary}
                imageUrl={item.images?.[0]}
                href={`/courses/${item.slug}`}
                badge="Course"
                badgeVariant="course"
              />
            ))}
          </div>
        </section>
      </div>

      {/* 4. 입점신청 및 지도 진입 */}
      <section className="px-6 py-20 mt-12 bg-muted/30">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            href="/partner/apply"
            className="group flex flex-col gap-4 p-8 bg-card border rounded-2xl hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">파트너 입점 신청</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                소원권역의 가치를 함께 만들어갈 숙박, 체험, 로컬 파트너를 모십니다.
              </p>
            </div>
            <div className="flex items-center text-primary text-sm font-bold mt-2">
              신청하러 가기 <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/map"
            className="group flex flex-col gap-4 p-8 bg-card border rounded-2xl hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-secondary/20 text-secondary-foreground rounded-full flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">로컬 지도 보기</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                소원면 곳곳에 숨겨진 보물 같은 장소들을 지도로 한눈에 확인하세요.
              </p>
            </div>
            <div className="flex items-center text-secondary-foreground text-sm font-bold mt-2">
              지도 열기 <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
