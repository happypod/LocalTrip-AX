import { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { EventTypeSummary } from "@/components/admin/reports/event-type-summary";
import { MonthFilter } from "@/components/admin/reports/month-filter";
import { PopularContentTable } from "@/components/admin/reports/popular-content-table";
import { RecentConversionList } from "@/components/admin/reports/recent-conversion-list";
import { ReportSummaryCard } from "@/components/admin/reports/report-summary-card";
import { getMonthlyReportData } from "@/lib/admin-reports";
import { requireAdminSession } from "@/lib/admin-auth";
import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  MousePointerClick,
  PhoneCall,
  UserPlus,
} from "lucide-react";

export const metadata: Metadata = {
  title: "월간 성과 요약 | LocalTrip AX",
};

export const dynamic = "force-dynamic";

interface AdminReportsPageProps {
  searchParams?: Promise<{
    month?: string | string[];
  }>;
}

export default async function AdminReportsPage({ searchParams }: AdminReportsPageProps) {
  await requireAdminSession();

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const report = await getMonthlyReportData(resolvedSearchParams?.month);
  const hasMonthlyData =
    report.summary.totalLeadEvents > 0 ||
    report.summary.actualInquiries > 0 ||
    report.summary.actualPartnerApplications > 0;

  return (
    <AdminShell title="월간 성과 요약">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Monthly Report</p>
          <h1 className="text-2xl font-black tracking-tight text-gray-950">월간 성과 요약</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-gray-500">
            LeadEvent, 문의, 입점신청 데이터를 기준으로 소원권역의 운영 흐름을 확인합니다.
            실제 AI 분석, 외부 Analytics, PDF/Excel export는 MVP 범위에서 제외합니다.
          </p>
        </div>

        <MonthFilter selectedMonth={report.month.value} />

        {!report.hasRegion && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-medium text-amber-800">
            소원 권역(sowon)이 등록되지 않아 성과 데이터를 집계할 수 없습니다.
          </div>
        )}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-950">{report.month.label} 운영 지표</h2>
              <p className="text-sm text-gray-500">
                {hasMonthlyData
                  ? "선택한 월에 수집된 전환 데이터를 요약했습니다."
                  : "선택한 월에 수집된 데이터가 없습니다."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <span className="rounded-xl bg-category-stay/10 px-3 py-2 font-bold text-category-stay">
                숙소 {report.publishedCounts.accommodations}
              </span>
              <span className="rounded-xl bg-category-experience/10 px-3 py-2 font-bold text-category-experience">
                체험 {report.publishedCounts.experiences}
              </span>
              <span className="rounded-xl bg-category-program/10 px-3 py-2 font-bold text-category-program">
                주민소득상품 {report.publishedCounts.programs}
              </span>
              <span className="rounded-xl bg-category-course/10 px-3 py-2 font-bold text-category-course">
                코스 {report.publishedCounts.courses}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <ReportSummaryCard
            title="전체 LeadEvent"
            value={report.summary.totalLeadEvents}
            description="선택 월에 수집된 전체 이벤트"
            icon={BarChart3}
            tone="purple"
          />
          <ReportSummaryCard
            title="CTA 클릭"
            value={report.summary.ctaClicks}
            description="전화, 카카오, 예약, 홈페이지 클릭"
            icon={MousePointerClick}
            tone="blue"
          />
          <ReportSummaryCard
            title="문의 제출 이벤트"
            value={report.summary.inquirySubmitEvents}
            description="LeadEvent 기준 inquiry_submit"
            icon={ClipboardList}
            tone="rose"
          />
          <ReportSummaryCard
            title="입점신청 이벤트"
            value={report.summary.partnerApplySubmitEvents}
            description="LeadEvent 기준 partner_apply_submit"
            icon={UserPlus}
            tone="amber"
          />
          <ReportSummaryCard
            title="실제 문의"
            value={report.summary.actualInquiries}
            description="Inquiry 생성 건수"
            icon={PhoneCall}
            tone="green"
          />
          <ReportSummaryCard
            title="실제 입점신청"
            value={report.summary.actualPartnerApplications}
            description="PartnerApplication 생성 건수"
            icon={CheckCircle2}
            tone="default"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <EventTypeSummary rows={report.eventTypeSummary} />
          <PopularContentTable items={report.popularContent} />
        </div>

        <RecentConversionList
          leadEvents={report.recentLeadEvents}
          inquiries={report.recentInquiries}
          partnerApplications={report.recentPartnerApplications}
        />
      </div>
    </AdminShell>
  );
}
