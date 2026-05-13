import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { CourseForm } from "@/components/admin/courses/course-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { TranslationForm } from "@/components/admin/translations/translation-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "추천 코스 수정 | LocalTrip AX",
};

export const dynamic = "force-dynamic";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;

  const prisma = getPrisma();
  await prisma.$connect();

  const [course, regions, accommodations, experiences, programs, translations] = await Promise.all([
    prisma.course.findUnique({
      where: { id },
      include: {
        courseItems: true,
      },
    }),
    prisma.region.findMany({ orderBy: { name: "asc" } }),
    prisma.accommodation.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true, regionId: true, status: true },
    }),
    prisma.experience.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true, regionId: true, status: true },
    }),
    prisma.localIncomeProgram.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true, regionId: true, status: true },
    }),
    prisma.contentTranslation.findMany({
      where: { targetType: "course", targetId: id },
    }),
  ]);

  if (!course) {
    notFound();
  }

  const initialData = {
    id: course.id,
    regionId: course.regionId,
    title: course.title,
    slug: course.slug,
    summary: course.summary,
    description: course.description || undefined,
    targetType: course.targetType || undefined,
    durationType: course.durationType || undefined,
    season: course.season || undefined,
    status: course.status,
    images: course.images,
    courseItems: course.courseItems.map((item) => ({
      itemType: item.itemType,
      accommodationId: item.accommodationId,
      experienceId: item.experienceId,
      localIncomeProgramId: item.localIncomeProgramId,
      sortOrder: item.sortOrder,
      note: item.note || undefined,
    })),
  };

  const existingTranslations = translations.reduce(
    (acc, translation) => {
      acc[translation.locale] = {
        title: translation.title,
        summary: translation.summary,
        description: translation.description,
      };
      return acc;
    },
    {} as Record<string, { title: string | null; summary: string | null; description: string | null }>,
  );

  return (
    <AdminShell title="추천 코스 수정">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-6">
        <div className="flex flex-col gap-2 border-b pb-4">
          <Link
            href="/admin/courses"
            className="mb-2 inline-flex w-fit items-center text-sm text-gray-500 hover:text-gray-900"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            코스 목록으로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">추천 코스 수정</h1>
          <p className="text-sm text-gray-500">
            기존 코스의 기본 정보와 숙소·체험·주민소득상품 연결을 수정합니다.
          </p>
        </div>

        <CourseForm
          initialData={initialData}
          regions={regions}
          accommodations={accommodations}
          experiences={experiences}
          programs={programs}
        />

        <TranslationForm
          targetType="course"
          targetId={course.id}
          originalData={{
            title: course.title,
            summary: course.summary,
            description: course.description,
          }}
          existingTranslations={existingTranslations}
        />
      </div>
    </AdminShell>
  );
}
