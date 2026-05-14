"use server";

import { requireAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";
import type { PremiumPrConfig } from "@/lib/premium-pr";
import {
  DEFAULT_PREMIUM_PR,
  isAllowedPremiumPrIframeUrl,
} from "@/lib/premium-pr";
import { PublishStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface StayData {
  regionId?: string;
  businessProfileId?: string;
  title?: string;
  slug?: string;
  summary?: string;
  category?: string;
  description?: string;
  address?: string;
  phone?: string;
  kakaoUrl?: string;
  naverBookingUrl?: string;
  websiteUrl?: string;
  priceText?: string;
  capacityText?: string;
  images?: string[];
  status?: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  mapAddress?: string | null;
  mapPlaceId?: string | null;
  mapProvider?: string | null;
  premiumPr?: {
    isPremium?: boolean;
    matterportUrl?: string;
    hostVideoUrl?: string;
    droneViewUrl?: string;
    badgeLabel?: string;
    packageName?: string;
    expiresAt?: string;
  };
}

const STAY_SLUG_PATTERN = /^[a-z0-9-]+$/;
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

function getStaySlug(value: string | undefined) {
  const slug = getRequiredString(value, "숙소 slug").toLowerCase();

  if (!STAY_SLUG_PATTERN.test(slug)) {
    throw new Error("숙소 slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
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

function getPremiumPrUrl(value: string | undefined, fieldName: string) {
  const url = getOptionalString(value);

  if (!url) {
    return null;
  }

  if (!isAllowedPremiumPrIframeUrl(url)) {
    throw new Error(
      `${fieldName}은 허용된 iframe URL만 입력할 수 있습니다. Matterport show, YouTube embed, YouTube nocookie embed, Vimeo player URL을 사용해 주세요.`
    );
  }

  return url;
}

function getPremiumPrInput(input: StayData["premiumPr"]): PremiumPrConfig {
  if (!input?.isPremium) {
    return DEFAULT_PREMIUM_PR;
  }

  const premiumPr: PremiumPrConfig = {
    isPremium: true,
    features: {
      matterportUrl: getPremiumPrUrl(input.matterportUrl, "Matterport URL"),
      hostVideoUrl: getPremiumPrUrl(input.hostVideoUrl, "호스트 영상 URL"),
      droneViewUrl: getPremiumPrUrl(input.droneViewUrl, "드론 영상 URL"),
    },
    display: {
      badgeLabel: getOptionalString(input.badgeLabel) ?? "3D 숙소 투어",
    },
    contract: {
      packageName: getOptionalString(input.packageName),
      expiresAt: getOptionalString(input.expiresAt),
    },
  };

  if (!Object.values(premiumPr.features).some(Boolean)) {
    throw new Error(
      "프리미엄 PR을 적용하려면 Matterport, 호스트 영상, 드론 영상 중 하나 이상의 URL을 입력해 주세요."
    );
  }

  if (
    premiumPr.contract.expiresAt &&
    !/^\d{4}-\d{2}-\d{2}$/.test(premiumPr.contract.expiresAt)
  ) {
    throw new Error("프리미엄 PR 노출 종료일은 YYYY-MM-DD 형식이어야 합니다.");
  }

  return premiumPr;
}

import { parseMapFields } from "@/lib/admin-map-input";

function getStayInput(data: StayData) {
  const mapData = parseMapFields(data);

  return {
    regionId: getRequiredString(data.regionId, "지역"),
    businessProfileId: getOptionalString(data.businessProfileId),
    title: getRequiredString(data.title, "숙소명"),
    slug: getStaySlug(data.slug),
    summary: getRequiredString(data.summary, "요약"),
    category: getOptionalString(data.category),
    description: getOptionalString(data.description),
    address: getOptionalString(data.address),
    phone: getOptionalString(data.phone),
    kakaoUrl: getOptionalString(data.kakaoUrl),
    naverBookingUrl: getOptionalString(data.naverBookingUrl),
    websiteUrl: getOptionalString(data.websiteUrl),
    priceText: getOptionalString(data.priceText),
    capacityText: getOptionalString(data.capacityText),
    images: getImages(data.images),
    premiumPr: getPremiumPrInput(data.premiumPr),
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
    throw new Error("숙소 지역과 사업자 프로필 지역이 일치해야 합니다.");
  }
}

function revalidateStayPaths(slug: string, previousSlug?: string) {
  revalidatePath("/admin/stays");
  revalidatePath("/");
  revalidatePath("/stays");
  revalidatePath("/map");
  revalidatePath(`/stays/${slug}`);

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/stays/${previousSlug}`);
  }
}

export async function createStay(data: StayData) {
  await requireAdminSession();

  const prisma = getPrisma();
  const input = getStayInput(data);

  await assertRegionAndBusinessProfile(prisma, input.regionId, input.businessProfileId);

  const existing = await prisma.accommodation.findUnique({
    where: {
      regionId_slug: {
        regionId: input.regionId,
        slug: input.slug,
      },
    },
  });

  if (existing) {
    throw new Error("이미 사용 중인 숙소 slug입니다.");
  }

  const stay = await prisma.accommodation.create({
    data: input,
  });

  revalidateStayPaths(stay.slug);
  return stay;
}

export async function updateStay(id: string, data: StayData) {
  await requireAdminSession();

  const prisma = getPrisma();
  const input = getStayInput(data);

  await assertRegionAndBusinessProfile(prisma, input.regionId, input.businessProfileId);

  const previousStay = await prisma.accommodation.findUnique({
    where: { id },
    select: { slug: true },
  });

  if (!previousStay) {
    throw new Error("수정할 숙소를 찾을 수 없습니다.");
  }

  const existing = await prisma.accommodation.findFirst({
    where: {
      regionId: input.regionId,
      slug: input.slug,
      id: { not: id },
    },
  });

  if (existing) {
    throw new Error("이미 사용 중인 숙소 slug입니다.");
  }

  const stay = await prisma.accommodation.update({
    where: { id },
    data: input,
  });

  revalidateStayPaths(stay.slug, previousStay.slug);
  return stay;
}

export async function updateStayStatus(id: string, status: PublishStatus) {
  await requireAdminSession();

  if (!PUBLISH_STATUSES.includes(status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  const prisma = getPrisma();
  const stay = await prisma.accommodation.update({
    where: { id },
    data: { status },
  });

  revalidateStayPaths(stay.slug);
  return stay;
}
