import { Metadata } from "next";
import { getPrisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { TrainingCourseList } from "@/components/admin/training/training-course-list";
import { CertificationList } from "@/components/admin/training/certification-list";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "교육 및 인증 관리 | LocalTrip AX",
};

export const dynamic = "force-dynamic";

export default async function AdminTrainingPage() {
  await requireAdminSession();

  const prisma = getPrisma();
  await prisma.$connect();

  const [courses, certifications] = await Promise.all([
    prisma.trainingCourse.findMany({
      include: { region: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.certification.findMany({
      include: { region: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <AdminShell title="교육·인증 관리">
      <div className="flex flex-col gap-10 py-6 max-w-7xl mx-auto">
        
        {/* Section 1: Training Courses */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">교육과정 관리</h2>
              <p className="text-sm text-gray-500 mt-1">
                지역 주민 및 사업자 대상의 로컬 비즈니스 역량 강화 교육과정을 관리합니다.
              </p>
            </div>
            <Link 
              href="/admin/training/courses/new"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              교육과정 등록
            </Link>
          </div>
          <TrainingCourseList courses={courses} />
        </div>

        {/* Section 2: Certifications */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-100 pt-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">인증항목 관리</h2>
              <p className="text-sm text-gray-500 mt-1">
                소원권역에서 발급하는 우수 품질 로컬 브랜드 및 공간 인증 내역을 관리합니다.
              </p>
            </div>
            <Link 
              href="/admin/training/certifications/new"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              인증항목 등록
            </Link>
          </div>
          <CertificationList certifications={certifications} />
        </div>

      </div>
    </AdminShell>
  );
}
