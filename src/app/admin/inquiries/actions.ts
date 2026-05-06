"use server";

import { getPrisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { InquiryStatus } from "@prisma/client";

export async function updateInquiryStatus(id: string, status: string) {
  await requireAdminSession();

  const allowedStatuses: string[] = ["new", "in_progress", "resolved", "archived"];
  if (!allowedStatuses.includes(status)) {
    throw new Error(`허용되지 않은 상태 값입니다: ${status}`);
  }

  const prisma = getPrisma();

  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: { region: true },
  });

  if (!inquiry) {
    throw new Error("대상 문의가 존재하지 않습니다.");
  }

  if (inquiry.region.slug !== "sowon") {
    throw new Error("소원 권역의 데이터만 수정할 수 있습니다.");
  }

  await prisma.inquiry.update({
    where: { id },
    data: {
      status: status as InquiryStatus,
    },
  });

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath("/admin");

  return { success: true };
}
