import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { PublishStatus, CourseItemType } from "@prisma/client";
import { FALLBACK_COURSES, CourseUI, CourseItemUI } from "@/lib/course-data";
import { CourseImage } from "@/components/courses/course-image";
import { CourseRoute } from "@/components/courses/course-route";
import { CourseLinkedItems } from "@/components/courses/course-linked-items";
import { CourseCTA } from "@/components/courses/course-cta";
import { ChevronLeft, Compass, Info, Route } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getCourseBySlug(slug: string): Promise<CourseUI | undefined> {
  try {
    const prisma = getPrisma();
    await prisma.$connect();

    const sowonRegion = await prisma.region.findUnique({
      where: { slug: "sowon" },
      select: { id: true },
    });

    if (!sowonRegion) {
      return FALLBACK_COURSES.find((c) => c.slug === slug && c.status === PublishStatus.published);
    }

    const course = await prisma.course.findFirst({
      where: {
        slug,
        status: PublishStatus.published,
        regionId: sowonRegion.id,
      },
      include: {
        courseItems: {
          orderBy: { sortOrder: 'asc' },
          include: {
            accommodation: { select: { slug: true, title: true } },
            experience: { select: { slug: true, title: true } },
            localIncomeProgram: { select: { slug: true, title: true } }
          }
        }
      }
    });

    if (course) {
      // Map DB structure to UI structure safely
      const routeItems: CourseItemUI[] = course.courseItems.map(item => {
        let mappedSlug = "";
        let mappedTitle = "이름 없음";
        
        if (item.itemType === CourseItemType.accommodation && item.accommodation) {
          mappedSlug = item.accommodation.slug;
          mappedTitle = item.accommodation.title;
        } else if (item.itemType === CourseItemType.experience && item.experience) {
          mappedSlug = item.experience.slug;
          mappedTitle = item.experience.title;
        } else if (item.itemType === CourseItemType.local_income_program && item.localIncomeProgram) {
          mappedSlug = item.localIncomeProgram.slug;
          mappedTitle = item.localIncomeProgram.title;
        }
        
        return {
          id: item.id,
          itemType: item.itemType,
          sortOrder: item.sortOrder,
          note: item.note,
          title: mappedTitle,
          slug: mappedSlug,
        };
      });

      return {
        ...course,
        targetType: "전체", // Fallback logic for extended fields
        durationType: "기본",
        routeItems,
        linkedStayCount: routeItems.filter(i => i.itemType === "accommodation").length,
        linkedExpCount: routeItems.filter(i => i.itemType === "experience").length,
        linkedProgCount: routeItems.filter(i => i.itemType === "local_income_program").length,
      } as CourseUI;
    }
    
    return FALLBACK_COURSES.find((c) => c.slug === slug && c.status === PublishStatus.published);
  } catch (error) {
    console.warn(`Failed to fetch course ${slug} from DB, using fallback:`, error);
    return FALLBACK_COURSES.find((c) => c.slug === slug && c.status === PublishStatus.published);
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-muted/10">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-screen-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/courses" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" />
            추천 코스 목록
          </Link>
          <Link href="/" className="text-xs text-muted-foreground hover:underline">홈</Link>
        </div>
      </header>

      <main className="max-w-screen-md mx-auto w-full">
        {/* Main Image */}
        <div className="relative">
          <CourseImage src={course.images?.[0]} alt={course.title} />
          <div className="absolute top-4 left-4 flex gap-2">
            {course.targetType && (
              <div className="px-3 py-1.5 bg-category-course text-white text-[11px] font-bold rounded-lg shadow-lg">
                {course.targetType}
              </div>
            )}
            {course.durationType && (
              <div className="px-3 py-1.5 bg-background text-foreground text-[11px] font-bold rounded-lg shadow-lg">
                {course.durationType}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 flex flex-col gap-10 bg-background">
          {/* Header Info */}
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-foreground flex items-center gap-2">
              <Compass className="w-7 h-7 text-category-course shrink-0" />
              {course.title}
            </h1>
            <p className="text-muted-foreground leading-relaxed text-[15px]">
              {course.summary}
            </p>
          </div>

          <hr className="border-muted" />

          {/* Description */}
          {course.description && (
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {course.description}
              </p>
            </div>
          )}

          {/* 3. Movement minimizing message */}
          <div className="bg-category-course/5 border border-category-course/20 rounded-xl p-4 flex gap-3 items-start">
            <Info className="w-5 h-5 text-category-course shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-foreground">이동 안내</span>
              <span className="text-sm text-muted-foreground leading-relaxed">
                이 코스는 숙소 주변 또는 현장 집결형 프로그램을 중심으로 구성되어 있습니다. <br/>
                일부 이동은 자가용, 도보, 지역 교통수단 이용이 필요할 수 있습니다. (차량 배차, 셔틀 기능은 제공하지 않습니다)
              </span>
            </div>
          </div>

          {/* 1. Course Schedule (Route) */}
          <section className="flex flex-col gap-5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Route className="w-5 h-5 text-category-course" />
              추천 일정표
            </h2>
            <CourseRoute items={course.routeItems} />
          </section>

          <hr className="border-muted" />

          {/* 2. Linked Items */}
          <section className="flex flex-col gap-5">
            <h2 className="text-xl font-bold">코스 관련 콘텐츠</h2>
            <CourseLinkedItems 
              courseId={course.id}
              courseSlug={course.slug}
              items={course.routeItems} 
            />
          </section>

          {/* CTA */}
          <section className="mt-4">
            <CourseCTA itemId={course.id} itemSlug={course.slug} />
          </section>
        </div>
      </main>
    </div>
  );
}
