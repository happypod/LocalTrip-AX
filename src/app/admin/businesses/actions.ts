"use server";

import { requireAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";
import { PublishStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

const PUBLISH_STATUSES: PublishStatus[] = ["draft", "published", "inactive"];
const BUSINESS_TYPES = ["accommodation", "experience_host", "local_creator", "fnb", "retail"] as const;

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, key: string) {
  const value = getRequiredString(formData, key);
  return value || null;
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

function getBusinessType(formData: FormData) {
  const businessType = getRequiredString(formData, "businessType");

  if (!businessType) {
    throw new Error("사업자 유형은 필수입니다.");
  }

  if (!BUSINESS_TYPES.includes(businessType as (typeof BUSINESS_TYPES)[number])) {
    throw new Error("유효하지 않은 사업자 유형입니다.");
  }

  return businessType;
}

async function assertRegionExists(regionId: string) {
  const prisma = getPrisma();
  const region = await prisma.region.findUnique({
    where: { id: regionId },
    select: { id: true },
  });

  if (!region) {
    throw new Error("유효한 지역을 선택해 주세요.");
  }
}

export async function createBusiness(formData: FormData) {
  await requireAdminSession();

  const prisma = getPrisma();
  const regionId = getRequiredString(formData, "regionId");
  const name = getRequiredString(formData, "name");
  const businessType = getBusinessType(formData);
  const ownerName = getOptionalString(formData, "ownerName");
  const phone = getOptionalString(formData, "phone");
  const kakaoUrl = getOptionalString(formData, "kakaoUrl");
  const naverBookingUrl = getOptionalString(formData, "naverBookingUrl");
  const websiteUrl = getOptionalString(formData, "websiteUrl");
  const address = getOptionalString(formData, "address");
  const description = getOptionalString(formData, "description");
  const status = getPublishStatus(formData);

  if (!regionId || !name) {
    throw new Error("지역과 사업자/업체명은 필수입니다.");
  }

  await assertRegionExists(regionId);

  await prisma.businessProfile.create({
    data: {
      regionId,
      name,
      businessType,
      ownerName,
      phone,
      kakaoUrl,
      naverBookingUrl,
      websiteUrl,
      address,
      description,
      status,
    },
  });

  revalidatePath("/admin/businesses");
}

export async function updateBusiness(id: string, formData: FormData) {
  await requireAdminSession();

  const prisma = getPrisma();
  const regionId = getRequiredString(formData, "regionId");
  const name = getRequiredString(formData, "name");
  const businessType = getBusinessType(formData);
  const ownerName = getOptionalString(formData, "ownerName");
  const phone = getOptionalString(formData, "phone");
  const kakaoUrl = getOptionalString(formData, "kakaoUrl");
  const naverBookingUrl = getOptionalString(formData, "naverBookingUrl");
  const websiteUrl = getOptionalString(formData, "websiteUrl");
  const address = getOptionalString(formData, "address");
  const description = getOptionalString(formData, "description");
  const status = getPublishStatus(formData);

  if (!regionId || !name) {
    throw new Error("지역과 사업자/업체명은 필수입니다.");
  }

  await assertRegionExists(regionId);

  await prisma.businessProfile.update({
    where: { id },
    data: {
      regionId,
      name,
      businessType,
      ownerName,
      phone,
      kakaoUrl,
      naverBookingUrl,
      websiteUrl,
      address,
      description,
      status,
    },
  });

  revalidatePath("/admin/businesses");
  revalidatePath(`/admin/businesses/${id}/edit`);
}

export async function updateBusinessStatus(id: string, status: PublishStatus) {
  await requireAdminSession();

  if (!PUBLISH_STATUSES.includes(status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  const prisma = getPrisma();

  await prisma.businessProfile.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/businesses");
}
