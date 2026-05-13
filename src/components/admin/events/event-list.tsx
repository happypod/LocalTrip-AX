"use client";

import Link from "next/link";
import { Event, PublishStatus } from "@prisma/client";
import { deleteEvent, updateEventStatus } from "@/app/admin/events/actions";

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  async function handleStatusChange(id: string, newStatus: PublishStatus) {
    if (!confirm(`이벤트 상태를 '${newStatus}'로 변경하시겠습니까?`)) return;

    try {
      await updateEventStatus(id, newStatus);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "상태 변경 중 오류가 발생했습니다.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("이 이벤트를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) return;

    try {
      await deleteEvent(id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다.");
    }
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
        아직 등록된 이벤트가 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold">태그 / 배너 정보</th>
              <th className="px-6 py-4 font-semibold">스타일 및 링크</th>
              <th className="px-6 py-4 font-semibold">설명</th>
              <th className="px-6 py-4 font-semibold">상태</th>
              <th className="px-6 py-4 font-semibold text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-primary font-black uppercase tracking-wider">{event.tag}</span>
                    <span className="font-bold text-gray-900 mt-0.5">{event.title}</span>
                    <span className="text-xs text-gray-500 mt-0.5 font-semibold">{event.subTitle}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-semibold">그라데이션: {event.gradient}</span>
                    <span className="text-xs text-gray-500 mt-1 font-semibold">
                      링크: <code className="bg-gray-100 px-1 py-0.5 rounded">{event.href}</code>
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium max-w-[280px] truncate" title={event.description}>
                  {event.description}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={event.status}
                    onChange={(e) => handleStatusChange(event.id, e.target.value as PublishStatus)}
                    className={`text-xs px-2.5 py-1 rounded-full font-bold border outline-none cursor-pointer ${
                      event.status === "published" ? "bg-green-50 text-green-700 border-green-200" :
                      event.status === "inactive" ? "bg-red-50 text-red-700 border-red-200" :
                      "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td className="px-6 py-4 flex items-center justify-end gap-2 mt-1">
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="text-primary hover:underline font-bold text-sm px-3 py-1.5 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:underline font-bold text-sm px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
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
