import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { getLocalizedContent } from "@/lib/content-translation";
import { getServerTranslationLocale } from "@/lib/server-translation";
import { PublishStatus, CourseItemType } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type { CourseUI, CourseItemUI } from "@/lib/course-data";
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
      return undefined;
    }

    const course = await prisma.course.findFirst({
      where: {
        slug,
        status: PublishStatus.published,
        regionId: sowonRegion.id,
      },
      include: {
        courseItems: {
          orderBy: { sortOrder: "asc" },
          include: {
            accommodation: { select: { slug: true, title: true, status: true } },
            experience: { select: { slug: true, title: true, status: true } },
            localIncomeProgram: { select: { slug: true, title: true, status: true } },
          },
        },
      },
    });

    if (!course) {
      return undefined;
    }

    const routeItems: CourseItemUI[] = course.courseItems
      .map((item): CourseItemUI | null => {
        if (item.itemType === CourseItemType.accommodation) {
          if (!item.accommodation || item.accommodation.status !== PublishStatus.published) return null;
          return {
            id: item.id,
            itemType: item.itemType,
            sortOrder: item.sortOrder,
            note: item.note,
            title: item.accommodation.title,
            slug: item.accommodation.slug,
          };
        }

        if (item.itemType === CourseItemType.experience) {
          if (!item.experience || item.experience.status !== PublishStatus.published) return null;
          return {
            id: item.id,
            itemType: item.itemType,
            sortOrder: item.sortOrder,
            note: item.note,
            title: item.experience.title,
            slug: item.experience.slug,
          };
        }

        if (item.itemType === CourseItemType.local_income_program) {
          if (!item.localIncomeProgram || item.localIncomeProgram.status !== PublishStatus.published) return null;
          return {
            id: item.id,
            itemType: item.itemType,
            sortOrder: item.sortOrder,
            note: item.note,
            title: item.localIncomeProgram.title,
            slug: item.localIncomeProgram.slug,
          };
        }

        return null;
      })
      .filter((item): item is CourseItemUI => item !== null);

    const currentLocale = await getServerTranslationLocale();
    let localizedCourse = course as unknown as CourseUI;

    if (currentLocale !== "ko") {
      const translations = await prisma.contentTranslation.findMany({
        where: {
          targetType: "course",
          targetId: course.id,
          locale: { in: [currentLocale, "en"] },
        },
      });
      localizedCourse = getLocalizedContent(course as unknown as CourseUI, translations, currentLocale);

      const itemTranslationFilters: Prisma.ContentTranslationWhereInput[] = [];
      const accommodationIds = course.courseItems
        .map((item) => item.accommodationId)
        .filter((id): id is string => Boolean(id));
      const experienceIds = course.courseItems
        .map((item) => item.experienceId)
        .filter((id): id is string => Boolean(id));
      const programIds = course.courseItems
        .map((item) => item.localIncomeProgramId)
        .filter((id): id is string => Boolean(id));

      if (accommodationIds.length > 0) {
        itemTranslationFilters.push({
          targetType: "accommodation",
          targetId: { in: accommodationIds },
        });
      }
      if (experienceIds.length > 0) {
        itemTranslationFilters.push({
          targetType: "experience",
          targetId: { in: experienceIds },
        });
      }
      if (programIds.length > 0) {
        itemTranslationFilters.push({
          targetType: "local_income_program",
          targetId: { in: programIds },
        });
      }

      if (itemTranslationFilters.length > 0) {
        const itemTranslations = await prisma.contentTranslation.findMany({
          where: {
            OR: itemTranslationFilters,
            locale: { in: [currentLocale, "en"] },
          }
        });
        
        routeItems.forEach(item => {
          const dbItem = course.courseItems.find(ci => ci.id === item.id);
          const targetId = dbItem?.accommodationId || dbItem?.experienceId || dbItem?.localIncomeProgramId;
          const targetType =
            dbItem?.accommodationId
              ? "accommodation"
              : dbItem?.experienceId
                ? "experience"
                : dbItem?.localIncomeProgramId
                  ? "local_income_program"
                  : null;
          if (targetId) {
            const translationsForItem = itemTranslations.filter(
              (t) => t.targetId === targetId && t.targetType === targetType
            );
            const loc = getLocalizedContent({ title: item.title, summary: null }, translationsForItem, currentLocale);
            item.title = loc.title;
          }
        });
      }
    }

    return {
      ...localizedCourse,
      routeItems,
      linkedStayCount: routeItems.filter((i) => i.itemType === "accommodation").length,
      linkedExpCount: routeItems.filter((i) => i.itemType === "experience").length,
      linkedProgCount: routeItems.filter((i) => i.itemType === "local_income_program").length,
    } as CourseUI;
  } catch (error) {
    console.warn(`Failed to fetch course ${slug} from DB:`, error);
    return undefined;
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/10 pb-24">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-screen-md items-center justify-between px-4">
          <Link href="/courses" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ChevronLeft className="mr-1 h-5 w-5" />
            추천 코스 목록
          </Link>
          <Link href="/" className="text-xs text-muted-foreground hover:underline">홈</Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-screen-md">
        <div className="relative">
          <CourseImage src={course.images?.[0]} alt={course.title} />
          <div className="absolute left-4 top-4 flex gap-2">
            {course.targetType && (
              <div className="rounded-lg bg-category-course px-3 py-1.5 text-[11px] font-bold text-white shadow-lg">
                {course.targetType}
              </div>
            )}
            {course.durationType && (
              <div className="rounded-lg bg-background/90 px-3 py-1.5 text-[11px] font-bold text-foreground shadow-lg backdrop-blur-sm">
                {course.durationType}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8 bg-background p-6">
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-category-course">
              <Compass className="h-4 w-4" />
              소원권역 추천 코스
            </div>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground md:text-3xl">
              {course.title}
            </h1>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {course.summary}
            </p>
          </section>

          {course.description && (
            <section className="rounded-2xl border bg-muted/20 p-5">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-foreground">
                <Info className="h-5 w-5 text-category-course" />
                코스 소개
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {course.description}
              </p>
            </section>
          )}

          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
              <Route className="h-5 w-5 text-category-course" />
              추천 일정표
            </h2>
            <CourseRoute items={course.routeItems} />
          </section>

          {course.routeItems.length > 0 && (
            <section className="rounded-2xl border bg-card p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-foreground">연결된 콘텐츠</h2>
              <CourseLinkedItems courseId={course.id} courseSlug={course.slug} items={course.routeItems} />
            </section>
          )}

          <CourseCTA itemId={course.id} itemSlug={course.slug} />
        </div>
      </main>
    </div>
  );
}
