"use server";

import { getPrisma } from "@/lib/prisma";
import { PublishStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";

export interface EventData {
  tag: string;
  title: string;
  subTitle: string;
  description: string;
  gradient?: string;
  status: string;
  href?: string;
}

function normalizeRequiredText(value: string | undefined) {
  return value?.trim() ?? "";
}

export async function createEvent(data: EventData) {
  await requireAdminSession();
  const prisma = getPrisma();

  const tag = normalizeRequiredText(data.tag);
  const title = normalizeRequiredText(data.title);
  const subTitle = normalizeRequiredText(data.subTitle);
  const description = normalizeRequiredText(data.description);

  if (!tag || !title || !subTitle || !description) {
    throw new Error("필수 항목을 모두 입력해주세요.");
  }

  if (!["draft", "published", "inactive"].includes(data.status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  const event = await prisma.event.create({
    data: {
      tag,
      title,
      subTitle,
      description,
      gradient: data.gradient || "from-blue-50 to-indigo-100/40",
      status: data.status as PublishStatus,
      href: data.href || "/stays",
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/");
  return event;
}

export async function updateEvent(id: string, data: Partial<EventData>) {
  await requireAdminSession();
  const prisma = getPrisma();

  const existingEvent = await prisma.event.findUnique({ where: { id } });
  if (!existingEvent) throw new Error("이벤트를 찾을 수 없습니다.");

  if (data.status && !["draft", "published", "inactive"].includes(data.status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  const event = await prisma.event.update({
    where: { id },
    data: {
      ...(data.tag !== undefined && { tag: data.tag }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.subTitle !== undefined && { subTitle: data.subTitle }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.gradient !== undefined && { gradient: data.gradient }),
      ...(data.status !== undefined && { status: data.status as PublishStatus }),
      ...(data.href !== undefined && { href: data.href }),
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/");
  return event;
}

export async function updateEventStatus(id: string, status: PublishStatus) {
  await requireAdminSession();
  const prisma = getPrisma();

  if (!["draft", "published", "inactive"].includes(status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  const event = await prisma.event.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/events");
  revalidatePath("/");
  return event;
}

export async function deleteEvent(id: string) {
  await requireAdminSession();
  const prisma = getPrisma();

  await prisma.event.delete({ where: { id } });

  revalidatePath("/admin/events");
  revalidatePath("/");
}
