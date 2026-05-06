import { LucideIcon } from "lucide-react";

interface ReportSummaryCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  tone?: "default" | "blue" | "green" | "amber" | "rose" | "purple";
}

const TONE_CLASS: Record<NonNullable<ReportSummaryCardProps["tone"]>, string> = {
  default: "bg-gray-50 text-gray-700 border-gray-100",
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  green: "bg-emerald-50 text-emerald-700 border-emerald-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  rose: "bg-rose-50 text-rose-700 border-rose-100",
  purple: "bg-purple-50 text-purple-700 border-purple-100",
};

export function ReportSummaryCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "default",
}: ReportSummaryCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-gray-950">{value.toLocaleString("ko-KR")}</p>
        </div>
        <div className={`rounded-xl border p-2.5 ${TONE_CLASS[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-500">{description}</p>
    </div>
  );
}
