import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { StayList } from "@/components/admin/stays/stay-list";
import { getPrisma } from "@/lib/prisma";
import { Accommodation, Region, BusinessProfile } from "@prisma/client";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminStaysPage() {
  await requireAdminSession();
  const prisma = getPrisma();
  let stays: (Accommodation & { region: Region; businessProfile: BusinessProfile | null })[] = [];
  let error = null;

  try {
    stays = await prisma.accommodation.findMany({
      include: {
        region: true,
        businessProfile: true,
      },
      orderBy: { createdAt: "desc" }
    });
  } catch {
    error = "숙소 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }

  return (
    <AdminShell title="숙소 관리">
      <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">숙소 관리</h1>
            <p className="text-sm text-muted-foreground">
              플랫폼에 등록된 숙소 정보를 관리합니다.
            </p>
          </div>
          <Link 
            href="/admin/stays/new"
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            새 숙소 추가
          </Link>
        </div>

        {error ? (
          <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100">
            {error}
          </div>
        ) : (
          <StayList stays={stays} />
        )}
      </div>
    </AdminShell>
  );
}
