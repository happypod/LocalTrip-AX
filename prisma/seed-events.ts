import "dotenv/config";

import { PublishStatus } from "@prisma/client";
import { getPrisma } from "../src/lib/prisma";

const events = [
  {
    tag: "소원권역 주말 기획",
    title: "바다마을 체험 주간",
    subTitle: "숙소와 체험을 함께 살펴보는 연결형 혜택",
    description:
      "이번 주말 소원권역 숙소, 체험, 주민소득상품을 한 흐름으로 둘러보고 여행 계획을 잡아보세요.",
    gradient: "from-blue-50 to-indigo-100/40",
    href: "/experiences",
    status: PublishStatus.published,
  },
  {
    tag: "소원 별미 안내",
    title: "주민소득상품 집중 소개",
    subTitle: "마을 사람들이 직접 준비하는 로컬의 맛",
    description:
      "주민이 운영하는 밥상, 소금, 감태, 새우 프로그램을 한눈에 확인할 수 있는 안내입니다.",
    gradient: "from-amber-50 to-yellow-100/40",
    href: "/programs",
    status: PublishStatus.published,
  },
  {
    tag: "추천 코스",
    title: "추천 코스 미리보기",
    subTitle: "숙소, 체험, 별미를 잇는 당일·반나절 동선",
    description:
      "소원권역의 공개 콘텐츠를 조합해 만든 대표 추천 코스를 확인하고 방문 목적에 맞게 골라보세요.",
    gradient: "from-teal-50 to-emerald-100/40",
    href: "/courses",
    status: PublishStatus.published,
  },
  {
    tag: "참여 혜택",
    title: "소원 로컬 혜택 모음",
    subTitle: "체험, 별미, 지도 코스를 함께 보는 운영 안내",
    description:
      "방문 전 확인하면 좋은 참여 소식과 시즌 혜택을 모았습니다. 실제 예약·결제 할인 확정이 아닌 문의·연결 안내입니다.",
    gradient: "from-rose-50 to-pink-100/40",
    href: "/events",
    status: PublishStatus.published,
  },
] as const;

async function main() {
  const prisma = getPrisma();

  const region = await prisma.region.findUnique({
    where: { slug: "sowon" },
    select: { id: true, name: true },
  });

  if (!region) {
    throw new Error("기본 권역(sowon)을 찾을 수 없습니다.");
  }

  let created = 0;
  let updated = 0;

  for (const event of events) {
    const existing = await prisma.event.findFirst({
      where: {
        regionId: region.id,
        title: event.title,
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.event.update({
        where: { id: existing.id },
        data: event,
      });
      updated += 1;
      continue;
    }

    await prisma.event.create({
      data: {
        ...event,
        regionId: region.id,
      },
    });
    created += 1;
  }

  const publishedEvents = await prisma.event.count({
    where: {
      regionId: region.id,
      status: PublishStatus.published,
    },
  });

  console.log(
    JSON.stringify(
      {
        region: region.name,
        created,
        updated,
        publishedEvents,
      },
      null,
      2
    )
  );

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
