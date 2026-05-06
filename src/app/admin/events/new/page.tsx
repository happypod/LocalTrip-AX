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
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-6 border-b mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">새 이벤트 등록</h1>
          <p className="text-sm text-gray-500 mt-1">
            새로운 프로모션이나 기획전 이벤트를 홈 화면에 배출할 수 있게 설정합니다.
          </p>
        </div>

        <EventForm />
      </div>
    </AdminShell>
  );
}
