import { AdminShell } from "@/components/admin/admin-shell";
import { StayForm } from "@/components/admin/stays/stay-form";
import { getPrisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditStayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prisma = getPrisma();
  
  const [stay, regions, businesses] = await Promise.all([
    prisma.accommodation.findUnique({ where: { id } }),
    prisma.region.findMany({ orderBy: { name: "asc" } }),
    prisma.businessProfile.findMany({ orderBy: { name: "asc" } })
  ]);

  if (!stay) {
    notFound();
  }

  return (
    <AdminShell title="숙소 수정">
      <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">숙소 정보 수정</h1>
          <p className="text-sm text-muted-foreground">
            숙소 기본 정보, 설명, 노출 여부 등을 수정합니다.
          </p>
        </div>
        
        <StayForm initialData={stay} regions={regions} businesses={businesses} />
      </div>
    </AdminShell>
  );
}
