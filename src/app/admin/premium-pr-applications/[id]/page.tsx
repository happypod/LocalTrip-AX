import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { PremiumPrApplicationDetail } from "@/components/admin/premium-pr-applications/premium-pr-application-detail";
import { requireAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const BUSINESS_TYPE = "premium_pr_production";

interface AdminPremiumPrApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPremiumPrApplicationDetailPage({
  params,
}: AdminPremiumPrApplicationDetailPageProps) {
  await requireAdminSession();

  const { id } = await params;
  const prisma = getPrisma();
  const application = await prisma.partnerApplication.findFirst({
    where: {
      id,
      businessType: BUSINESS_TYPE,
      region: { slug: "sowon" },
    },
    include: { region: true },
  });

  if (!application) {
    notFound();
  }

  return (
    <AdminShell title="프리미엄 PR 문의 상세">
      <div className="py-6">
        <PremiumPrApplicationDetail application={application} />
      </div>
    </AdminShell>
  );
}
