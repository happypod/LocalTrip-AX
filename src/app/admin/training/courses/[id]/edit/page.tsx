import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { TrainingCourseForm } from "@/components/admin/training/training-course-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TranslationForm } from "@/components/admin/translations/translation-form";

export const metadata: Metadata = {
  title: "교육과정 수정 | LocalTrip AX",
};

export const dynamic = "force-dynamic";

interface EditTrainingCoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTrainingCoursePage({ params }: EditTrainingCoursePageProps) {
  await requireAdminSession();
  const { id } = await params;

  const prisma = getPrisma();
  await prisma.$connect();

  const [course, regions, translations] = await Promise.all([
    prisma.trainingCourse.findUnique({
      where: { id },
    }),
    prisma.region.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.contentTranslation.findMany({
      where: { targetType: "training_course", targetId: id }
    })
  ]);

  if (!course) {
    notFound();
  }

  const initialData = {
    id: course.id,
    regionId: course.regionId,
    title: course.title,
    summary: course.summary || undefined,
    status: course.status,
  };

  return (
    <AdminShell title="교육과정 수정">
      <div className="flex flex-col gap-6 py-6 w-full max-w-xl mx-auto">
        <div className="flex flex-col gap-2 border-b pb-4">
          <Link 
            href="/admin/training" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2 w-fit"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            교육·인증 목록으로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">교육과정 수정</h1>
          <p className="text-sm text-gray-500">
            기존 비즈니스 교육과정 정보를 안전하게 수정합니다.
          </p>
        </div>

        <TrainingCourseForm initialData={initialData} regions={regions} />

        <TranslationForm
          targetType="training_course"
          targetId={course.id}
          originalData={{
            title: course.title,
            summary: course.summary,
            description: null,
          }}
          existingTranslations={translations.reduce((acc, t) => {
            acc[t.locale] = { title: t.title, summary: t.summary, description: t.description };
            return acc;
          }, {} as Record<string, { title: string | null; summary: string | null; description: string | null }>)}
        />
      </div>
    </AdminShell>
  );
}
