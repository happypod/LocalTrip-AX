import { getPrisma } from "@/lib/prisma";
import { ExperienceForm } from "@/components/admin/experiences/experience-form";
import { AdminShell } from "@/components/admin/admin-shell";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function NewExperiencePage() {
  await requireAdminSession();
  const prisma = getPrisma();
  const [regions, businesses] = await Promise.all([
    prisma.region.findMany({ orderBy: { name: "asc" } }),
    prisma.businessProfile.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <AdminShell title="체험 등록">
      <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <Link 
            href="/admin/experiences" 
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-fit"
          >
            <ChevronLeft className="w-4 h-4" />
            목록으로 돌아가기
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">새 체험 등록</h1>
            <p className="text-gray-500 mt-1">소원권역의 새로운 체험 프로그램을 등록합니다.</p>
          </div>
        </div>

        <ExperienceForm 
          regions={regions} 
          businesses={businesses} 
        />
      </div>
    </AdminShell>
  );
}
