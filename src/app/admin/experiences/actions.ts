"use server";

import { getPrisma } from "@/lib/prisma";
import { PublishStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface ExperienceData {
  regionId: string;
  businessProfileId?: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  location?: string;
  phone?: string;
  kakaoUrl?: string;
  naverBookingUrl?: string;
  websiteUrl?: string;
  priceText?: string;
  capacityText?: string;
  durationText?: string;
  images?: string[];
  status: string;
}

export async function createExperience(data: ExperienceData) {
  const prisma = getPrisma();
  
  if (!data.title || !data.slug || !data.regionId) {
    throw new Error("필수 항목을 입력해주세요. (지역, 체험명, 슬러그)");
  }

  const existing = await prisma.experience.findUnique({
    where: {
      regionId_slug: {
        regionId: data.regionId,
        slug: data.slug,
      }
    }
  });

  if (existing) {
    throw new Error("이미 사용 중인 슬러그입니다.");
  }

  const experience = await prisma.experience.create({
    data: {
      regionId: data.regionId,
      businessProfileId: data.businessProfileId || null,
      title: data.title,
      slug: data.slug,
      summary: data.summary || "",
      description: data.description || null,
      location: data.location || null,
      phone: data.phone || null,
      kakaoUrl: data.kakaoUrl || null,
      naverBookingUrl: data.naverBookingUrl || null,
      websiteUrl: data.websiteUrl || null,
      priceText: data.priceText || null,
      capacityText: data.capacityText || null,
      durationText: data.durationText || null,
      images: data.images || [],
      status: data.status as PublishStatus,
    }
  });

  revalidatePath("/admin/experiences");
  revalidatePath("/experiences");
  return experience;
}

export async function updateExperience(id: string, data: Partial<ExperienceData>) {
  const prisma = getPrisma();
  
  if (data.slug && data.regionId) {
    const existing = await prisma.experience.findFirst({
      where: {
        regionId: data.regionId,
        slug: data.slug,
        id: { not: id }
      }
    });

    if (existing) {
      throw new Error("이미 사용 중인 슬러그입니다.");
    }
  }

  const experience = await prisma.experience.update({
    where: { id },
    data: {
      regionId: data.regionId,
      businessProfileId: data.businessProfileId || null,
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      description: data.description || null,
      location: data.location || null,
      phone: data.phone || null,
      kakaoUrl: data.kakaoUrl || null,
      naverBookingUrl: data.naverBookingUrl || null,
      websiteUrl: data.websiteUrl || null,
      priceText: data.priceText || null,
      capacityText: data.capacityText || null,
      durationText: data.durationText || null,
      images: data.images || [],
      status: data.status as PublishStatus,
    }
  });

  revalidatePath("/admin/experiences");
  revalidatePath("/experiences");
  revalidatePath(`/experiences/${experience.slug}`);
  return experience;
}

export async function updateExperienceStatus(id: string, status: PublishStatus) {
  const prisma = getPrisma();
  const experience = await prisma.experience.update({
    where: { id },
    data: { status }
  });

  revalidatePath("/admin/experiences");
  revalidatePath("/experiences");
  revalidatePath(`/experiences/${experience.slug}`);
  return experience;
}
