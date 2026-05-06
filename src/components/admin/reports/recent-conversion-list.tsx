import {
  RecentInquiryRow,
  RecentLeadEventRow,
  RecentPartnerApplicationRow,
} from "@/lib/admin-reports";

interface RecentConversionListProps {
  leadEvents: RecentLeadEventRow[];
  inquiries: RecentInquiryRow[];
  partnerApplications: RecentPartnerApplicationRow[];
}

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RecentConversionList({
  leadEvents,
  inquiries,
  partnerApplications,
}: RecentConversionListProps) {
  return (
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-950">최근 LeadEvent</h2>
        <div className="mt-4 flex flex-col gap-3">
          {leadEvents.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-500">
              선택한 월에 LeadEvent가 없습니다.
            </p>
          ) : (
            leadEvents.map((event) => (
              <div key={event.id} className="rounded-xl border border-gray-100 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-gray-950">{event.eventLabel}</span>
                  <span className="text-xs text-gray-400">{formatDateTime(event.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{event.title}</p>
                <p className="mt-1 truncate text-xs text-gray-400">
                  {event.targetTypeLabel} · {event.sourcePath}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-950">최근 문의</h2>
        <div className="mt-4 flex flex-col gap-3">
          {inquiries.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-500">
              선택한 월에 문의가 없습니다.
            </p>
          ) : (
            inquiries.map((inquiry) => (
              <div key={inquiry.id} className="rounded-xl border border-gray-100 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-gray-950">{inquiry.name}</span>
                  <span className="text-xs text-gray-400">{formatDateTime(inquiry.createdAt)}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {inquiry.phone || "-"} · {inquiry.email}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">{inquiry.messagePreview}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-950">최근 입점신청</h2>
        <div className="mt-4 flex flex-col gap-3">
          {partnerApplications.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-500">
              선택한 월에 입점신청이 없습니다.
            </p>
          ) : (
            partnerApplications.map((application) => (
              <div key={application.id} className="rounded-xl border border-gray-100 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-bold text-gray-950">{application.businessName}</span>
                  <span className="text-xs text-gray-400">{formatDateTime(application.createdAt)}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {application.applicantName} · {application.phone} · {application.email}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">{application.messagePreview}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
