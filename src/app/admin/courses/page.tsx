import { Metadata } from "next";
import { getPrisma } from "@/lib/prisma";
import { CourseList } from "@/components/admin/courses/course-list";
import { requireAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "추천 코스 관리 | LocalTrip AX",
};

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  await requireAdminSession();
  
  const prisma = getPrisma();
  await prisma.$connect();

  const courses = await prisma.course.findMany({
    include: {
      region: true,
      courseItems: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell title="추천 코스 관리">
      <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">추천 코스 관리</h1>
            <p className="text-sm text-gray-500 mt-1">
              소원권역 내 숙소, 체험, 주민소득상품을 엮은 추천 코스를 관리합니다.
            </p>
          </div>
          <Link 
            href="/admin/courses/new"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            새 코스 등록
          </Link>
        </div>

        <CourseList courses={courses} />
      </div>
    </AdminShell>
  );
}
