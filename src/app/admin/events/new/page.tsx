import { Metadata } from "next";
import { requireAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { EventForm } from "@/components/admin/events/event-form";

export const metadata: Metadata = {
  title: "새 이벤트 등록 | LocalTrip AX",
};

export default async function AdminNewEventPage() {
  await requireAdminSession();

  return (
    <AdminShell title="새 이벤트 등록">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 border-b py-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            새 이벤트 등록
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            소원권역 공개 화면에 노출할 운영 소식을 등록합니다.
          </p>
        </div>

        <EventForm />
      </div>
    </AdminShell>
  );
}
