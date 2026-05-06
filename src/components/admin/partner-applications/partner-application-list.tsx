"use client";

import { useState } from "react";
import Link from "next/link";
import { PartnerApplication, InquiryStatus, Region } from "@prisma/client";
import { maskName, maskPhone, maskEmail } from "@/lib/privacy";
import { InquiryStatusBadge } from "@/components/admin/inquiry-status-select";
import { Eye } from "lucide-react";

type PartnerApplicationWithRelations = PartnerApplication & {
  region: Region;
};

type PartnerApplicationListItem = Omit<PartnerApplicationWithRelations, "message"> & {
  messagePreview: string;
};

interface PartnerApplicationListProps {
  applications: PartnerApplicationListItem[];
}

export function PartnerApplicationList({ applications }: PartnerApplicationListProps) {
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus | "all">("all");

  const filteredApplications = applications.filter(
    (app) => selectedStatus === "all" || app.status === selectedStatus
  );

  const getStatusCount = (status: InquiryStatus | "all") => {
    if (status === "all") return applications.length;
    return applications.filter((app) => app.status === status).length;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 상태 필터 탭 */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        <button
          onClick={() => setSelectedStatus("all")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            selectedStatus === "all"
              ? "bg-primary text-white"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          전체 ({getStatusCount("all")})
        </button>
        <button
          onClick={() => setSelectedStatus("new")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            selectedStatus === "new"
              ? "bg-blue-600 text-white"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
        >
          신규 접수 ({getStatusCount("new")})
        </button>
        <button
          onClick={() => setSelectedStatus("in_progress")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            selectedStatus === "in_progress"
              ? "bg-amber-500 text-white"
              : "bg-amber-50 text-amber-600 hover:bg-amber-100"
          }`}
        >
          처리 중 ({getStatusCount("in_progress")})
        </button>
        <button
          onClick={() => setSelectedStatus("resolved")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            selectedStatus === "resolved"
              ? "bg-emerald-600 text-white"
              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
          }`}
        >
          처리 완료 ({getStatusCount("resolved")})
        </button>
        <button
          onClick={() => setSelectedStatus("archived")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            selectedStatus === "archived"
              ? "bg-gray-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          보관됨 ({getStatusCount("archived")})
        </button>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center text-gray-400 font-medium">
          해당 상태의 입점신청 내역이 없습니다.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">접수일</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">사업명/상호</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">신청자명</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">연락처</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">이메일</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">사업유형</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">상세내용 요약</th>
                  <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">동의여부</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">상태</th>
                  <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                      {app.businessName}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {maskName(app.applicantName)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {maskPhone(app.phone)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {app.email ? maskEmail(app.email) : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {app.businessType || "미지정"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {app.messagePreview}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          app.privacyConsent
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {app.privacyConsent ? "동의" : "미동의"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <InquiryStatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/partner-applications/${app.id}`}
                        className="inline-flex items-center px-2.5 py-1.5 bg-primary/5 hover:bg-primary/10 text-primary rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> 상세 보기
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
