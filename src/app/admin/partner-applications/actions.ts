"use server";

import { getPrisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { InquiryStatus } from "@prisma/client";

export async function updatePartnerApplicationStatus(id: string, status: string) {
  await requireAdminSession();

  const allowedStatuses: string[] = ["new", "in_progress", "resolved", "archived"];
  if (!allowedStatuses.includes(status)) {
    throw new Error(`허용되지 않은 상태 값입니다: ${status}`);
  }

  const prisma = getPrisma();

  const application = await prisma.partnerApplication.findUnique({
    where: { id },
    include: { region: true },
  });

  if (!application) {
    throw new Error("대상 입점신청이 존재하지 않습니다.");
  }

  if (application.region.slug !== "sowon") {
    throw new Error("소원 권역의 데이터만 수정할 수 있습니다.");
  }

  await prisma.partnerApplication.update({
    where: { id },
    data: {
      status: status as InquiryStatus,
    },
  });

  revalidatePath("/admin/partner-applications");
  revalidatePath(`/admin/partner-applications/${id}`);
  revalidatePath("/admin");

  return { success: true };
}
