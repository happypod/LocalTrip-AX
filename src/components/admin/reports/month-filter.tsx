import Link from "next/link";

interface MonthFilterProps {
  selectedMonth: string;
}

function addMonths(monthValue: string, offset: number) {
  const [year, month] = monthValue.split("-").map(Number);
  const date = new Date(year, month - 1 + offset, 1);
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");

  return `${nextYear}-${nextMonth}`;
}

export function MonthFilter({ selectedMonth }: MonthFilterProps) {
  const previousMonth = addMonths(selectedMonth, -1);
  const nextMonth = addMonths(selectedMonth, 1);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-bold text-gray-950">조회 월</p>
        <p className="text-xs text-gray-500">월별 LeadEvent, 문의, 입점신청 데이터를 조회합니다.</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Link
          href={`/admin/reports?month=${previousMonth}`}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 px-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          이전 달
        </Link>
        <form action="/admin/reports" className="flex items-center gap-2">
          <input
            type="month"
            name="month"
            defaultValue={selectedMonth}
            className="h-10 rounded-xl border border-gray-200 px-3 text-sm font-semibold text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
          <button
            type="submit"
            className="h-10 rounded-xl bg-primary px-4 text-sm font-bold text-white hover:bg-primary/90"
          >
            적용
          </button>
        </form>
        <Link
          href={`/admin/reports?month=${nextMonth}`}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 px-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          다음 달
        </Link>
      </div>
    </div>
  );
}
