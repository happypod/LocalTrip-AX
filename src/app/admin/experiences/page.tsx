import { getPrisma } from "@/lib/prisma";
import { ExperienceList } from "@/components/admin/experiences/experience-list";
import { AdminShell } from "@/components/admin/admin-shell";
import Link from "next/link";
import { requireAdminSession } from "@/lib/admin-auth";


export const dynamic = "force-dynamic";

export default async function AdminExperiencesPage() {
  await requireAdminSession();
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
    <AdminShell title="체험 관리">
      <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">체험 관리</h1>
            <p className="text-sm text-muted-foreground">
              플랫폼에 등록된 지역 체험 프로그램을 관리합니다.
            </p>
          </div>
          <Link 
            href="/admin/experiences/new"
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            새 체험 등록
          </Link>
        </div>

        <ExperienceList experiences={experiences} />
      </div>
    </AdminShell>
  );
}
