import { getPrisma } from "@/lib/prisma";
import { InquiryDetail } from "@/components/admin/inquiries/inquiry-detail";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/admin-auth";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface InquiryDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminInquiryDetailPage({ params }: InquiryDetailPageProps) {
  await requireAdminSession();
  const { id } = await params;

  const prisma = getPrisma();
  const sowonRegion = await prisma.region.findUnique({
    where: { slug: "sowon" },
    select: { id: true },
  });

  if (!sowonRegion) {
    notFound();
  }

  const inquiry = await prisma.inquiry.findFirst({
    where: {
      id,
      regionId: sowonRegion.id,
    },
    include: {
      region: true,
    },
  });

  if (!inquiry) {
    notFound();
  }

  return (
    <AdminShell title="일반 문의 상세">
      <div className="py-6">
        <InquiryDetail inquiry={inquiry} />
      </div>
    </AdminShell>
  );
}
