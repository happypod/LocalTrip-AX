import { AdminShell } from "@/components/admin/admin-shell";
import {
  PremiumPrApplicationList,
  type PremiumPrApplicationListItem,
} from "@/components/admin/premium-pr-applications/premium-pr-application-list";
import { requireAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";
import {
  createMessagePreview,
  maskEmail,
  maskName,
  maskPhone,
} from "@/lib/privacy";

export const dynamic = "force-dynamic";

const BUSINESS_TYPE = "premium_pr_production";

export default async function AdminPremiumPrApplicationsPage() {
  await requireAdminSession();

  const prisma = getPrisma();
  const applicationRows = await prisma.partnerApplication.findMany({
    where: {
      businessType: BUSINESS_TYPE,
      region: { slug: "sowon" },
    },
    orderBy: { createdAt: "desc" },
  });

  const applications: PremiumPrApplicationListItem[] = applicationRows.map(
    ({ message, applicantName, phone, email, ...application }) => ({
      ...application,
      applicantNameMasked: maskName(applicantName),
      phoneMasked: maskPhone(phone),
      emailMasked: maskEmail(email),
      messagePreview: createMessagePreview(message),
    })
  );

  return (
    <AdminShell title="프리미엄 PR 문의">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 py-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight">
            프리미엄 PR 문의
          </h1>
          <p className="text-sm text-muted-foreground">
            3D 투어, 호스트 영상, 드론 영상 등 제작대행 신청을 확인하고
            처리 상태를 관리합니다.
          </p>
        </div>

        <PremiumPrApplicationList applications={applications} />
      </div>
    </AdminShell>
  );
}
