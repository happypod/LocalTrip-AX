import { getPrisma } from "@/lib/prisma";
import { ExperienceForm } from "@/components/admin/experiences/experience-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
  const prisma = getPrisma();
  
  const [experience, regions, businesses] = await Promise.all([
    prisma.experience.findUnique({
      where: { id: params.id }
    }),
    prisma.region.findMany({ orderBy: { name: "asc" } }),
    prisma.businessProfile.findMany({ orderBy: { name: "asc" } })
  ]);

  if (!experience) {
    notFound();
  }

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/experiences" 
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          목록으로 돌아가기
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">체험 수정</h1>
          <p className="text-gray-500 mt-1">등록된 체험 정보를 수정합니다.</p>
        </div>
      </div>

      <ExperienceForm 
        initialData={experience}
        regions={regions} 
        businesses={businesses} 
      />
    </div>
  );
}
