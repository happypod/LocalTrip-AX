import { PublishStatus } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { CourseFilterGrid, CourseFilterItem } from "@/components/courses/course-filter-grid";
import type { CourseUI } from "@/lib/course-data";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getServerTranslationLocale } from "@/lib/server-translation";
import { getLocalizedList } from "@/lib/content-translation-server";
import { getStaticLabels } from "@/lib/static-translations";

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
  const currentLocale = await getServerTranslationLocale();
  const labels = getStaticLabels(currentLocale);

  const rawCourses = await getCourses();
  const localizedCourses = await getLocalizedList(rawCourses, "course", currentLocale);

  const courseItems: CourseFilterItem[] = localizedCourses.map((course) => ({
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
            <Link href="/" className="hover:text-foreground">{labels.home}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{labels.tabCourse}</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight">{labels.allCourseTitle}</h1>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            {labels.allCourseDesc}
          </p>
        </div>
      </header>

      <main className="px-6 py-8 max-w-screen-xl mx-auto w-full flex flex-col gap-8">
        
        {/* Required Message Block */}
        <div className="bg-category-course/10 border border-category-course/20 rounded-xl p-5 text-sm leading-relaxed text-foreground/80 shadow-sm">
          <p>
            <strong className="text-category-course font-bold">{labels.allCourseBannerBold}</strong><br/>
            {labels.allCourseBannerText}
          </p>
        </div>

        {courseItems.length > 0 ? (
          <CourseFilterGrid courses={courseItems} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl">
            <p className="text-muted-foreground">{labels.allCourseEmpty}</p>
          </div>
        )}
      </main>
    </div>
  );
}
