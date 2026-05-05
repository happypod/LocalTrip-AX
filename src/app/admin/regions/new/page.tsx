import { AdminShell } from "@/components/admin/admin-shell";
import { RegionForm } from "@/components/admin/regions/region-form";

export const dynamic = "force-dynamic";

export default function NewRegionPage() {
  return (
    <AdminShell title="지역 추가">
      <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">새 지역 추가</h1>
          <p className="text-sm text-muted-foreground">
            새로운 권역(지역) 정보를 등록합니다.
          </p>
        </div>
        
        <RegionForm />
      </div>
    </AdminShell>
  );
}
