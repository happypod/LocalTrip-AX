import { Metadata } from "next";
import { getPrisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { EventForm } from "@/components/admin/events/event-form";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "이벤트 수정 | LocalTrip AX",
};

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

type EventFormInitialEvent = Parameters<typeof EventForm>[0]["initialEvent"];

type EventDelegate = {
  findUnique(args: { where: { id: string } }): Promise<EventFormInitialEvent>;
};

export const dynamic = "force-dynamic";

export default async function AdminEditEventPage({ params }: EditEventPageProps) {
  await requireAdminSession();
  
  const { id } = await params;
  const prisma = getPrisma();
  await prisma.$connect();
  const prismaWithEvent = prisma as typeof prisma & { event: EventDelegate };

  const event = await prismaWithEvent.event.findUnique({
    where: { id },
  });

  if (!event) {
    notFound();
  }

  return (
    <AdminShell title="이벤트 수정">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-6 border-b mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">이벤트 수정</h1>
          <p className="text-sm text-gray-500 mt-1">
            등록된 프로모션의 텍스트, 그라데이션 및 노출 우선순위 등의 설정을 편집합니다.
          </p>
        </div>

        <EventForm initialEvent={event} />
      </div>
    </AdminShell>
  );
}
