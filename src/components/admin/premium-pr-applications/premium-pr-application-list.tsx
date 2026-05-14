"use client";

import { useState } from "react";
import Link from "next/link";
import { InquiryStatus } from "@prisma/client";
import { Eye } from "lucide-react";
import { InquiryStatusBadge } from "@/components/admin/inquiry-status-select";

export type PremiumPrApplicationListItem = {
  id: string;
  createdAt: Date;
  businessName: string;
  applicantNameMasked: string;
  phoneMasked: string;
  emailMasked: string;
  businessType: string | null;
  messagePreview: string;
  privacyConsent: boolean;
  status: InquiryStatus;
};

interface PremiumPrApplicationListProps {
  applications: PremiumPrApplicationListItem[];
}

const STATUS_FILTERS: Array<{ value: InquiryStatus | "all"; label: string }> = [
  { value: "all", label: "전체" },
  { value: "new", label: "신규 접수" },
  { value: "in_progress", label: "처리 중" },
  { value: "resolved", label: "완료" },
  { value: "archived", label: "보관" },
];

export function PremiumPrApplicationList({
  applications,
}: PremiumPrApplicationListProps) {
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus | "all">(
    "all"
  );

  const filteredApplications = applications.filter(
    (application) =>
      selectedStatus === "all" || application.status === selectedStatus
  );
  const getStatusCount = (status: InquiryStatus | "all") =>
    status === "all"
      ? applications.length
      : applications.filter((application) => application.status === status)
          .length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setSelectedStatus(filter.value)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              selectedStatus === filter.value
                ? "bg-primary text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {filter.label} ({getStatusCount(filter.value)})
          </button>
        ))}
      </div>

      {filteredApplications.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center text-sm font-semibold text-gray-400 shadow-sm">
          해당 조건의 프리미엄 PR 제작 문의가 없습니다.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-gray-600">
                <tr>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">
                    접수일
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">
                    사업장/단체명
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">
                    신청자
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">
                    연락처
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">
                    이메일
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">
                    내용 요약
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">
                    상태
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-right font-semibold">
                    상세
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplications.map((application) => (
                  <tr
                    key={application.id}
                    className="transition-colors hover:bg-gray-50/60"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      {new Date(application.createdAt).toLocaleDateString(
                        "ko-KR",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-950">
                      {application.businessName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      {application.applicantNameMasked}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {application.phoneMasked}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {application.emailMasked || "-"}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-gray-500">
                      {application.messagePreview}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <InquiryStatusBadge status={application.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <Link
                        href={`/admin/premium-pr-applications/${application.id}`}
                        className="inline-flex items-center rounded-lg bg-primary/5 px-2.5 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
                      >
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        상세 보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
