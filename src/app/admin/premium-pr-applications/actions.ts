"use server";

import { InquiryStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

const BUSINESS_TYPE = "premium_pr_production";
const ALLOWED_STATUSES: InquiryStatus[] = [
  "new",
  "in_progress",
  "resolved",
  "archived",
];

export async function updatePremiumPrApplicationStatus(
  id: string,
  status: string
) {
  await requireAdminSession();

  if (!ALLOWED_STATUSES.includes(status as InquiryStatus)) {
    throw new Error(`허용되지 않은 상태 값입니다: ${status}`);
  }

  const prisma = getPrisma();
  const application = await prisma.partnerApplication.findFirst({
    where: {
      id,
      businessType: BUSINESS_TYPE,
      region: { slug: "sowon" },
    },
    select: { id: true },
  });

  if (!application) {
    throw new Error("대상 프리미엄 PR 제작 문의를 찾을 수 없습니다.");
  }

  await prisma.partnerApplication.update({
    where: { id },
    data: { status: status as InquiryStatus },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/premium-pr-applications");
  revalidatePath(`/admin/premium-pr-applications/${id}`);

  return { success: true };
}
