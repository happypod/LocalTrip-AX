import { Metadata } from "next";
import { getPrisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { TrainingCourseForm } from "@/components/admin/training/training-course-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "교육과정 등록 | LocalTrip AX",
};

export const dynamic = "force-dynamic";

export default async function NewTrainingCoursePage() {
  await requireAdminSession();

  const prisma = getPrisma();
  await prisma.$connect();

  const regions = await prisma.region.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <AdminShell title="교육과정 등록">
      <div className="flex flex-col gap-6 py-6 w-full max-w-xl mx-auto">
        <div className="flex flex-col gap-2 border-b pb-4">
          <Link 
            href="/admin/training" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2 w-fit"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            교육·인증 목록으로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">교육과정 등록</h1>
          <p className="text-sm text-gray-500">
            새로운 비즈니스 및 로컬 인재 역량 강화 교육과정을 생성합니다.
          </p>
        </div>

        <TrainingCourseForm regions={regions} />
      </div>
    </AdminShell>
  );
}
