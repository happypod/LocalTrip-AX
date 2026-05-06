import { getPrisma } from "@/lib/prisma";
import { InquiryList } from "@/components/admin/inquiries/inquiry-list";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/admin-auth";
import { createMessagePreview } from "@/lib/privacy";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  await requireAdminSession();

  const prisma = getPrisma();

  const sowonRegion = await prisma.region.findUnique({
    where: { slug: "sowon" },
  });

  if (!sowonRegion) {
    return (
      <AdminShell title="일반 문의 관리">
        <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
          <div className="p-6 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl">
            소원 권역(sowon)이 등록되지 않아 문의 내역을 불러올 수 없습니다. 지역 관리를 확인해 주세요.
          </div>
        </div>
      </AdminShell>
    );
  }

  const inquiryRows = await prisma.inquiry.findMany({
    where: {
      regionId: sowonRegion.id,
    },
    include: {
      region: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const inquiries = inquiryRows.map(({ message, ...inquiry }) => ({
    ...inquiry,
    messagePreview: createMessagePreview(message),
  }));

  return (
    <AdminShell title="일반 문의 관리">
      <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">일반 문의 관리</h1>
          <p className="text-sm text-muted-foreground">소원 권역을 통해 접수된 일반 고객 상담 및 문의 내역을 처리하고 관리합니다.</p>
        </div>

        <InquiryList inquiries={inquiries} />
      </div>
    </AdminShell>
  );
}
