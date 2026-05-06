import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { CourseForm } from "@/components/admin/courses/course-form";
import { AdminShell } from "@/components/admin/admin-shell";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "코스 수정 | LocalTrip AX",
};

export const dynamic = "force-dynamic";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  
  const prisma = getPrisma();
  await prisma.$connect();

  const [course, regions, accommodations, experiences, programs] = await Promise.all([
    prisma.course.findUnique({
      where: { id },
      include: {
        courseItems: true,
      }
    }),
    prisma.region.findMany({ orderBy: { name: "asc" } }),
    prisma.accommodation.findMany({ 
      orderBy: { title: "asc" },
      select: { id: true, title: true, regionId: true, status: true }
    }),
    prisma.experience.findMany({ 
      orderBy: { title: "asc" },
      select: { id: true, title: true, regionId: true, status: true }
    }),
    prisma.localIncomeProgram.findMany({ 
      orderBy: { title: "asc" },
      select: { id: true, title: true, regionId: true, status: true }
    }),
  ]);

  if (!course) {
    notFound();
  }

  // CourseData 포맷으로 변환
  const initialData = {
    id: course.id,
    regionId: course.regionId,
    title: course.title,
    slug: course.slug,
    summary: course.summary,
    description: course.description || undefined,
    status: course.status,
    images: course.images,
    courseItems: course.courseItems.map(item => ({
      itemType: item.itemType,
      accommodationId: item.accommodationId,
      experienceId: item.experienceId,
      localIncomeProgramId: item.localIncomeProgramId,
      sortOrder: item.sortOrder,
      note: item.note || undefined,
    }))
  };

  return (
    <AdminShell title="코스 수정">
      <div className="flex flex-col gap-6 py-6 w-full max-w-4xl mx-auto">
        <div className="flex flex-col gap-2 border-b pb-4">
          <Link 
            href="/admin/courses" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2 w-fit"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            코스 목록으로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">추천 코스 수정</h1>
          <p className="text-sm text-gray-500">
            기존 코스의 정보 및 구성을 수정합니다.
          </p>
        </div>

        <CourseForm 
          initialData={initialData}
          regions={regions} 
          accommodations={accommodations} 
          experiences={experiences} 
          programs={programs} 
        />
      </div>
    </AdminShell>
  );
}
