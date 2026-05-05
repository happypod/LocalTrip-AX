import { AdminShell } from "@/components/admin/admin-shell";
import { RegionForm } from "@/components/admin/regions/region-form";
import { getPrisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditRegionPage({ params }: { params: { id: string } }) {
  const prisma = getPrisma();
  
  const region = await prisma.region.findUnique({
    where: { id: params.id }
  });

  if (!region) {
    notFound();
  }

  return (
    <AdminShell title="지역 수정">
      <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">지역 정보 수정</h1>
          <p className="text-sm text-muted-foreground">
            권역(지역) 정보를 수정합니다.
          </p>
        </div>
        
        <RegionForm initialData={region} />
      </div>
    </AdminShell>
  );
}
