"use server";

import { requireAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";
import { PublishStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

const REGION_SLUG_PATTERN = /^[a-z0-9-]+$/;
const PUBLISH_STATUSES: PublishStatus[] = ["draft", "published", "inactive"];

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, key: string) {
  const value = getRequiredString(formData, key);
  return value || null;
}

function getRegionSlug(formData: FormData) {
  const slug = getRequiredString(formData, "slug").toLowerCase();

  if (!slug) {
    throw new Error("지역 slug는 필수입니다.");
  }

  if (!REGION_SLUG_PATTERN.test(slug)) {
    throw new Error("지역 slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
  }

  return slug;
}

function getPublishStatus(formData: FormData) {
  const status = getRequiredString(formData, "status") as PublishStatus;

  if (!status) {
    return "draft";
  }

  if (!PUBLISH_STATUSES.includes(status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  return status;
}

export async function createRegion(formData: FormData) {
  await requireAdminSession();

  const prisma = getPrisma();
  const name = getRequiredString(formData, "name");
  const slug = getRegionSlug(formData);
  const description = getOptionalString(formData, "description");
  const status = getPublishStatus(formData);

  if (!name) {
    throw new Error("지역명은 필수입니다.");
  }

  const existing = await prisma.region.findUnique({
    where: { slug },
  });

  if (existing) {
    throw new Error("이미 존재하는 slug입니다.");
  }

  await prisma.region.create({
    data: {
      name,
      slug,
      description,
      status,
    },
  });

  revalidatePath("/admin/regions");
}

export async function updateRegion(id: string, formData: FormData) {
  await requireAdminSession();

  const prisma = getPrisma();
  const name = getRequiredString(formData, "name");
  const slug = getRegionSlug(formData);
  const description = getOptionalString(formData, "description");
  const status = getPublishStatus(formData);

  if (!name) {
    throw new Error("지역명은 필수입니다.");
  }

  const existing = await prisma.region.findUnique({
    where: { slug },
  });

  if (existing && existing.id !== id) {
    throw new Error("이미 존재하는 slug입니다.");
  }

  await prisma.region.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      status,
    },
  });

  revalidatePath("/admin/regions");
  revalidatePath(`/admin/regions/${id}/edit`);
}

export async function updateRegionStatus(id: string, status: PublishStatus) {
  await requireAdminSession();

  if (!PUBLISH_STATUSES.includes(status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  const prisma = getPrisma();

  await prisma.region.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/regions");
}
