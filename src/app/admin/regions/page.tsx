import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { RegionList } from "@/components/admin/regions/region-list";
import { getPrisma } from "@/lib/prisma";
import { Region } from "@prisma/client";
import { requireAdminSession } from "@/lib/admin-auth";

export const revalidate = 0;

export default async function AdminRegionsPage() {
  await requireAdminSession();
  const prisma = getPrisma();
  let regions: Region[] = [];
  let error = null;

  try {
    regions = await prisma.region.findMany({
      orderBy: { createdAt: "desc" }
    });
  } catch {
    error = "데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }

  return (
    <AdminShell title="지역 관리">
      <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">지역(Region) 관리</h1>
            <p className="text-sm text-muted-foreground">
              플랫폼에 표시될 권역(지역) 정보를 관리합니다.
            </p>
          </div>
          <Link 
            href="/admin/regions/new"
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            새 지역 추가
          </Link>
        </div>

        {error ? (
          <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100">
            {error}
          </div>
        ) : (
          <RegionList regions={regions} />
        )}
      </div>
    </AdminShell>
  );
}
