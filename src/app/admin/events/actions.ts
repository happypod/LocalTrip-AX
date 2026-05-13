"use server";

import { revalidatePath } from "next/cache";
import { PublishStatus } from "@prisma/client";
import { requireAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

type PrismaClientInstance = ReturnType<typeof getPrisma>;

const PUBLISH_STATUSES: PublishStatus[] = [
  PublishStatus.draft,
  PublishStatus.published,
  PublishStatus.inactive,
];

const DEFAULT_GRADIENT = "from-blue-50 to-indigo-100/40";

const GRADIENT_PRESETS = new Set([
  DEFAULT_GRADIENT,
  "from-emerald-50 to-teal-100/40",
  "from-amber-50 to-orange-100/40",
  "from-rose-50 to-pink-100/40",
  "from-violet-50 to-purple-100/40",
  "from-slate-50 to-zinc-100/40",
]);

const EVENT_HREFS = new Set([
  "/stays",
  "/experiences",
  "/programs",
  "/courses",
  "/map",
  "/partner/apply",
  "/events",
  "/customer-center",
]);

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

function normalizeOptionalText(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

function assertPublishStatus(status: string): asserts status is PublishStatus {
  if (!PUBLISH_STATUSES.includes(status as PublishStatus)) {
    throw new Error("유효하지 않은 공개 상태입니다.");
  }
}

function normalizeHref(value: string | undefined) {
  const href = normalizeOptionalText(value, "/stays");
  if (!EVENT_HREFS.has(href)) {
    throw new Error("허용되지 않은 이벤트 이동 경로입니다.");
  }
  return href;
}

function normalizeGradient(value: string | undefined) {
  const gradient = normalizeOptionalText(value, DEFAULT_GRADIENT);
  if (!GRADIENT_PRESETS.has(gradient)) {
    throw new Error("허용되지 않은 이벤트 배경값입니다.");
  }
  return gradient;
}

function assertNonEmptyUpdatedText(fieldLabel: string, value: string) {
  if (!value) {
    throw new Error(`${fieldLabel}을(를) 입력해 주세요.`);
  }
}

function revalidateEventPaths() {
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
}

async function getSowonRegionId(prisma: PrismaClientInstance) {
  const region = await prisma.region.findUnique({
    where: { slug: "sowon" },
    select: { id: true },
  });

  if (!region) {
    throw new Error("기본 권역(sowon)을 찾을 수 없습니다.");
  }

  return region.id;
}

async function assertSowonEvent(prisma: PrismaClientInstance, id: string) {
  const regionId = await getSowonRegionId(prisma);
  const event = await prisma.event.findFirst({
    where: { id, regionId },
    select: { id: true },
  });

  if (!event) {
    throw new Error("이벤트를 찾을 수 없습니다.");
  }

  return event;
}

export async function createEvent(data: EventData) {
  await requireAdminSession();
  const prisma = getPrisma();
  const regionId = await getSowonRegionId(prisma);

  const tag = normalizeRequiredText(data.tag);
  const title = normalizeRequiredText(data.title);
  const subTitle = normalizeRequiredText(data.subTitle);
  const description = normalizeRequiredText(data.description);

  if (!tag || !title || !subTitle || !description) {
    throw new Error("필수 항목을 모두 입력해 주세요.");
  }

  assertPublishStatus(data.status);

  const event = await prisma.event.create({
    data: {
      regionId,
      tag,
      title,
      subTitle,
      description,
      gradient: normalizeGradient(data.gradient),
      status: data.status,
      href: normalizeHref(data.href),
    },
  });

  revalidateEventPaths();
  return event;
}

export async function updateEvent(id: string, data: Partial<EventData>) {
  await requireAdminSession();
  const prisma = getPrisma();

  await assertSowonEvent(prisma, id);

  if (data.status !== undefined) {
    assertPublishStatus(data.status);
  }

  const tag = data.tag !== undefined ? normalizeRequiredText(data.tag) : undefined;
  const title =
    data.title !== undefined ? normalizeRequiredText(data.title) : undefined;
  const subTitle =
    data.subTitle !== undefined ? normalizeRequiredText(data.subTitle) : undefined;
  const description =
    data.description !== undefined
      ? normalizeRequiredText(data.description)
      : undefined;

  if (tag !== undefined) assertNonEmptyUpdatedText("태그", tag);
  if (title !== undefined) assertNonEmptyUpdatedText("제목", title);
  if (subTitle !== undefined) assertNonEmptyUpdatedText("서브 제목", subTitle);
  if (description !== undefined) assertNonEmptyUpdatedText("설명", description);

  const event = await prisma.event.update({
    where: { id },
    data: {
      ...(tag !== undefined && { tag }),
      ...(title !== undefined && { title }),
      ...(subTitle !== undefined && { subTitle }),
      ...(description !== undefined && { description }),
      ...(data.gradient !== undefined && {
        gradient: normalizeGradient(data.gradient),
      }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.href !== undefined && { href: normalizeHref(data.href) }),
    },
  });

  revalidateEventPaths();
  return event;
}

export async function updateEventStatus(id: string, status: PublishStatus) {
  await requireAdminSession();
  const prisma = getPrisma();

  assertPublishStatus(status);
  await assertSowonEvent(prisma, id);

  const event = await prisma.event.update({
    where: { id },
    data: { status },
  });

  revalidateEventPaths();
  return event;
}

export async function deleteEvent(id: string) {
  await requireAdminSession();
  const prisma = getPrisma();

  await assertSowonEvent(prisma, id);
  await prisma.event.delete({ where: { id } });

  revalidateEventPaths();
}
