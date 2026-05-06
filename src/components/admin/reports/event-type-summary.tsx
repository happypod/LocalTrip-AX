import { EventTypeSummaryRow } from "@/lib/admin-reports";

interface EventTypeSummaryProps {
  rows: EventTypeSummaryRow[];
}

export function EventTypeSummary({ rows }: EventTypeSummaryProps) {
  const maxCount = Math.max(...rows.map((row) => row.count), 0);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-1">
        <h2 className="text-lg font-bold text-gray-950">이벤트 타입별 요약</h2>
        <p className="text-sm text-gray-500">선택한 월의 LeadEvent 유형별 수집 현황입니다.</p>
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((row) => {
          const width = maxCount > 0 ? Math.max((row.count / maxCount) * 100, row.count > 0 ? 8 : 0) : 0;

          return (
            <div key={row.eventType} className="grid grid-cols-1 gap-2 sm:grid-cols-[150px_1fr_70px] sm:items-center">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-gray-700">{row.label}</span>
                <span className="text-xs text-gray-400 sm:hidden">{row.count.toLocaleString("ko-KR")}건</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${width}%` }}
                />
              </div>
              <div className="hidden text-right text-sm font-bold text-gray-900 sm:block">
                {row.count.toLocaleString("ko-KR")}건
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
