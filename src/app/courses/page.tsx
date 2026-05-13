import { PublishStatus } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { CourseFilterGrid, CourseFilterItem } from "@/components/courses/course-filter-grid";
import type { CourseUI } from "@/lib/course-data";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getCourses(): Promise<CourseUI[]> {
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

    const courses = await prisma.course.findMany({
      where: {
        status: PublishStatus.published,
        regionId: sowonRegion.id,
      },
      include: {
        courseItems: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return courses.map(c => ({
      ...c,
      linkedStayCount: c.courseItems.filter(i => i.itemType === "accommodation").length,
      linkedExpCount: c.courseItems.filter(i => i.itemType === "experience").length,
      linkedProgCount: c.courseItems.filter(i => i.itemType === "local_income_program").length,
      routeItems: [],
    })) as CourseUI[];
  } catch (error) {
    console.warn("Failed to fetch courses from DB:", error);
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();
  const courseItems: CourseFilterItem[] = courses.map((course) => ({
    id: course.id,
    title: course.title,
    summary: course.summary,
    targetType: course.targetType,
    durationType: course.durationType,
    imageUrl: course.images?.[0],
    slug: course.slug,
    linkedStayCount: course.linkedStayCount,
    linkedExpCount: course.linkedExpCount,
    linkedProgCount: course.linkedProgCount,
  }));

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="px-6 py-12 bg-muted/30 border-b">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground">홈</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">여정의 기록</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight">소원머묾 여정의 기록</h1>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            머묾, 노님, 소원 별미를 고요히 연결해 태안 바다에서 보내는 힐링 하루를 남깁니다.
          </p>
        </div>
      </header>

      <main className="px-6 py-8 max-w-screen-xl mx-auto w-full flex flex-col gap-8">
        
        {/* Required Message Block */}
        <div className="bg-category-course/10 border border-category-course/20 rounded-xl p-5 text-sm leading-relaxed text-foreground/80 shadow-sm">
          <p>
            <strong className="text-category-course font-bold">이동 최소화 중심의 체류형 코스</strong><br/>
            소원로컬트립의 추천 코스는 이동을 많이 하는 관광이 아니라, 머무는 곳 주변에서 숙박·체험·식사·마을 이야기를 연결하는 체류형 코스입니다.
          </p>
        </div>

        {courseItems.length > 0 ? (
          <CourseFilterGrid courses={courseItems} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl">
            <p className="text-muted-foreground">현재 등록된 여정의 기록이 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}
