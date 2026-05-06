"use client";

import { useState } from "react";
import Link from "next/link";
import { Inquiry, InquiryStatus, Region } from "@prisma/client";
import { maskName, maskPhone, maskEmail } from "@/lib/privacy";
import { InquiryStatusBadge } from "@/components/admin/inquiry-status-select";
import { Eye } from "lucide-react";

type InquiryWithRelations = Inquiry & {
  region: Region;
};

type InquiryListItem = Omit<InquiryWithRelations, "message"> & {
  messagePreview: string;
};

interface InquiryListProps {
  inquiries: InquiryListItem[];
}

export function InquiryList({ inquiries }: InquiryListProps) {
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus | "all">("all");

  const filteredInquiries = inquiries.filter(
    (inq) => selectedStatus === "all" || inq.status === selectedStatus
  );

  const formatTargetType = (type: string | null) => {
    if (!type) return "일반";
    switch (type) {
      case "accommodation":
        return "숙소";
      case "experience":
        return "체험";
      case "local_income_program":
        return "주민소득상품";
      case "course":
        return "코스";
      case "general":
        return "일반";
      default:
        return type;
    }
  };

  const getStatusCount = (status: InquiryStatus | "all") => {
    if (status === "all") return inquiries.length;
    return inquiries.filter((inq) => inq.status === status).length;
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

      {filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center text-gray-400 font-medium">
          해당 상태의 문의 내역이 없습니다.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">접수일</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">문의자명</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">연락처</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">이메일</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">문의대상</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">메시지 요약</th>
                  <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">동의여부</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">상태</th>
                  <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(inq.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {maskName(inq.name)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {maskPhone(inq.phone)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {inq.email ? maskEmail(inq.email) : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {formatTargetType(inq.targetType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {inq.messagePreview}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          inq.privacyConsent
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {inq.privacyConsent ? "동의" : "미동의"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <InquiryStatusBadge status={inq.status} />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/inquiries/${inq.id}`}
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
