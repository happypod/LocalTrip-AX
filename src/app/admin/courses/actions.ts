"use server";

import { getPrisma } from "@/lib/prisma";
import { PublishStatus, CourseItemType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";

export interface CourseItemData {
  itemType: CourseItemType;
  accommodationId?: string | null;
  experienceId?: string | null;
  localIncomeProgramId?: string | null;
  sortOrder: number;
  note?: string;
}

export interface CourseData {
  regionId: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  images?: string[];
  status: string;
  courseItems: CourseItemData[];
}

function normalizeRequiredText(value: string | undefined) {
  return value?.trim() ?? "";
}

async function validateCourseItems(regionId: string, status: string, courseItems: CourseItemData[]) {
  const prisma = getPrisma();
  for (const item of courseItems) {
    if (!["accommodation", "experience", "local_income_program"].includes(item.itemType)) {
      throw new Error(`유효하지 않은 코스 항목 타입입니다: ${item.itemType}`);
    }

    let targetId: string | undefined | null;
    let typeName = "";
    let target: { regionId: string; status: string; title: string } | null = null;

    if (item.itemType === "accommodation") {
      if (item.experienceId || item.localIncomeProgramId || !item.accommodationId) {
        throw new Error("숙소 타입은 accommodationId만 가져야 합니다.");
      }
      targetId = item.accommodationId;
      typeName = "숙소";
      if (targetId) {
        target = await prisma.accommodation.findUnique({ where: { id: targetId }, select: { regionId: true, status: true, title: true } });
      }
    } else if (item.itemType === "experience") {
      if (item.accommodationId || item.localIncomeProgramId || !item.experienceId) {
        throw new Error("체험 타입은 experienceId만 가져야 합니다.");
      }
      targetId = item.experienceId;
      typeName = "체험";
      if (targetId) {
        target = await prisma.experience.findUnique({ where: { id: targetId }, select: { regionId: true, status: true, title: true } });
      }
    } else if (item.itemType === "local_income_program") {
      if (item.accommodationId || item.experienceId || !item.localIncomeProgramId) {
        throw new Error("주민소득상품 타입은 localIncomeProgramId만 가져야 합니다.");
      }
      targetId = item.localIncomeProgramId;
      typeName = "주민소득상품";
      if (targetId) {
        target = await prisma.localIncomeProgram.findUnique({ where: { id: targetId }, select: { regionId: true, status: true, title: true } });
      }
    }

    if (!targetId) {
      throw new Error(`${typeName} 대상을 선택해주세요.`);
    }

    if (!target) {
      throw new Error(`선택한 ${typeName} 대상이 존재하지 않습니다.`);
    }

    if (target.regionId !== regionId) {
      throw new Error(`선택한 ${typeName}(${target.title})의 지역이 코스의 지역과 일치하지 않습니다.`);
    }

    if (status === "published" && target.status !== "published") {
      throw new Error(`코스를 공개하려면 포함된 모든 항목이 공개(published) 상태여야 합니다. (${target.title}는 ${target.status} 상태입니다.)`);
    }
  }
}

export async function createCourse(data: CourseData) {
  await requireAdminSession();
  const prisma = getPrisma();

  const title = normalizeRequiredText(data.title);
  const slug = normalizeRequiredText(data.slug).toLowerCase();
  const summary = normalizeRequiredText(data.summary);

  if (!title || !slug || !data.regionId || !summary) {
    throw new Error("필수 항목을 입력해주세요.");
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("슬러그는 소문자 알파벳, 숫자, 하이픈(-)만 사용할 수 있습니다.");
  }

  if (!["draft", "published", "inactive"].includes(data.status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  const region = await prisma.region.findUnique({ where: { id: data.regionId } });
  if (!region) throw new Error("존재하지 않는 지역입니다.");

  const existing = await prisma.course.findUnique({
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

  // CourseItems 검증
  await validateCourseItems(data.regionId, data.status, data.courseItems);

  const course = await prisma.$transaction(async (tx) => {
    const createdCourse = await tx.course.create({
      data: {
        regionId: data.regionId,
        title,
        slug,
        summary,
        description: data.description || null,
        images: data.images || [],
        status: data.status as PublishStatus,
      }
    });

    if (data.courseItems && data.courseItems.length > 0) {
      await tx.courseItem.createMany({
        data: data.courseItems.map(item => ({
          courseId: createdCourse.id,
          itemType: item.itemType as CourseItemType,
          accommodationId: item.accommodationId || null,
          experienceId: item.experienceId || null,
          localIncomeProgramId: item.localIncomeProgramId || null,
          sortOrder: item.sortOrder,
          note: item.note || null,
        }))
      });
    }

    return createdCourse;
  });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/");
  revalidatePath("/map");
  revalidatePath(`/courses/${course.slug}`);
  return course;
}

export async function updateCourse(id: string, data: Partial<CourseData>) {
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

  const existingCourse = await prisma.course.findUnique({ where: { id } });
  if (!existingCourse) throw new Error("코스를 찾을 수 없습니다.");

  const regionId = data.regionId || existingCourse.regionId;
  const statusToSave = data.status || existingCourse.status;

  if (data.regionId) {
    const region = await prisma.region.findUnique({ where: { id: data.regionId } });
    if (!region) throw new Error("존재하지 않는 지역입니다.");
  }

  if (slug && regionId) {
    const existing = await prisma.course.findFirst({
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

  if (data.courseItems) {
    await validateCourseItems(regionId, statusToSave, data.courseItems);
  }

  const course = await prisma.$transaction(async (tx) => {
    const updatedCourse = await tx.course.update({
      where: { id },
      data: {
        ...(data.regionId !== undefined && { regionId: data.regionId }),
        ...(data.title !== undefined && { title: data.title }),
        ...(slug !== undefined && { slug: slug }),
        ...(data.summary !== undefined && { summary: data.summary }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.images !== undefined && { images: data.images || [] }),
        ...(data.status !== undefined && { status: data.status as PublishStatus }),
      }
    });

    if (data.courseItems) {
      await tx.courseItem.deleteMany({
        where: { courseId: id }
      });

      if (data.courseItems.length > 0) {
        await tx.courseItem.createMany({
          data: data.courseItems.map(item => ({
            courseId: id,
            itemType: item.itemType as CourseItemType,
            accommodationId: item.accommodationId || null,
            experienceId: item.experienceId || null,
            localIncomeProgramId: item.localIncomeProgramId || null,
            sortOrder: item.sortOrder,
            note: item.note || null,
          }))
        });
      }
    }

    return updatedCourse;
  });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/");
  revalidatePath("/map");
  revalidatePath(`/courses/${existingCourse.slug}`);
  if (slug && slug !== existingCourse.slug) {
    revalidatePath(`/courses/${slug}`);
  }
  return course;
}

export async function updateCourseStatus(id: string, status: PublishStatus) {
  await requireAdminSession();
  const prisma = getPrisma();
  
  if (!["draft", "published", "inactive"].includes(status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  const existingCourse = await prisma.course.findUnique({ 
    where: { id },
    include: { courseItems: true }
  });
  
  if (!existingCourse) {
    throw new Error("코스를 찾을 수 없습니다.");
  }

  // 공개 상태로 변경 시 연결된 아이템 재검증
  if (status === "published") {
    // validateCourseItems needs an array of CourseItemData, we can map existing items
    const itemsData: CourseItemData[] = existingCourse.courseItems.map(i => ({
      itemType: i.itemType,
      accommodationId: i.accommodationId,
      experienceId: i.experienceId,
      localIncomeProgramId: i.localIncomeProgramId,
      sortOrder: i.sortOrder,
      note: i.note || undefined
    }));
    await validateCourseItems(existingCourse.regionId, status, itemsData);
  }

  const course = await prisma.course.update({
    where: { id },
    data: { status }
  });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/");
  revalidatePath("/map");
  revalidatePath(`/courses/${course.slug}`);
  return course;
}
