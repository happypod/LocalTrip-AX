import { AdminShell } from "@/components/admin/admin-shell";
import { BusinessForm } from "@/components/admin/businesses/business-form";
import { getPrisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prisma = getPrisma();
  
  const [business, regions] = await Promise.all([
    prisma.businessProfile.findUnique({ where: { id } }),
    prisma.region.findMany({ orderBy: { name: "asc" } })
  ]);

  if (!business) {
    notFound();
  }

  return (
    <AdminShell title="사업자 수정">
      <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">사업자 정보 수정</h1>
          <p className="text-sm text-muted-foreground">
            사업자/운영자 프로필 정보를 수정합니다.
          </p>
        </div>
        
        <BusinessForm initialData={business} regions={regions} />
      </div>
    </AdminShell>
  );
}
