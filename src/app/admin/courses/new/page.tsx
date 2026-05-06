import { Metadata } from "next";
import { getPrisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { CourseForm } from "@/components/admin/courses/course-form";
import { AdminShell } from "@/components/admin/admin-shell";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "새 코스 등록 | LocalTrip AX",
};

export const dynamic = "force-dynamic";

export default async function NewCoursePage() {
  await requireAdminSession();
  
  const prisma = getPrisma();
  await prisma.$connect();

  const [regions, accommodations, experiences, programs] = await Promise.all([
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

  return (
    <AdminShell title="새 코스 등록">
      <div className="flex flex-col gap-6 py-6 w-full max-w-4xl mx-auto">
        <div className="flex flex-col gap-2 border-b pb-4">
          <Link 
            href="/admin/courses" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2 w-fit"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            코스 목록으로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">새 추천 코스 등록</h1>
          <p className="text-sm text-gray-500">
            숙소, 체험, 주민소득상품을 조합하여 새로운 추천 코스를 생성합니다.
          </p>
        </div>

        <CourseForm 
          regions={regions} 
          accommodations={accommodations} 
          experiences={experiences} 
          programs={programs} 
        />
      </div>
    </AdminShell>
  );
}
