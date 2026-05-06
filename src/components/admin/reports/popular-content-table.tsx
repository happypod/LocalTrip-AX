import { PopularContentRow } from "@/lib/admin-reports";

interface PopularContentTableProps {
  items: PopularContentRow[];
}

export function PopularContentTable({ items }: PopularContentTableProps) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-1">
        <h2 className="text-lg font-bold text-gray-950">인기 콘텐츠 Top 10</h2>
        <p className="text-sm text-gray-500">LeadEvent의 클릭과 제출 이벤트를 기준으로 집계합니다.</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
          선택한 월에 집계된 콘텐츠 이벤트가 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 font-bold">순위</th>
                <th className="px-4 py-3 font-bold">유형</th>
                <th className="px-4 py-3 font-bold">콘텐츠명</th>
                <th className="px-4 py-3 text-right font-bold">클릭</th>
                <th className="px-4 py-3 text-right font-bold">문의/신청</th>
                <th className="px-4 py-3 text-right font-bold">합계</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item, index) => (
                <tr key={`${item.targetType}:${item.targetId}`} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 font-bold text-gray-400">{index + 1}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                      {item.targetTypeLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-950">{item.title}</div>
                    <div className="mt-0.5 max-w-[360px] truncate text-xs text-gray-400">{item.targetId}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-blue-700">{item.clickCount.toLocaleString("ko-KR")}</td>
                  <td className="px-4 py-3 text-right font-bold text-rose-700">{item.conversionCount.toLocaleString("ko-KR")}</td>
                  <td className="px-4 py-3 text-right font-black text-gray-950">{item.totalCount.toLocaleString("ko-KR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
