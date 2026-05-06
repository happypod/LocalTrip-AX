import { getPrisma } from "@/lib/prisma";
import { PartnerApplicationDetail } from "@/components/admin/partner-applications/partner-application-detail";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/admin-auth";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PartnerApplicationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminPartnerApplicationDetailPage({ params }: PartnerApplicationDetailPageProps) {
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

  const application = await prisma.partnerApplication.findFirst({
    where: {
      id,
      regionId: sowonRegion.id,
    },
    include: {
      region: true,
    },
  });

  if (!application) {
    notFound();
  }

  return (
    <AdminShell title="입점신청 상세">
      <div className="py-6">
        <PartnerApplicationDetail application={application} />
      </div>
    </AdminShell>
  );
}
