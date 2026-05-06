import { Metadata } from "next";
import { getPrisma } from "@/lib/prisma";
import { EventList } from "@/components/admin/events/event-list";
import { requireAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "이벤트 관리 | LocalTrip AX",
};

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await requireAdminSession();
  
  const prisma = getPrisma();
  await prisma.$connect();

  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell title="이벤트 관리">
      <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">이벤트 관리</h1>
            <p className="text-sm text-gray-500 mt-1">
              메인페이지의 슬라이스형 배너에 노출될 이벤트를 추가하고 수정합니다.
            </p>
          </div>
          <Link 
            href="/admin/events/new"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            새 이벤트 등록
          </Link>
        </div>

        <EventList events={events} />
      </div>
    </AdminShell>
  );
}
