import { AdminShell } from "@/components/admin/admin-shell";
import { StayForm } from "@/components/admin/stays/stay-form";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewStayPage() {
  const prisma = getPrisma();
  
  const [regions, businesses] = await Promise.all([
    prisma.region.findMany({
      where: { status: "published" },
      orderBy: { name: "asc" }
    }),
    prisma.businessProfile.findMany({
      where: { status: "published" },
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <AdminShell title="숙소 추가">
      <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">새 숙소 추가</h1>
          <p className="text-sm text-muted-foreground">
            새로운 숙소 정보를 등록합니다. 지역 선택은 필수입니다.
          </p>
        </div>
        
        <StayForm regions={regions} businesses={businesses} />
      </div>
    </AdminShell>
  );
}
