import { getPrisma } from "@/lib/prisma";
import { ExperienceList } from "@/components/admin/experiences/experience-list";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminExperiencesPage() {
  const prisma = getPrisma();
  const experiences = await prisma.experience.findMany({
    include: {
      region: true,
      businessProfile: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">체험 관리</h1>
          <p className="text-gray-500 mt-1">플랫폼에 등록된 지역 체험 프로그램을 관리합니다.</p>
        </div>
        <Link 
          href="/admin/experiences/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-sm w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>새 체험 등록</span>
        </Link>
      </div>

      <ExperienceList experiences={experiences} />
    </div>
  );
}
