import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getPrisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { EventList } from "@/components/admin/events/event-list";

export const metadata: Metadata = {
  title: "이벤트 관리 | LocalTrip AX",
};

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await requireAdminSession();

  const prisma = getPrisma();
  await prisma.$connect();

  const sowonRegion = await prisma.region.findUnique({
    where: { slug: "sowon" },
    select: { id: true },
  });

  const events = sowonRegion
    ? await prisma.event.findMany({
        where: { regionId: sowonRegion.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <AdminShell title="이벤트 관리">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 py-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">이벤트 관리</h1>
            <p className="mt-1 text-sm text-gray-500">
              소원권역 홈과 이벤트 화면에 노출할 운영 소식을 관리합니다.
            </p>
          </div>
          <Link
            href="/admin/events/new"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            새 이벤트 등록
          </Link>
        </div>

        {!sowonRegion && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
            기본 권역(sowon)이 없어 이벤트를 조회할 수 없습니다.
          </div>
        )}

        <EventList events={events} />
      </div>
    </AdminShell>
  );
}
