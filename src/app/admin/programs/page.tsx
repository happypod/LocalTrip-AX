import { getPrisma } from "@/lib/prisma";
import { ProgramList } from "@/components/admin/programs/program-list";
import { AdminShell } from "@/components/admin/admin-shell";
import Link from "next/link";


export const dynamic = "force-dynamic";

export default async function AdminProgramsPage() {
  const prisma = getPrisma();
  const programs = await prisma.localIncomeProgram.findMany({
    include: {
      region: true,
      businessProfile: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <AdminShell title="주민소득상품 관리">
      <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">주민소득상품 관리</h1>
            <p className="text-sm text-muted-foreground">지역 주민과 연계된 주민소득상품을 관리합니다.</p>
          </div>
          <Link 
            href="/admin/programs/new"
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            새 주민소득상품 등록
          </Link>
        </div>

        <ProgramList programs={programs} />
      </div>
    </AdminShell>
  );
}
