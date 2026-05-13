import { getPrisma } from "@/lib/prisma";
import { ExperienceForm } from "@/components/admin/experiences/experience-form";
import { AdminShell } from "@/components/admin/admin-shell";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { TranslationForm } from "@/components/admin/translations/translation-form";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const prisma = getPrisma();
  
  const [experience, regions, businesses, translations] = await Promise.all([
    prisma.experience.findUnique({
      where: { id }
    }),
    prisma.region.findMany({ orderBy: { name: "asc" } }),
    prisma.businessProfile.findMany({ orderBy: { name: "asc" } }),
    prisma.contentTranslation.findMany({ where: { targetType: "experience", targetId: id } })
  ]);

  if (!experience) {
    notFound();
  }

  return (
    <AdminShell title="체험 수정">
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
            <h1 className="text-2xl font-bold text-gray-900">체험 수정</h1>
            <p className="text-gray-500 mt-1">등록된 체험 정보를 수정합니다.</p>
          </div>
        </div>

        <ExperienceForm 
          initialData={experience}
          regions={regions} 
          businesses={businesses} 
        />

        <TranslationForm
          targetType="experience"
          targetId={experience.id}
          originalData={{
            title: experience.title,
            summary: experience.summary,
            description: experience.description,
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
