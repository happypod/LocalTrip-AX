"use server";

import { getPrisma } from "@/lib/prisma";
import { PublishStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";

interface ProgramData {
  regionId: string;
  businessProfileId?: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  linkedLifeService: string;
  residentRole: string;
  revenueUse: string;
  location?: string;
  priceText?: string;
  images?: string[];
  phone?: string;
  kakaoUrl?: string;
  naverBookingUrl?: string;
  websiteUrl?: string;
  status: string;
}

function normalizeRequiredText(value: string | undefined) {
  return value?.trim() ?? "";
}

export async function createProgram(data: ProgramData) {
  await requireAdminSession();
  const prisma = getPrisma();

  const title = normalizeRequiredText(data.title);
  const slug = normalizeRequiredText(data.slug).toLowerCase();
  const summary = normalizeRequiredText(data.summary);
  const linkedLifeService = normalizeRequiredText(data.linkedLifeService);
  const residentRole = normalizeRequiredText(data.residentRole);
  const revenueUse = normalizeRequiredText(data.revenueUse);

  if (!title || !slug || !data.regionId || !summary || !linkedLifeService || !residentRole || !revenueUse) {
    throw new Error("필수 항목을 입력해주세요.");
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("슬러그는 소문자 알파벳, 숫자, 하이픈(-)만 사용할 수 있습니다.");
  }

  // Allowed statuses
  if (!["draft", "published", "inactive"].includes(data.status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  // Validate Region
  const region = await prisma.region.findUnique({ where: { id: data.regionId } });
  if (!region) throw new Error("존재하지 않는 지역입니다.");

  // Validate Business Profile
  if (data.businessProfileId) {
    const bp = await prisma.businessProfile.findUnique({ where: { id: data.businessProfileId } });
    if (!bp) throw new Error("선택한 사업자 프로필이 존재하지 않습니다.");
    if (bp.regionId !== data.regionId) throw new Error("사업자 프로필의 지역이 상품 지역과 일치하지 않습니다.");
  }

  const existing = await prisma.localIncomeProgram.findUnique({
    where: {
      regionId_slug: {
        regionId: data.regionId,
        slug: slug,
      }
    }
  });

  if (existing) {
    throw new Error("이미 사용 중인 슬러그입니다.");
  }

  const program = await prisma.localIncomeProgram.create({
    data: {
      regionId: data.regionId,
      businessProfileId: data.businessProfileId || null,
      title,
      slug: slug,
      summary,
      description: data.description || null,
      linkedLifeService,
      residentRole,
      revenueUse,
      location: data.location || null,
      priceText: data.priceText || null,
      images: data.images || [],
      phone: data.phone || null,
      kakaoUrl: data.kakaoUrl || null,
      naverBookingUrl: data.naverBookingUrl || null,
      websiteUrl: data.websiteUrl || null,
      status: data.status as PublishStatus,
    }
  });

  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  revalidatePath("/");
  revalidatePath("/map");
  revalidatePath(`/programs/${program.slug}`);
  return program;
}

export async function updateProgram(id: string, data: Partial<ProgramData>) {
  await requireAdminSession();
  const prisma = getPrisma();
  
  let slug = data.slug;
  if (slug) {
    slug = slug.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(slug)) {
      throw new Error("슬러그는 소문자 알파벳, 숫자, 하이픈(-)만 사용할 수 있습니다.");
    }
  }

  if (data.status && !["draft", "published", "inactive"].includes(data.status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  // We need to fetch the existing program to know its regionId if data.regionId is not provided
  const existingProgram = await prisma.localIncomeProgram.findUnique({ where: { id } });
  if (!existingProgram) throw new Error("상품을 찾을 수 없습니다.");

  const regionId = data.regionId || existingProgram.regionId;

  if (data.regionId) {
    const region = await prisma.region.findUnique({ where: { id: data.regionId } });
    if (!region) throw new Error("존재하지 않는 지역입니다.");
  }

  // Validate Business Profile if provided or if region changed
  const businessProfileId = data.businessProfileId !== undefined ? data.businessProfileId : existingProgram.businessProfileId;
  if (businessProfileId) {
    const bp = await prisma.businessProfile.findUnique({ where: { id: businessProfileId } });
    if (!bp) throw new Error("선택한 사업자 프로필이 존재하지 않습니다.");
    if (bp.regionId !== regionId) throw new Error("사업자 프로필의 지역이 상품 지역과 일치하지 않습니다.");
  }

  if (slug && regionId) {
    const existing = await prisma.localIncomeProgram.findFirst({
      where: {
        regionId: regionId,
        slug: slug,
        id: { not: id }
      }
    });

    if (existing) {
      throw new Error("이미 사용 중인 슬러그입니다.");
    }
  }

  const program = await prisma.localIncomeProgram.update({
    where: { id },
    data: {
      ...(data.regionId !== undefined && { regionId: data.regionId }),
      ...(data.businessProfileId !== undefined && { businessProfileId: data.businessProfileId || null }),
      ...(data.title !== undefined && { title: data.title }),
      ...(slug !== undefined && { slug: slug }),
      ...(data.summary !== undefined && { summary: data.summary }),
      ...(data.description !== undefined && { description: data.description || null }),
      ...(data.linkedLifeService !== undefined && { linkedLifeService: data.linkedLifeService }),
      ...(data.residentRole !== undefined && { residentRole: data.residentRole }),
      ...(data.revenueUse !== undefined && { revenueUse: data.revenueUse }),
      ...(data.location !== undefined && { location: data.location || null }),
      ...(data.priceText !== undefined && { priceText: data.priceText || null }),
      ...(data.images !== undefined && { images: data.images || [] }),
      ...(data.phone !== undefined && { phone: data.phone || null }),
      ...(data.kakaoUrl !== undefined && { kakaoUrl: data.kakaoUrl || null }),
      ...(data.naverBookingUrl !== undefined && { naverBookingUrl: data.naverBookingUrl || null }),
      ...(data.websiteUrl !== undefined && { websiteUrl: data.websiteUrl || null }),
      ...(data.status !== undefined && { status: data.status as PublishStatus }),
    }
  });

  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  revalidatePath("/");
  revalidatePath("/map");
  revalidatePath(`/programs/${existingProgram.slug}`);
  revalidatePath(`/programs/${program.slug}`);
  return program;
}

export async function updateProgramStatus(id: string, status: PublishStatus) {
  await requireAdminSession();
  const prisma = getPrisma();
  
  if (!["draft", "published", "inactive"].includes(status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  const program = await prisma.localIncomeProgram.update({
    where: { id },
    data: { status }
  });

  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  revalidatePath("/");
  revalidatePath("/map");
  revalidatePath(`/programs/${program.slug}`);
  return program;
}
