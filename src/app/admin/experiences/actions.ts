"use server";

import { requireAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";
import { PublishStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface ExperienceData {
  regionId?: string;
  businessProfileId?: string;
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  category?: string;
  location?: string;
  phone?: string;
  kakaoUrl?: string;
  naverBookingUrl?: string;
  websiteUrl?: string;
  priceText?: string;
  capacityText?: string;
  durationText?: string;
  images?: string[];
  status?: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  mapAddress?: string | null;
  mapPlaceId?: string | null;
  mapProvider?: string | null;
}

const EXPERIENCE_SLUG_PATTERN = /^[a-z0-9-]+$/;
const PUBLISH_STATUSES: PublishStatus[] = [
  PublishStatus.draft,
  PublishStatus.published,
  PublishStatus.inactive,
];

function getRequiredString(value: string | undefined, fieldName: string) {
  const trimmed = typeof value === "string" ? value.trim() : "";

  if (!trimmed) {
    throw new Error(`${fieldName}은 필수입니다.`);
  }

  return trimmed;
}

function getOptionalString(value: string | undefined) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || null;
}

function getExperienceSlug(value: string | undefined) {
  const slug = getRequiredString(value, "체험 slug").toLowerCase();

  if (!EXPERIENCE_SLUG_PATTERN.test(slug)) {
    throw new Error("체험 slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
  }

  return slug;
}

function getPublishStatus(value: string | undefined) {
  const status = getRequiredString(value, "상태") as PublishStatus;

  if (!PUBLISH_STATUSES.includes(status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  return status;
}

function getImages(images: string[] | undefined) {
  return (images ?? []).map((image) => image.trim()).filter(Boolean);
}

import { parseMapFields } from "@/lib/admin-map-input";

function getExperienceInput(data: ExperienceData) {
  const mapData = parseMapFields(data);

  return {
    regionId: getRequiredString(data.regionId, "지역"),
    businessProfileId: getOptionalString(data.businessProfileId),
    title: getRequiredString(data.title, "체험명"),
    slug: getExperienceSlug(data.slug),
    summary: getRequiredString(data.summary, "요약"),
    description: getOptionalString(data.description),
    category: getOptionalString(data.category),
    location: getOptionalString(data.location),
    phone: getOptionalString(data.phone),
    kakaoUrl: getOptionalString(data.kakaoUrl),
    naverBookingUrl: getOptionalString(data.naverBookingUrl),
    websiteUrl: getOptionalString(data.websiteUrl),
    priceText: getOptionalString(data.priceText),
    capacityText: getOptionalString(data.capacityText),
    durationText: getOptionalString(data.durationText),
    images: getImages(data.images),
    status: getPublishStatus(data.status),
    ...mapData,
  };
}

async function assertRegionAndBusinessProfile(
  prisma: ReturnType<typeof getPrisma>,
  regionId: string,
  businessProfileId: string | null,
) {
  const region = await prisma.region.findUnique({
    where: { id: regionId },
    select: { id: true },
  });

  if (!region) {
    throw new Error("유효한 지역을 선택해 주세요.");
  }

  if (!businessProfileId) {
    return;
  }

  const businessProfile = await prisma.businessProfile.findUnique({
    where: { id: businessProfileId },
    select: { regionId: true },
  });

  if (!businessProfile) {
    throw new Error("유효한 사업자 프로필을 선택해 주세요.");
  }

  if (businessProfile.regionId !== regionId) {
    throw new Error("체험 지역과 사업자 프로필 지역이 일치해야 합니다.");
  }
}

function revalidateExperiencePaths(slug: string, previousSlug?: string) {
  revalidatePath("/admin/experiences");
  revalidatePath("/");
  revalidatePath("/experiences");
  revalidatePath("/map");
  revalidatePath(`/experiences/${slug}`);

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/experiences/${previousSlug}`);
  }
}

export async function createExperience(data: ExperienceData) {
  await requireAdminSession();

  const prisma = getPrisma();
  const input = getExperienceInput(data);

  await assertRegionAndBusinessProfile(prisma, input.regionId, input.businessProfileId);

  const existing = await prisma.experience.findUnique({
    where: {
      regionId_slug: {
        regionId: input.regionId,
        slug: input.slug,
      }
    }
  });

  if (existing) {
    throw new Error("이미 사용 중인 슬러그입니다.");
  }

  const experience = await prisma.experience.create({
    data: input,
  });

  revalidateExperiencePaths(experience.slug);
  return experience;
}

export async function updateExperience(id: string, data: ExperienceData) {
  await requireAdminSession();

  const prisma = getPrisma();
  const input = getExperienceInput(data);

  await assertRegionAndBusinessProfile(prisma, input.regionId, input.businessProfileId);

  const previousExperience = await prisma.experience.findUnique({
    where: { id },
    select: { slug: true },
  });

  if (!previousExperience) {
    throw new Error("수정할 체험을 찾을 수 없습니다.");
  }

  const existing = await prisma.experience.findFirst({
    where: {
      regionId: input.regionId,
      slug: input.slug,
      id: { not: id }
    }
  });

  if (existing) {
    throw new Error("이미 사용 중인 슬러그입니다.");
  }

  const experience = await prisma.experience.update({
    where: { id },
    data: input,
  });

  revalidateExperiencePaths(experience.slug, previousExperience.slug);
  return experience;
}

export async function updateExperienceStatus(id: string, status: PublishStatus) {
  await requireAdminSession();

  if (!PUBLISH_STATUSES.includes(status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  const prisma = getPrisma();
  const experience = await prisma.experience.update({
    where: { id },
    data: { status }
  });

  revalidateExperiencePaths(experience.slug);
  return experience;
}
