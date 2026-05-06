import { InquiryStatus } from "@prisma/client";

const STATUS_MAP: Record<InquiryStatus, { label: string; className: string }> = {
  new: { label: "신규 접수", className: "bg-blue-50 text-blue-600 border border-blue-100" },
  in_progress: { label: "처리 중", className: "bg-amber-50 text-amber-600 border border-amber-100" },
  resolved: { label: "처리 완료", className: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
  archived: { label: "보관됨", className: "bg-gray-100 text-gray-500 border border-gray-200" },
};

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  const config = STATUS_MAP[status] || { label: status, className: "bg-gray-100 text-gray-500 border" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}

interface InquiryStatusSelectProps {
  status: InquiryStatus;
  onChange: (newStatus: InquiryStatus) => void;
  disabled?: boolean;
}

export function InquiryStatusSelect({ status, onChange, disabled }: InquiryStatusSelectProps) {
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as InquiryStatus)}
      disabled={disabled}
      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
    >
      <option value="new">신규 접수</option>
      <option value="in_progress">처리 중</option>
      <option value="resolved">처리 완료</option>
      <option value="archived">보관됨</option>
    </select>
  );
}
