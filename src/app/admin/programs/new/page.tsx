import { getPrisma } from "@/lib/prisma";
import { ProgramForm } from "@/components/admin/programs/program-form";
import { AdminShell } from "@/components/admin/admin-shell";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewProgramPage() {
  const prisma = getPrisma();
  
  const regions = await prisma.region.findMany({
    orderBy: { createdAt: "asc" }
  });

  const businesses = await prisma.businessProfile.findMany({
    orderBy: { createdAt: "asc" }
  });

  return (
    <AdminShell title="주민소득상품 등록">
      <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <Link 
            href="/admin/programs"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors w-fit"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>목록으로 돌아가기</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">새 주민소득상품 등록</h1>
            <p className="text-gray-500 mt-1">플랫폼에 노출될 새로운 주민소득상품을 등록합니다.</p>
          </div>
        </div>

        <ProgramForm 
          regions={regions}
          businesses={businesses}
        />
      </div>
    </AdminShell>
  );
}
