"use server";

import { getPrisma } from "@/lib/prisma";
import { PublishStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";

export interface TrainingCourseData {
  regionId: string;
  title: string;
  summary?: string;
  status: string;
}

export interface CertificationData {
  regionId: string;
  title: string;
  summary?: string;
  status: string;
}

function normalizeRequiredText(value: string | undefined) {
  return value?.trim() ?? "";
}

function normalizeOptionalText(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed !== "" ? trimmed : null;
}

export async function createTrainingCourse(data: TrainingCourseData) {
  await requireAdminSession();
  const prisma = getPrisma();

  const title = normalizeRequiredText(data.title);
  const summary = normalizeOptionalText(data.summary);

  if (!title) {
    throw new Error("제목을 입력해주세요.");
  }
  if (!data.regionId) {
    throw new Error("권역을 선택해주세요.");
  }

  if (!["draft", "published", "inactive"].includes(data.status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  // Validate Region
  const region = await prisma.region.findUnique({ where: { id: data.regionId } });
  if (!region) {
    throw new Error("존재하지 않는 지역입니다.");
  }

  const course = await prisma.trainingCourse.create({
    data: {
      regionId: data.regionId,
      title,
      summary,
      status: data.status as PublishStatus,
    },
  });

  revalidatePath("/admin/training");
  revalidatePath("/admin");
  return course;
}

export async function updateTrainingCourse(id: string, data: TrainingCourseData) {
  await requireAdminSession();
  const prisma = getPrisma();

  const title = normalizeRequiredText(data.title);
  const summary = normalizeOptionalText(data.summary);

  if (!title) {
    throw new Error("제목을 입력해주세요.");
  }
  if (!data.regionId) {
    throw new Error("권역을 선택해주세요.");
  }

  if (!["draft", "published", "inactive"].includes(data.status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  // Validate Region
  const region = await prisma.region.findUnique({ where: { id: data.regionId } });
  if (!region) {
    throw new Error("존재하지 않는 지역입니다.");
  }

  const course = await prisma.trainingCourse.update({
    where: { id },
    data: {
      regionId: data.regionId,
      title,
      summary,
      status: data.status as PublishStatus,
    },
  });

  revalidatePath("/admin/training");
  revalidatePath("/admin");
  return course;
}

export async function updateTrainingCourseStatus(id: string, status: string) {
  await requireAdminSession();
  const prisma = getPrisma();

  if (!["draft", "published", "inactive"].includes(status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  const course = await prisma.trainingCourse.update({
    where: { id },
    data: {
      status: status as PublishStatus,
    },
  });

  revalidatePath("/admin/training");
  revalidatePath("/admin");
  return course;
}

export async function createCertification(data: CertificationData) {
  await requireAdminSession();
  const prisma = getPrisma();

  const title = normalizeRequiredText(data.title);
  const summary = normalizeOptionalText(data.summary);

  if (!title) {
    throw new Error("제목을 입력해주세요.");
  }
  if (!data.regionId) {
    throw new Error("권역을 선택해주세요.");
  }

  if (!["draft", "published", "inactive"].includes(data.status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  // Validate Region
  const region = await prisma.region.findUnique({ where: { id: data.regionId } });
  if (!region) {
    throw new Error("존재하지 않는 지역입니다.");
  }

  const cert = await prisma.certification.create({
    data: {
      regionId: data.regionId,
      title,
      summary,
      status: data.status as PublishStatus,
    },
  });

  revalidatePath("/admin/training");
  revalidatePath("/admin");
  return cert;
}

export async function updateCertification(id: string, data: CertificationData) {
  await requireAdminSession();
  const prisma = getPrisma();

  const title = normalizeRequiredText(data.title);
  const summary = normalizeOptionalText(data.summary);

  if (!title) {
    throw new Error("제목을 입력해주세요.");
  }
  if (!data.regionId) {
    throw new Error("권역을 선택해주세요.");
  }

  if (!["draft", "published", "inactive"].includes(data.status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  // Validate Region
  const region = await prisma.region.findUnique({ where: { id: data.regionId } });
  if (!region) {
    throw new Error("존재하지 않는 지역입니다.");
  }

  const cert = await prisma.certification.update({
    where: { id },
    data: {
      regionId: data.regionId,
      title,
      summary,
      status: data.status as PublishStatus,
    },
  });

  revalidatePath("/admin/training");
  revalidatePath("/admin");
  return cert;
}

export async function updateCertificationStatus(id: string, status: string) {
  await requireAdminSession();
  const prisma = getPrisma();

  if (!["draft", "published", "inactive"].includes(status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  const cert = await prisma.certification.update({
    where: { id },
    data: {
      status: status as PublishStatus,
    },
  });

  revalidatePath("/admin/training");
  revalidatePath("/admin");
  return cert;
}
