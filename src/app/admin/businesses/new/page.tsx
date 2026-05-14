import { AdminShell } from "@/components/admin/admin-shell";
import { BusinessForm } from "@/components/admin/businesses/business-form";
import { getPrisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function NewBusinessPage() {
  await requireAdminSession();
  const prisma = getPrisma();
  
  const regions = await prisma.region.findMany({
    where: { status: "published" },
    orderBy: { name: "asc" }
  });

  return (
    <AdminShell title="사업자 추가">
      <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">새 사업자 추가</h1>
          <p className="text-sm text-muted-foreground">
            새로운 사업자/운영자 프로필을 등록합니다. (반드시 지역 선택 필요)
          </p>
        </div>
        
        <BusinessForm regions={regions} />
      </div>
    </AdminShell>
  );
}
