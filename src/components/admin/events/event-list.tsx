"use client";

import Link from "next/link";
import { Event, PublishStatus } from "@prisma/client";
import { deleteEvent, updateEventStatus } from "@/app/admin/events/actions";

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  async function handleStatusChange(id: string, newStatus: PublishStatus) {
    if (!confirm(`이벤트 상태를 '${newStatus}'로 변경하시겠습니까?`)) {
      return;
    }

    try {
      await updateEventStatus(id, newStatus);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "상태 변경 중 오류가 발생했습니다.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("이 이벤트를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    try {
      await deleteEvent(id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다.");
    }
  }

  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-gray-500 shadow-sm">
        아직 등록된 이벤트가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-semibold">태그 / 배너 정보</th>
              <th className="px-6 py-4 font-semibold">스타일 및 링크</th>
              <th className="px-6 py-4 font-semibold">설명</th>
              <th className="px-6 py-4 font-semibold">상태</th>
              <th className="px-6 py-4 text-right font-semibold">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((event) => (
              <tr key={event.id} className="transition-colors hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-wider text-primary">
                      {event.tag}
                    </span>
                    <span className="mt-0.5 font-bold text-gray-900">
                      {event.title}
                    </span>
                    <span className="mt-0.5 text-xs font-semibold text-gray-500">
                      {event.subTitle}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-400">
                      그라디언트: {event.gradient}
                    </span>
                    <span className="mt-1 text-xs font-semibold text-gray-500">
                      링크:{" "}
                      <code className="rounded bg-gray-100 px-1 py-0.5">
                        {event.href}
                      </code>
                    </span>
                  </div>
                </td>
                <td
                  className="max-w-[280px] truncate px-6 py-4 font-medium text-gray-600"
                  title={event.description}
                >
                  {event.description}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={event.status}
                    onChange={(selectEvent) =>
                      handleStatusChange(
                        event.id,
                        selectEvent.target.value as PublishStatus
                      )
                    }
                    className={`cursor-pointer rounded-full border px-2.5 py-1 text-xs font-bold outline-none ${
                      event.status === PublishStatus.published
                        ? "border-green-200 bg-green-50 text-green-700"
                        : event.status === PublishStatus.inactive
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  >
                    <option value={PublishStatus.published}>Published</option>
                    <option value={PublishStatus.draft}>Draft</option>
                    <option value={PublishStatus.inactive}>Inactive</option>
                  </select>
                </td>
                <td className="mt-1 flex items-center justify-end gap-2 px-6 py-4">
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="rounded-lg bg-primary/5 px-3 py-1.5 text-sm font-bold text-primary transition-colors hover:bg-primary/10 hover:underline"
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 hover:underline"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
