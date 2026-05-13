import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { EventForm } from "@/components/admin/events/event-form";

export const metadata: Metadata = {
  title: "이벤트 수정 | LocalTrip AX",
};

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminEditEventPage({ params }: EditEventPageProps) {
  await requireAdminSession();

  const { id } = await params;
  const prisma = getPrisma();
  await prisma.$connect();

  const event = await prisma.event.findFirst({
    where: {
      id,
      region: { slug: "sowon" },
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <AdminShell title="이벤트 수정">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 border-b py-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            이벤트 수정
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            등록된 소원권역 이벤트의 문구, 링크, 공개 상태를 수정합니다.
          </p>
        </div>

        <EventForm initialEvent={event} />
      </div>
    </AdminShell>
  );
}
